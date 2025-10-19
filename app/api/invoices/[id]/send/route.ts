import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInvoiceById } from '@/lib/db/invoices'
import { getProfile } from '@/lib/db/profiles'
import { Resend } from 'resend'
import { getInvoiceEmailTemplate } from '@/lib/email/templates'
import { renderToStream } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/invoices/invoice-pdf'
import { createElement } from 'react'
import { updateInvoiceStatus } from '@/lib/db/invoice-actions'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/invoices/[id]/send
 * Send invoice via email with PDF attachment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch invoice with client data
    const invoice = await getInvoiceById(id, user.id)

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Verify client has email
    if (!invoice.client?.email) {
      return NextResponse.json(
        { error: 'Client email not found. Please add an email address to the client.' },
        { status: 400 }
      )
    }

    // Fetch user profile for company info
    const profile = await getProfile(user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' },
        { status: 500 }
      )
    }

    // Generate PDF
    const isPro = profile.subscription_tier === 'pro' || profile.subscription_tier === 'business'
    const pdfElement = createElement(InvoicePDF, {
      invoice,
      profile,
      isPro,
    })

    const stream = await renderToStream(pdfElement)
    const chunks: Uint8Array[] = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const pdfBuffer = Buffer.concat(chunks)

    // Get email template
    const emailTemplate = getInvoiceEmailTemplate(invoice, profile)

    // Send email via Resend
    const fromEmail = profile.company_email || `noreply@invoicenest.com`
    const fromName = profile.company_name || 'InvoiceNest'

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [invoice.client.email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      attachments: [
        {
          filename: `invoice-${invoice.invoice_number}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email: ' + emailError.message },
        { status: 500 }
      )
    }

    // Update invoice status to 'sent' if it was draft
    if (invoice.status === 'draft') {
      await updateInvoiceStatus(id, user.id, 'sent')
    }

    return NextResponse.json(
      {
        success: true,
        message: `Invoice sent to ${invoice.client.email}`,
        emailId: emailData?.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending invoice:', error)
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInvoiceById } from '@/lib/db/invoices'
import { getProfile } from '@/lib/db/profiles'
import { renderToStream } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/invoices/invoice-pdf'
import React from 'react'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
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

    // Fetch user profile for company info
    const profile = await getProfile(user.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if user is pro (no watermark)
    const isPro = profile.subscription_tier === 'pro' || profile.subscription_tier === 'business'

    // Generate PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = await renderToStream(
      React.createElement(InvoicePDF, {
        invoice,
        profile,
        isPro,
      }) as any
    )

    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk))
    }
    const buffer = Buffer.concat(chunks)

    // Return PDF with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

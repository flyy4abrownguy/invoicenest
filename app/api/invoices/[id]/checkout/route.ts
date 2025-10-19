import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInvoiceById } from '@/lib/db/invoices'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config'

/**
 * POST /api/invoices/[id]/checkout
 * Create Stripe checkout session for invoice payment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user (optional - client can pay without auth)
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch invoice - allow public access for client payments
    const invoice = await getInvoiceById(id, user?.id || '')

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Don't allow payment if already paid
    if (invoice.status === 'paid') {
      return NextResponse.json(
        { error: 'This invoice has already been paid' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: `Invoice ${invoice.invoice_number}`,
              description: invoice.client?.name
                ? `Payment for ${invoice.client.name}`
                : 'Invoice payment',
            },
            unit_amount: Math.round(invoice.total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${id}`,
      metadata: {
        invoice_id: id,
        invoice_number: invoice.invoice_number,
      },
      customer_email: invoice.client?.email || undefined,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

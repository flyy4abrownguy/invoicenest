import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const invoiceId = session.metadata?.invoice_id

  if (!invoiceId) {
    console.error('No invoice_id in session metadata')
    return
  }

  // Update invoice status to paid
  const supabase = await createSupabaseClient()

  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)

  if (error) {
    console.error('Error updating invoice:', error)
    throw error
  }

  // Optionally: Record payment in payments table
  await supabase.from('payments').insert({
    invoice_id: invoiceId,
    amount: (session.amount_total || 0) / 100,
    payment_date: new Date().toISOString(),
    payment_method: 'stripe',
    transaction_id: session.payment_intent as string,
    notes: `Paid via Stripe Checkout (${session.id})`,
  })

  console.log(`Invoice ${invoiceId} marked as paid`)
}

"use client"

import { useState } from "react"
import { NestButton } from "@/components/nest/nest-button"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentButtonProps {
  invoiceId: string
  children: React.ReactNode
  className?: string
}

export function PaymentButton({ invoiceId, children, className }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Create checkout session
      const response = await fetch(`/api/invoices/${invoiceId}/checkout`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert(error instanceof Error ? error.message : 'Failed to initiate payment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <NestButton
      size="lg"
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
      withNest
    >
      {isLoading ? 'Processing...' : children}
    </NestButton>
  )
}

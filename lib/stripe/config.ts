import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const STRIPE_CONFIG = {
  currency: 'usd',
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
}

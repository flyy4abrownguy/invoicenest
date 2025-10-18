// Feature flags and tier configuration for testing

// Test accounts with full business tier access
const BUSINESS_TIER_TEST_ACCOUNTS = [
  'akilrajpari@gmail.com',
  // Add more test emails here
]

export interface TierLimits {
  invoices_per_month: number | null  // null = unlimited
  max_clients: number | null          // null = unlimited
  recurring_invoices: boolean
  remove_watermark: boolean
  payment_links: boolean
  custom_branding: boolean
  priority_support: boolean
  tier: 'free' | 'pro' | 'business'
}

export const TIER_LIMITS: Record<'free' | 'pro' | 'business', TierLimits> = {
  free: {
    invoices_per_month: 5,
    max_clients: 3,
    recurring_invoices: false,
    remove_watermark: false,
    payment_links: false,
    custom_branding: false,
    priority_support: false,
    tier: 'free'
  },
  pro: {
    invoices_per_month: null,
    max_clients: null,
    recurring_invoices: true,
    remove_watermark: true,
    payment_links: false,
    custom_branding: false,
    priority_support: false,
    tier: 'pro'
  },
  business: {
    invoices_per_month: null,
    max_clients: null,
    recurring_invoices: true,
    remove_watermark: true,
    payment_links: true,
    custom_branding: true,
    priority_support: true,
    tier: 'business'
  }
}

/**
 * Get tier limits for a user based on their email
 * For testing: akilrajpari@gmail.com gets business tier
 */
export function getTierLimits(userEmail: string): TierLimits {
  // Check if this is a test account with business tier access
  if (BUSINESS_TIER_TEST_ACCOUNTS.includes(userEmail.toLowerCase())) {
    return TIER_LIMITS.business
  }

  // TODO: In production, fetch from database based on subscription
  // For now, everyone else gets free tier
  return TIER_LIMITS.free
}

/**
 * Check if a feature is enabled for a user
 */
export function hasFeature(userEmail: string, feature: keyof Omit<TierLimits, 'tier'>): boolean {
  const limits = getTierLimits(userEmail)
  return Boolean(limits[feature])
}

/**
 * Check if user can create more invoices this month
 */
export function canCreateInvoice(userEmail: string, currentMonthCount: number): boolean {
  const limits = getTierLimits(userEmail)
  if (limits.invoices_per_month === null) return true // unlimited
  return currentMonthCount < limits.invoices_per_month
}

/**
 * Check if user can add more clients
 */
export function canAddClient(userEmail: string, currentClientCount: number): boolean {
  const limits = getTierLimits(userEmail)
  if (limits.max_clients === null) return true // unlimited
  return currentClientCount < limits.max_clients
}

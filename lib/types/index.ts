export type SubscriptionTier = 'free' | 'pro' | 'business';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type RecurringFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_name?: string;
  company_logo?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id?: string;
  invoice_count: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  sort_order: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id?: string;
  client?: Client;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  notes?: string;
  payment_terms?: string;
  is_recurring: boolean;
  recurring_frequency?: RecurringFrequency;
  next_invoice_date?: string;
  items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  transaction_id?: string;
  notes?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionTier;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start?: string;
  current_period_end?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  pendingAmount: number;
  overdueCount: number;
}

export interface RecurringInvoiceItem {
  id: string;
  recurring_invoice_id: string;
  description: string;
  quantity: number;
  rate: number;
  created_at: string;
}

export interface RecurringInvoice {
  id: string;
  user_id: string;
  client_id: string;
  client?: Client;
  frequency: RecurringFrequency;
  start_date: string;
  end_date?: string;
  next_generation_date: string;
  is_active: boolean;
  invoice_number_prefix: string;
  payment_terms: number;
  notes?: string;
  tax_rate: number;
  items?: RecurringInvoiceItem[];
  created_at: string;
  updated_at: string;
}

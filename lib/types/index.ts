export type SubscriptionTier = 'free' | 'pro' | 'business';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type RecurringFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'CHF' | 'CNY' | 'SEK';
export type ReminderType = 'before_due' | 'on_due' | 'after_due';
export type ExpensePaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'other';
export type PortalActivityType = 'view' | 'download' | 'payment_attempt' | 'payment_success';
export type LogoPosition = 'left' | 'center' | 'right';

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
  default_currency?: Currency;
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
  currency?: Currency;
  exchange_rate?: number;
  template_id?: string;
  theme_color?: string;
  last_reminder_sent_at?: string;
  reminder_count?: number;
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
  currency?: Currency;
  items?: RecurringInvoiceItem[];
  created_at: string;
  updated_at: string;
}

// New feature types

export interface InvoiceTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  theme_color: string;
  font_family: string;
  logo_position: LogoPosition;
  default_payment_terms: number;
  default_tax_rate: number;
  default_notes?: string;
  items?: InvoiceTemplateItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceTemplateItem {
  id: string;
  template_id: string;
  description: string;
  quantity: number;
  rate: number;
  sort_order: number;
  created_at: string;
}

export interface PaymentReminderSettings {
  id: string;
  user_id: string;
  days_before_due: number[];
  days_after_due: number[];
  subject_template: string;
  body_template?: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentReminder {
  id: string;
  invoice_id: string;
  reminder_type: ReminderType;
  days_offset: number;
  sent_at: string;
  email_to: string;
  email_subject: string;
  created_at: string;
}

export interface ExpenseCategory {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id?: string;
  category?: ExpenseCategory;
  client_id?: string;
  client?: Client;
  description: string;
  amount: number;
  currency: Currency;
  expense_date: string;
  payment_method?: ExpensePaymentMethod;
  receipt_url?: string;
  notes?: string;
  is_billable: boolean;
  is_billed: boolean;
  invoice_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientPortalAccess {
  id: string;
  client_id: string;
  access_token: string;
  email: string;
  is_enabled: boolean;
  allow_payment: boolean;
  allow_download: boolean;
  last_accessed_at?: string;
  access_count: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceShare {
  id: string;
  invoice_id: string;
  share_token: string;
  is_public: boolean;
  requires_password: boolean;
  password_hash?: string;
  expires_at?: string;
  view_count: number;
  last_viewed_at?: string;
  created_at: string;
}

export interface PortalActivityLog {
  id: string;
  client_id?: string;
  invoice_id?: string;
  activity_type: PortalActivityType;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

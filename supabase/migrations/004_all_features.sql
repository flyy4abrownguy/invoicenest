-- Migration 004: Multi-currency, Templates, Payment Reminders, Expenses, Client Portal
-- This migration adds support for 5 major features

-- ============================================================================
-- 1. MULTI-CURRENCY SUPPORT
-- ============================================================================

-- Add currency support to invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC(10,4) DEFAULT 1.0;

-- Add default currency to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS default_currency TEXT DEFAULT 'USD';

-- Add currency to recurring invoices
ALTER TABLE recurring_invoices
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- ============================================================================
-- 2. INVOICE TEMPLATES & THEMES
-- ============================================================================

-- Create invoice templates table
CREATE TABLE IF NOT EXISTS invoice_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,

  -- Styling options
  theme_color TEXT DEFAULT '#3B82F6',
  font_family TEXT DEFAULT 'Inter',
  logo_position TEXT DEFAULT 'left' CHECK (logo_position IN ('left', 'center', 'right')),

  -- Default settings
  default_payment_terms INTEGER DEFAULT 30,
  default_tax_rate NUMERIC(5,2) DEFAULT 0,
  default_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoice template items (pre-filled line items)
CREATE TABLE IF NOT EXISTS invoice_template_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES invoice_templates(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  quantity NUMERIC(10,2) DEFAULT 1,
  rate NUMERIC(12,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add template reference to invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES invoice_templates(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#3B82F6';

-- Indexes for templates
CREATE INDEX IF NOT EXISTS idx_invoice_templates_user_id ON invoice_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_invoice_template_items_template_id ON invoice_template_items(template_id);

-- RLS for invoice_templates
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates"
  ON invoice_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates"
  ON invoice_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON invoice_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON invoice_templates FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for invoice_template_items
ALTER TABLE invoice_template_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items of their templates"
  ON invoice_template_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoice_templates
      WHERE invoice_templates.id = invoice_template_items.template_id
      AND invoice_templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create items for their templates"
  ON invoice_template_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoice_templates
      WHERE invoice_templates.id = invoice_template_items.template_id
      AND invoice_templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items of their templates"
  ON invoice_template_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM invoice_templates
      WHERE invoice_templates.id = invoice_template_items.template_id
      AND invoice_templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items of their templates"
  ON invoice_template_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM invoice_templates
      WHERE invoice_templates.id = invoice_template_items.template_id
      AND invoice_templates.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. PAYMENT REMINDERS
-- ============================================================================

-- Create payment reminder settings table
CREATE TABLE IF NOT EXISTS payment_reminder_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Reminder schedule
  days_before_due INTEGER[] DEFAULT ARRAY[7, 3, 1],
  days_after_due INTEGER[] DEFAULT ARRAY[1, 7, 14],

  -- Email template
  subject_template TEXT DEFAULT 'Payment Reminder: Invoice {{invoice_number}}',
  body_template TEXT,

  is_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Create payment reminder log table
CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('before_due', 'on_due', 'after_due')),
  days_offset INTEGER NOT NULL,

  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_to TEXT NOT NULL,
  email_subject TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add reminder tracking to invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;

-- Indexes for reminders
CREATE INDEX IF NOT EXISTS idx_payment_reminders_invoice_id ON payment_reminders(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_reminder_tracking ON invoices(due_date, status) WHERE status IN ('sent', 'overdue');

-- RLS for payment_reminder_settings
ALTER TABLE payment_reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminder settings"
  ON payment_reminder_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminder settings"
  ON payment_reminder_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminder settings"
  ON payment_reminder_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS for payment_reminders
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reminders for their invoices"
  ON payment_reminders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payment_reminders.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create reminders"
  ON payment_reminders FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 4. EXPENSE TRACKING
-- ============================================================================

-- Create expense categories table
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6B7280',

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, name)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,

  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  expense_date DATE NOT NULL,
  payment_method TEXT,

  -- Receipt/documentation
  receipt_url TEXT,
  notes TEXT,

  -- Billing status
  is_billable BOOLEAN DEFAULT false,
  is_billed BOOLEAN DEFAULT false,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for expenses
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_client_id ON expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_billable ON expenses(is_billable, is_billed) WHERE is_billable = true;

-- RLS for expense_categories
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expense categories"
  ON expense_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expense categories"
  ON expense_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expense categories"
  ON expense_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expense categories"
  ON expense_categories FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. CLIENT PORTAL
-- ============================================================================

-- Create client portal access table
CREATE TABLE IF NOT EXISTS client_portal_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Access credentials
  access_token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,

  -- Portal settings
  is_enabled BOOLEAN DEFAULT true,
  allow_payment BOOLEAN DEFAULT true,
  allow_download BOOLEAN DEFAULT true,

  -- Tracking
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(client_id)
);

-- Create invoice shares table (public links)
CREATE TABLE IF NOT EXISTS invoice_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  share_token TEXT NOT NULL UNIQUE,

  -- Access control
  is_public BOOLEAN DEFAULT false,
  requires_password BOOLEAN DEFAULT false,
  password_hash TEXT,

  expires_at TIMESTAMPTZ,

  -- Tracking
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(invoice_id)
);

-- Create portal activity log
CREATE TABLE IF NOT EXISTS portal_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,

  activity_type TEXT NOT NULL CHECK (activity_type IN ('view', 'download', 'payment_attempt', 'payment_success')),
  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for portal
CREATE INDEX IF NOT EXISTS idx_client_portal_access_client_id ON client_portal_access(client_id);
CREATE INDEX IF NOT EXISTS idx_client_portal_access_token ON client_portal_access(access_token);
CREATE INDEX IF NOT EXISTS idx_invoice_shares_invoice_id ON invoice_shares(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_shares_token ON invoice_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_portal_activity_log_client_id ON portal_activity_log(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_activity_log_invoice_id ON portal_activity_log(invoice_id);

-- RLS for client_portal_access
ALTER TABLE client_portal_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view portal access for their clients"
  ON client_portal_access FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_portal_access.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage portal access for their clients"
  ON client_portal_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_portal_access.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- RLS for invoice_shares
ALTER TABLE invoice_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shares for their invoices"
  ON invoice_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_shares.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage shares for their invoices"
  ON invoice_shares FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_shares.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

-- Public read access for invoice shares (with token)
CREATE POLICY "Public can view invoices with valid share token"
  ON invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoice_shares
      WHERE invoice_shares.invoice_id = invoices.id
      AND invoice_shares.is_public = true
      AND (invoice_shares.expires_at IS NULL OR invoice_shares.expires_at > NOW())
    )
  );

-- RLS for portal_activity_log
ALTER TABLE portal_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activity for their clients"
  ON portal_activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = portal_activity_log.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "System can log portal activity"
  ON portal_activity_log FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp for templates
CREATE OR REPLACE FUNCTION update_invoice_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_templates_updated_at
  BEFORE UPDATE ON invoice_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_templates_updated_at();

-- Update updated_at timestamp for reminder settings
CREATE OR REPLACE FUNCTION update_payment_reminder_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_reminder_settings_updated_at
  BEFORE UPDATE ON payment_reminder_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_reminder_settings_updated_at();

-- Update updated_at timestamp for expenses
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_expenses_updated_at();

-- Update updated_at timestamp for portal access
CREATE OR REPLACE FUNCTION update_client_portal_access_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_portal_access_updated_at
  BEFORE UPDATE ON client_portal_access
  FOR EACH ROW
  EXECUTE FUNCTION update_client_portal_access_updated_at();

-- Function to generate random access token
CREATE OR REPLACE FUNCTION generate_access_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Insert default expense categories for each user (run via application logic)
-- This is a sample - actual implementation should be in app code

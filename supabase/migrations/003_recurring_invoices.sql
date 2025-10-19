-- Create recurring_invoices table
CREATE TABLE IF NOT EXISTS recurring_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Recurring settings
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  next_generation_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Invoice template data
  invoice_number_prefix TEXT NOT NULL,
  payment_terms INTEGER DEFAULT 30,
  notes TEXT,
  tax_rate NUMERIC(5,2) DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create recurring_invoice_items table
CREATE TABLE IF NOT EXISTS recurring_invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recurring_invoice_id UUID NOT NULL REFERENCES recurring_invoices(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  rate NUMERIC(12,2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_recurring_invoices_user_id ON recurring_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_invoices_next_gen ON recurring_invoices(next_generation_date) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_recurring_invoice_items_recurring_id ON recurring_invoice_items(recurring_invoice_id);

-- Enable RLS
ALTER TABLE recurring_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recurring_invoices
CREATE POLICY "Users can view their own recurring invoices"
  ON recurring_invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring invoices"
  ON recurring_invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring invoices"
  ON recurring_invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring invoices"
  ON recurring_invoices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for recurring_invoice_items
CREATE POLICY "Users can view items of their recurring invoices"
  ON recurring_invoice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recurring_invoices
      WHERE recurring_invoices.id = recurring_invoice_items.recurring_invoice_id
      AND recurring_invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create items for their recurring invoices"
  ON recurring_invoice_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recurring_invoices
      WHERE recurring_invoices.id = recurring_invoice_items.recurring_invoice_id
      AND recurring_invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items of their recurring invoices"
  ON recurring_invoice_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM recurring_invoices
      WHERE recurring_invoices.id = recurring_invoice_items.recurring_invoice_id
      AND recurring_invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items of their recurring invoices"
  ON recurring_invoice_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM recurring_invoices
      WHERE recurring_invoices.id = recurring_invoice_items.recurring_invoice_id
      AND recurring_invoices.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_recurring_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_recurring_invoices_updated_at
  BEFORE UPDATE ON recurring_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_recurring_invoices_updated_at();

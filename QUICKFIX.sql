-- QUICK FIX for RLS Infinite Recursion
-- Copy this entire file and run it in Supabase SQL Editor
-- https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv/sql/new

-- Drop the problematic policy
DROP POLICY IF EXISTS "Public can view invoices with valid share token" ON invoices;

-- Create a security definer function to check if an invoice has a valid public share
CREATE OR REPLACE FUNCTION is_invoice_publicly_shared(invoice_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_valid_share BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM invoice_shares
    WHERE invoice_shares.invoice_id = invoice_uuid
    AND invoice_shares.is_public = true
    AND (invoice_shares.expires_at IS NULL OR invoice_shares.expires_at > NOW())
  ) INTO has_valid_share;

  RETURN has_valid_share;
END;
$$;

-- Create new policy using the security definer function
CREATE POLICY "Public can view invoices with valid share token"
  ON invoices FOR SELECT
  USING (is_invoice_publicly_shared(id));

-- Allow public read access to invoice_shares
DROP POLICY IF EXISTS "Public can read valid invoice shares" ON invoice_shares;
CREATE POLICY "Public can read valid invoice shares"
  ON invoice_shares FOR SELECT
  USING (
    is_public = true
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Allow public access to invoice_items for shared invoices
DROP POLICY IF EXISTS "Public can view items of shared invoices" ON invoice_items;
CREATE POLICY "Public can view items of shared invoices"
  ON invoice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoice_shares
      WHERE invoice_shares.invoice_id = invoice_items.invoice_id
      AND invoice_shares.is_public = true
      AND (invoice_shares.expires_at IS NULL OR invoice_shares.expires_at > NOW())
    )
  );

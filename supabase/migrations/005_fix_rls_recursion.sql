-- Migration 005: Fix RLS infinite recursion

-- The issue is that the "Public can view invoices with valid share token" policy
-- creates a circular dependency between invoices and invoice_shares tables.
-- We need to drop and recreate this policy with security definer functions.

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
-- This breaks the circular dependency by using a function instead of EXISTS subquery
CREATE POLICY "Public can view invoices with valid share token"
  ON invoices FOR SELECT
  USING (is_invoice_publicly_shared(id));

-- Also need to allow public read access to invoice_shares for the share token lookup
-- This policy allows anyone to read share records (needed for public invoice viewing)
CREATE POLICY "Public can read valid invoice shares"
  ON invoice_shares FOR SELECT
  USING (
    is_public = true
    AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Similarly, we need public access to invoice_items for shared invoices
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

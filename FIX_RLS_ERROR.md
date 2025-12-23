# Fix RLS Infinite Recursion Error

## The Problem

You're seeing this error:
```
infinite recursion detected in policy for relation "invoices"
```

This is caused by a circular dependency in Row Level Security policies between the `invoices` and `invoice_shares` tables.

## The Fix (2 minutes)

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project: `fplpcetyjzzpxjetswhv`
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the entire contents of `supabase/migrations/005_fix_rls_recursion.sql`
6. Click "Run" button

That's it! The error should be gone.

### Option 2: Delete the Problematic Policy

If you want a quick fix without public invoice sharing:

1. Go to Supabase Dashboard > SQL Editor
2. Run this query:

```sql
DROP POLICY IF EXISTS "Public can view invoices with valid share token" ON invoices;
```

This removes the public sharing feature but eliminates the error.

### Option 3: Disable RLS Temporarily (For Demo Only)

**WARNING: This disables security. Only use for local demo!**

```sql
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_shares DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items DISABLE ROW LEVEL SECURITY;
```

To re-enable later:
```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
```

## Verify the Fix

1. Restart your dev server: `npm run dev`
2. Visit http://localhost:3000/dashboard
3. The error should be gone

## What Caused This?

The `invoice_shares` table has policies that check the `invoices` table, and the `invoices` table has a policy that checks `invoice_shares` - creating infinite recursion.

The fix uses a SECURITY DEFINER function to break this circular dependency.

## Next Steps

After applying the fix:
1. Restart dev server
2. Run the demo seeding script
3. Show your friend!

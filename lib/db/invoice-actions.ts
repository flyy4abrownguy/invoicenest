import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { InvoiceStatus } from '@/lib/types'

/**
 * Update invoice status
 * Centralized function for consistent status management
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  userId: string,
  status: InvoiceStatus
) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('invoices')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Mark invoice as paid
 * Sets status to 'paid' and records payment date
 */
export async function markInvoiceAsPaid(invoiceId: string, userId: string) {
  return updateInvoiceStatus(invoiceId, userId, 'paid')
}

/**
 * Detect and update overdue invoices
 * Automatically marks invoices as overdue if past due date and not paid
 */
export async function detectOverdueInvoices(userId: string) {
  const supabase = await createSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('user_id', userId)
    .lt('due_date', today)
    .in('status', ['sent', 'draft']) // Only update sent or draft invoices
    .select()

  if (error) throw error
  return data
}

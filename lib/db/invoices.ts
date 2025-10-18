import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { Invoice, InvoiceItem } from '@/lib/types'

export async function getInvoices(userId: string) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*),
      items:invoice_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Invoice[]
}

export async function getInvoiceById(invoiceId: string, userId: string) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*),
      items:invoice_items(*)
    `)
    .eq('id', invoiceId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as Invoice
}

export async function createInvoice(
  userId: string,
  invoice: Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[]
) {
  const supabase = await createSupabaseClient()

  // Insert invoice
  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      user_id: userId,
      client_id: invoice.client_id,
      invoice_number: invoice.invoice_number,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      status: invoice.status,
      subtotal: invoice.subtotal,
      tax_rate: invoice.tax_rate,
      tax_amount: invoice.tax_amount,
      discount: invoice.discount,
      total: invoice.total,
      notes: invoice.notes,
      payment_terms: invoice.payment_terms,
      is_recurring: invoice.is_recurring,
      recurring_frequency: invoice.recurring_frequency,
      next_invoice_date: invoice.next_invoice_date,
    })
    .select()
    .single()

  if (invoiceError) throw invoiceError

  // Insert invoice items
  if (items.length > 0) {
    const itemsToInsert = items.map((item, index) => ({
      invoice_id: invoiceData.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
      sort_order: item.sort_order ?? index,
    }))

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert)

    if (itemsError) throw itemsError
  }

  // Fetch complete invoice with items
  return getInvoiceById(invoiceData.id, userId)
}

export async function updateInvoice(
  invoiceId: string,
  userId: string,
  invoice: Partial<Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
  items?: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[]
) {
  const supabase = await createSupabaseClient()

  // Update invoice
  const { error: invoiceError } = await supabase
    .from('invoices')
    .update({
      client_id: invoice.client_id,
      invoice_number: invoice.invoice_number,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      status: invoice.status,
      subtotal: invoice.subtotal,
      tax_rate: invoice.tax_rate,
      tax_amount: invoice.tax_amount,
      discount: invoice.discount,
      total: invoice.total,
      notes: invoice.notes,
      payment_terms: invoice.payment_terms,
      is_recurring: invoice.is_recurring,
      recurring_frequency: invoice.recurring_frequency,
      next_invoice_date: invoice.next_invoice_date,
    })
    .eq('id', invoiceId)
    .eq('user_id', userId)

  if (invoiceError) throw invoiceError

  // Update items if provided
  if (items) {
    // Delete existing items
    await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', invoiceId)

    // Insert new items
    if (items.length > 0) {
      const itemsToInsert = items.map((item, index) => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        sort_order: item.sort_order ?? index,
      }))

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError
    }
  }

  return getInvoiceById(invoiceId, userId)
}

export async function deleteInvoice(invoiceId: string, userId: string) {
  const supabase = await createSupabaseClient()

  // Items will be deleted by CASCADE
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function getDashboardStats(userId: string) {
  const supabase = await createSupabaseClient()

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('status, total')
    .eq('user_id', userId)

  if (error) throw error

  const stats = {
    totalInvoices: invoices.length,
    totalRevenue: invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0),
    paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
    pendingAmount: invoices
      .filter(inv => inv.status === 'sent')
      .reduce((sum, inv) => sum + inv.total, 0),
    overdueCount: invoices.filter(inv => inv.status === 'overdue').length,
  }

  return stats
}

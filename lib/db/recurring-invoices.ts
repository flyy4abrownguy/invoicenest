import { createClient } from "@/lib/supabase/server";
import { RecurringInvoice } from "@/lib/types";

export async function getRecurringInvoices(userId: string): Promise<RecurringInvoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('recurring_invoices')
    .select(`
      *,
      client:clients(*),
      items:recurring_invoice_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recurring invoices:', error);
    throw error;
  }

  return data as RecurringInvoice[];
}

export async function getRecurringInvoiceById(id: string, userId: string): Promise<RecurringInvoice> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('recurring_invoices')
    .select(`
      *,
      client:clients(*),
      items:recurring_invoice_items(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching recurring invoice:', error);
    throw error;
  }

  return data as RecurringInvoice;
}

export async function createRecurringInvoice(
  userId: string,
  data: {
    client_id: string;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    start_date: string;
    end_date?: string;
    invoice_number_prefix: string;
    payment_terms: number;
    notes?: string;
    tax_rate: number;
    items: Array<{
      description: string;
      quantity: number;
      rate: number;
    }>;
  }
): Promise<RecurringInvoice> {
  const supabase = await createClient();

  // Calculate next generation date based on frequency
  const nextDate = calculateNextGenerationDate(data.start_date, data.frequency);

  // Insert recurring invoice
  const { data: recurringInvoice, error: invoiceError } = await supabase
    .from('recurring_invoices')
    .insert({
      user_id: userId,
      client_id: data.client_id,
      frequency: data.frequency,
      start_date: data.start_date,
      end_date: data.end_date,
      next_generation_date: nextDate,
      is_active: true,
      invoice_number_prefix: data.invoice_number_prefix,
      payment_terms: data.payment_terms,
      notes: data.notes,
      tax_rate: data.tax_rate,
    })
    .select()
    .single();

  if (invoiceError) {
    console.error('Error creating recurring invoice:', invoiceError);
    throw invoiceError;
  }

  // Insert items
  const itemsToInsert = data.items.map(item => ({
    recurring_invoice_id: recurringInvoice.id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
  }));

  const { error: itemsError } = await supabase
    .from('recurring_invoice_items')
    .insert(itemsToInsert);

  if (itemsError) {
    console.error('Error creating recurring invoice items:', itemsError);
    throw itemsError;
  }

  return getRecurringInvoiceById(recurringInvoice.id, userId);
}

export async function updateRecurringInvoice(
  id: string,
  userId: string,
  data: Partial<{
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    start_date: string;
    end_date?: string;
    is_active: boolean;
    invoice_number_prefix: string;
    payment_terms: number;
    notes?: string;
    tax_rate: number;
  }>
): Promise<RecurringInvoice> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('recurring_invoices')
    .update(data)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating recurring invoice:', error);
    throw error;
  }

  return getRecurringInvoiceById(id, userId);
}

export async function deleteRecurringInvoice(id: string, userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('recurring_invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting recurring invoice:', error);
    throw error;
  }
}

export async function getDueRecurringInvoices(): Promise<RecurringInvoice[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('recurring_invoices')
    .select(`
      *,
      client:clients(*),
      items:recurring_invoice_items(*)
    `)
    .eq('is_active', true)
    .lte('next_generation_date', today)
    .is('end_date', null)
    .or(`end_date.gte.${today}`);

  if (error) {
    console.error('Error fetching due recurring invoices:', error);
    throw error;
  }

  return data as RecurringInvoice[];
}

export async function updateNextGenerationDate(
  id: string,
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
): Promise<void> {
  const supabase = await createClient();

  // Get current next_generation_date
  const { data: current } = await supabase
    .from('recurring_invoices')
    .select('next_generation_date')
    .eq('id', id)
    .single();

  if (!current) return;

  const nextDate = calculateNextGenerationDate(current.next_generation_date, frequency);

  await supabase
    .from('recurring_invoices')
    .update({ next_generation_date: nextDate })
    .eq('id', id);
}

// Helper function to calculate next generation date
function calculateNextGenerationDate(
  currentDate: string,
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
): string {
  const date = new Date(currentDate);

  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date.toISOString().split('T')[0];
}

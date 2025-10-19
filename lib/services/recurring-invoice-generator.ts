import { createClient } from "@/lib/supabase/server";
import { RecurringInvoice } from "@/lib/types";
import { getDueRecurringInvoices, updateNextGenerationDate } from "@/lib/db/recurring-invoices";

/**
 * Generate invoices from recurring invoice templates
 * This should be called via a cron job or scheduled task
 */
export async function generateRecurringInvoices(): Promise<{
  success: number;
  failed: number;
  errors: Array<{ recurringId: string; error: string }>;
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ recurringId: string; error: string }>,
  };

  try {
    const dueInvoices = await getDueRecurringInvoices();

    for (const recurring of dueInvoices) {
      try {
        await generateInvoiceFromRecurring(recurring);
        await updateNextGenerationDate(recurring.id, recurring.frequency);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          recurringId: recurring.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        console.error(`Failed to generate invoice for recurring ${recurring.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in generateRecurringInvoices:', error);
    throw error;
  }

  return results;
}

/**
 * Generate a single invoice from a recurring template
 */
async function generateInvoiceFromRecurring(recurring: RecurringInvoice): Promise<void> {
  const supabase = await createClient();

  // Calculate dates
  const issueDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + recurring.payment_terms);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  // Get the next invoice number
  const invoiceNumber = await generateInvoiceNumber(recurring.user_id, recurring.invoice_number_prefix);

  // Calculate totals from items
  let subtotal = 0;
  if (recurring.items) {
    subtotal = recurring.items.reduce((sum, item) => {
      return sum + (item.quantity * item.rate);
    }, 0);
  }

  const taxAmount = subtotal * (recurring.tax_rate / 100);
  const total = subtotal + taxAmount;

  // Create the invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      user_id: recurring.user_id,
      client_id: recurring.client_id,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDateStr,
      status: 'draft',
      subtotal,
      tax_rate: recurring.tax_rate,
      tax_amount: taxAmount,
      discount: 0,
      total,
      notes: recurring.notes,
      payment_terms: `Net ${recurring.payment_terms}`,
      is_recurring: false,
    })
    .select()
    .single();

  if (invoiceError) {
    console.error('Error creating invoice from recurring:', invoiceError);
    throw invoiceError;
  }

  // Create invoice items
  if (recurring.items && recurring.items.length > 0) {
    const itemsToInsert = recurring.items.map((item, index) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate,
      sort_order: index,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating invoice items:', itemsError);
      throw itemsError;
    }
  }
}

/**
 * Generate the next invoice number for a user
 */
async function generateInvoiceNumber(userId: string, prefix: string): Promise<string> {
  const supabase = await createClient();

  // Get the latest invoice number with this prefix
  const { data: latestInvoice } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('user_id', userId)
    .like('invoice_number', `${prefix}%`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!latestInvoice) {
    return `${prefix}0001`;
  }

  // Extract the number part and increment
  const numberPart = latestInvoice.invoice_number.replace(prefix, '');
  const nextNumber = parseInt(numberPart, 10) + 1;

  // Pad with zeros to maintain 4 digits
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Manually trigger generation for a specific recurring invoice
 */
export async function generateSingleRecurringInvoice(
  recurringId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  // Fetch the recurring invoice
  const { data: recurring, error } = await supabase
    .from('recurring_invoices')
    .select(`
      *,
      client:clients(*),
      items:recurring_invoice_items(*)
    `)
    .eq('id', recurringId)
    .eq('user_id', userId)
    .single();

  if (error || !recurring) {
    throw new Error('Recurring invoice not found');
  }

  await generateInvoiceFromRecurring(recurring as RecurringInvoice);
  await updateNextGenerationDate(recurring.id, recurring.frequency);
}

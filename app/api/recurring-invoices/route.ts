import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRecurringInvoices, createRecurringInvoice } from '@/lib/db/recurring-invoices';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recurringInvoices = await getRecurringInvoices(user.id);
    return NextResponse.json(recurringInvoices);
  } catch (error) {
    console.error('Error fetching recurring invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.client_id || !body.frequency || !body.start_date || !body.invoice_number_prefix) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }

    const recurringInvoice = await createRecurringInvoice(user.id, {
      client_id: body.client_id,
      frequency: body.frequency,
      start_date: body.start_date,
      end_date: body.end_date,
      invoice_number_prefix: body.invoice_number_prefix,
      payment_terms: body.payment_terms || 30,
      notes: body.notes,
      tax_rate: body.tax_rate || 0,
      items: body.items,
    });

    return NextResponse.json(recurringInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating recurring invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create recurring invoice' },
      { status: 500 }
    );
  }
}

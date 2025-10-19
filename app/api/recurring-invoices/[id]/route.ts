import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getRecurringInvoiceById,
  updateRecurringInvoice,
  deleteRecurringInvoice,
} from '@/lib/db/recurring-invoices';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recurringInvoice = await getRecurringInvoiceById(id, user.id);
    return NextResponse.json(recurringInvoice);
  } catch (error) {
    console.error('Error fetching recurring invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring invoice' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const updatedRecurringInvoice = await updateRecurringInvoice(id, user.id, body);
    return NextResponse.json(updatedRecurringInvoice);
  } catch (error) {
    console.error('Error updating recurring invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update recurring invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteRecurringInvoice(id, user.id);
    return NextResponse.json({ message: 'Recurring invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting recurring invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete recurring invoice' },
      { status: 500 }
    );
  }
}

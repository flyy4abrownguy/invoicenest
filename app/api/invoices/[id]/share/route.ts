import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getInvoiceShare,
  createInvoiceShare,
  updateInvoiceShare,
  deleteInvoiceShare,
} from '@/lib/db/client-portal';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify invoice ownership
    const { data: invoice } = await supabase
      .from('invoices')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!invoice || invoice.user_id !== user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const share = await getInvoiceShare(id);
    return NextResponse.json(share);
  } catch (error) {
    console.error('Error fetching invoice share:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice share' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify invoice ownership
    const { data: invoice } = await supabase
      .from('invoices')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!invoice || invoice.user_id !== user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const body = await request.json();
    const share = await createInvoiceShare(id, body);

    return NextResponse.json(share, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice share:', error);
    return NextResponse.json({ error: 'Failed to create invoice share' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify invoice ownership
    const { data: invoice } = await supabase
      .from('invoices')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!invoice || invoice.user_id !== user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const updates = await request.json();
    const share = await updateInvoiceShare(id, updates);

    return NextResponse.json(share);
  } catch (error) {
    console.error('Error updating invoice share:', error);
    return NextResponse.json({ error: 'Failed to update invoice share' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify invoice ownership
    const { data: invoice } = await supabase
      .from('invoices')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!invoice || invoice.user_id !== user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    await deleteInvoiceShare(id);
    return NextResponse.json({ message: 'Invoice share deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice share:', error);
    return NextResponse.json({ error: 'Failed to delete invoice share' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSingleRecurringInvoice } from '@/lib/services/recurring-invoice-generator';

/**
 * Manually generate an invoice from a recurring template
 */
export async function POST(
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

    await generateSingleRecurringInvoice(id, user.id);

    return NextResponse.json({
      message: 'Invoice generated successfully from recurring template',
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate invoice',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

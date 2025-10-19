import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceByShareToken, logPortalActivity } from '@/lib/db/client-portal';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const result = await getInvoiceByShareToken(token);

    if (!result) {
      return NextResponse.json({ error: 'Invoice not found or link expired' }, { status: 404 });
    }

    const { invoice, share } = result;

    // Get user profile for company info
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', invoice.user_id)
      .single();

    // Log activity
    await logPortalActivity({
      client_id: invoice.client_id,
      invoice_id: invoice.id,
      activity_type: 'view',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent'),
    });

    return NextResponse.json({
      invoice,
      profile,
      share: {
        allow_payment: true,
        allow_download: true,
      },
    });
  } catch (error) {
    console.error('Error fetching shared invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

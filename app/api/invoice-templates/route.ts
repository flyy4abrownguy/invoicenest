import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInvoiceTemplates, createInvoiceTemplate } from '@/lib/db/invoice-templates';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await getInvoiceTemplates(user.id);
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching invoice templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items = [], ...templateData } = body;

    const template = await createInvoiceTemplate(
      {
        ...templateData,
        user_id: user.id,
      },
      items
    );

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice template:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice template' },
      { status: 500 }
    );
  }
}

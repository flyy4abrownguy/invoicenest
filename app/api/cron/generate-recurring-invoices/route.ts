import { NextRequest, NextResponse } from 'next/server';
import { generateRecurringInvoices } from '@/lib/services/recurring-invoice-generator';

/**
 * Cron endpoint to generate recurring invoices
 * This should be called daily by a cron service (Vercel Cron, GitHub Actions, etc.)
 *
 * Secure this endpoint with a CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate invoices
    const results = await generateRecurringInvoices();

    return NextResponse.json({
      message: 'Recurring invoices generation completed',
      ...results,
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate recurring invoices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}

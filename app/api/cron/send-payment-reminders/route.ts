import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReminders } from '@/lib/services/payment-reminder-service';

/**
 * Cron endpoint to send payment reminders
 * This should be called daily by a cron service
 *
 * Secure this endpoint with a CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Send reminders
    const results = await sendPaymentReminders();

    return NextResponse.json({
      message: 'Payment reminders sent',
      ...results,
    });
  } catch (error) {
    console.error('Error in payment reminder cron:', error);
    return NextResponse.json(
      {
        error: 'Failed to send payment reminders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

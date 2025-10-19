import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { Invoice, PaymentReminderSettings, ReminderType } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { getReminderSettings } from '../db/payment-reminders';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReminderResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}

export async function sendPaymentReminders(): Promise<ReminderResult> {
  const result: ReminderResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    const supabase = await createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all invoices that might need reminders
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*)
      `)
      .in('status', ['sent', 'overdue'])
      .not('client_id', 'is', null);

    if (invoicesError) throw invoicesError;
    if (!invoices || invoices.length === 0) return result;

    // Group invoices by user
    const invoicesByUser = invoices.reduce((acc, invoice) => {
      if (!acc[invoice.user_id]) acc[invoice.user_id] = [];
      acc[invoice.user_id].push(invoice);
      return acc;
    }, {} as Record<string, typeof invoices>);

    // Process each user's invoices
    for (const [userId, userInvoices] of Object.entries(invoicesByUser)) {
      const settings = await getReminderSettings(userId);

      if (!settings || !settings.is_enabled) {
        result.skipped += userInvoices.length;
        continue;
      }

      // Get user profile for sender info
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) {
        result.skipped += userInvoices.length;
        continue;
      }

      for (const invoice of userInvoices) {
        try {
          const shouldSend = await shouldSendReminder(invoice, settings, today);

          if (shouldSend) {
            await sendReminderEmail(invoice, settings, profile);
            await logReminder(invoice, shouldSend.type, shouldSend.daysOffset);
            await updateInvoiceReminderTracking(invoice.id);
            result.success++;
          } else {
            result.skipped++;
          }
        } catch (error) {
          result.failed++;
          result.errors.push(
            `Failed to send reminder for invoice ${invoice.invoice_number}: ${error}`
          );
        }
      }
    }

    return result;
  } catch (error) {
    result.errors.push(`Fatal error in sendPaymentReminders: ${error}`);
    return result;
  }
}

async function shouldSendReminder(
  invoice: Invoice,
  settings: PaymentReminderSettings,
  today: Date
): Promise<{ type: ReminderType; daysOffset: number } | null> {
  const dueDate = new Date(invoice.due_date);
  dueDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Check if we already sent a reminder today
  const lastReminder = invoice.last_reminder_sent_at
    ? new Date(invoice.last_reminder_sent_at)
    : null;

  if (lastReminder) {
    lastReminder.setHours(0, 0, 0, 0);
    if (lastReminder.getTime() === today.getTime()) {
      return null; // Already sent today
    }
  }

  // Before due date
  if (daysDiff > 0 && settings.days_before_due.includes(daysDiff)) {
    return { type: 'before_due', daysOffset: daysDiff };
  }

  // On due date
  if (daysDiff === 0) {
    return { type: 'on_due', daysOffset: 0 };
  }

  // After due date (overdue)
  if (daysDiff < 0) {
    const daysOverdue = Math.abs(daysDiff);
    if (settings.days_after_due.includes(daysOverdue)) {
      return { type: 'after_due', daysOffset: daysOverdue };
    }
  }

  return null;
}

async function sendReminderEmail(
  invoice: Invoice,
  settings: PaymentReminderSettings,
  profile: any
): Promise<void> {
  if (!invoice.client?.email) {
    throw new Error('Client email not found');
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error('Email service not configured');
  }

  // Replace template variables
  const subject = replaceTemplateVariables(settings.subject_template, invoice, profile);
  const body = replaceTemplateVariables(
    settings.body_template || getDefaultBody(),
    invoice,
    profile
  );

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        ${profile.company_logo ? `<img src="${profile.company_logo}" alt="${profile.company_name}" style="max-width: 150px; margin-bottom: 16px;">` : ''}
        <h2 style="margin: 0; color: #1f2937;">Payment Reminder</h2>
      </div>

      <div style="white-space: pre-wrap; line-height: 1.6; color: #374151;">
        ${body}
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          ${profile.company_name || profile.full_name}<br>
          ${profile.company_email || profile.email}
        </p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: `${profile.company_name || profile.full_name} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
    to: invoice.client.email,
    subject,
    html: htmlBody,
  });
}

function replaceTemplateVariables(
  template: string,
  invoice: Invoice,
  profile: any
): string {
  return template
    .replace(/\{\{invoice_number\}\}/g, invoice.invoice_number)
    .replace(/\{\{client_name\}\}/g, invoice.client?.name || 'Customer')
    .replace(/\{\{issue_date\}\}/g, formatDate(invoice.issue_date))
    .replace(/\{\{due_date\}\}/g, formatDate(invoice.due_date))
    .replace(/\{\{total\}\}/g, formatCurrency(invoice.total, invoice.currency))
    .replace(/\{\{company_name\}\}/g, profile.company_name || profile.full_name);
}

function getDefaultBody(): string {
  return `Hello {{client_name}},

This is a friendly reminder regarding Invoice {{invoice_number}} dated {{issue_date}}.

Amount Due: {{total}}
Due Date: {{due_date}}

Please submit payment at your earliest convenience.

Thank you for your business!`;
}

async function logReminder(
  invoice: Invoice,
  reminderType: ReminderType,
  daysOffset: number
): Promise<void> {
  const supabase = await createClient();

  await supabase.from('payment_reminders').insert({
    invoice_id: invoice.id,
    reminder_type: reminderType,
    days_offset: daysOffset,
    email_to: invoice.client?.email || '',
    email_subject: `Payment Reminder: Invoice ${invoice.invoice_number}`,
  });
}

async function updateInvoiceReminderTracking(invoiceId: string): Promise<void> {
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from('invoices')
    .select('reminder_count')
    .eq('id', invoiceId)
    .single();

  await supabase
    .from('invoices')
    .update({
      last_reminder_sent_at: new Date().toISOString(),
      reminder_count: (invoice?.reminder_count || 0) + 1,
    })
    .eq('id', invoiceId);
}

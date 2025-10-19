import { createClient } from '@/lib/supabase/server';
import { PaymentReminderSettings } from '../types';

export async function getReminderSettings(userId: string): Promise<PaymentReminderSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payment_reminder_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function upsertReminderSettings(
  settings: Omit<PaymentReminderSettings, 'id' | 'created_at' | 'updated_at'>
): Promise<PaymentReminderSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payment_reminder_settings')
    .upsert(settings, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateDefaultSettings(userId: string): Promise<PaymentReminderSettings> {
  const existing = await getReminderSettings(userId);
  if (existing) return existing;

  // Create default settings
  return upsertReminderSettings({
    user_id: userId,
    days_before_due: [7, 3, 1],
    days_after_due: [1, 7, 14],
    subject_template: 'Payment Reminder: Invoice {{invoice_number}}',
    body_template: `Hello {{client_name}},

This is a friendly reminder regarding Invoice {{invoice_number}} dated {{issue_date}}.

Amount Due: {{total}}
Due Date: {{due_date}}

Please submit payment at your earliest convenience.

Thank you for your business!`,
    is_enabled: true,
  });
}

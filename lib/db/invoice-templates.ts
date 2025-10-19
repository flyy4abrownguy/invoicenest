import { createClient } from '@/lib/supabase/server';
import { InvoiceTemplate, InvoiceTemplateItem } from '../types';

export async function getInvoiceTemplates(userId: string): Promise<InvoiceTemplate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoice_templates')
    .select(`
      *,
      items:invoice_template_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getInvoiceTemplateById(
  id: string,
  userId: string
): Promise<InvoiceTemplate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoice_templates')
    .select(`
      *,
      items:invoice_template_items(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function getDefaultTemplate(userId: string): Promise<InvoiceTemplate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoice_templates')
    .select(`
      *,
      items:invoice_template_items(*)
    `)
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error) return null;
  return data;
}

export async function createInvoiceTemplate(
  template: Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at' | 'items'>,
  items: Omit<InvoiceTemplateItem, 'id' | 'template_id' | 'created_at'>[]
): Promise<InvoiceTemplate> {
  const supabase = await createClient();

  // If this is default, unset other defaults
  if (template.is_default) {
    await supabase
      .from('invoice_templates')
      .update({ is_default: false })
      .eq('user_id', template.user_id);
  }

  // Create template
  const { data: templateData, error: templateError } = await supabase
    .from('invoice_templates')
    .insert(template)
    .select()
    .single();

  if (templateError) throw templateError;

  // Create template items
  if (items.length > 0) {
    const itemsWithTemplateId = items.map((item) => ({
      ...item,
      template_id: templateData.id,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_template_items')
      .insert(itemsWithTemplateId);

    if (itemsError) throw itemsError;
  }

  return getInvoiceTemplateById(templateData.id, template.user_id) as Promise<InvoiceTemplate>;
}

export async function updateInvoiceTemplate(
  id: string,
  userId: string,
  updates: Partial<Omit<InvoiceTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'items'>>,
  items?: Omit<InvoiceTemplateItem, 'id' | 'template_id' | 'created_at'>[]
): Promise<InvoiceTemplate> {
  const supabase = await createClient();

  // If setting as default, unset other defaults
  if (updates.is_default) {
    await supabase
      .from('invoice_templates')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  // Update template
  const { error: templateError } = await supabase
    .from('invoice_templates')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId);

  if (templateError) throw templateError;

  // Update items if provided
  if (items) {
    // Delete existing items
    await supabase
      .from('invoice_template_items')
      .delete()
      .eq('template_id', id);

    // Insert new items
    if (items.length > 0) {
      const itemsWithTemplateId = items.map((item) => ({
        ...item,
        template_id: id,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_template_items')
        .insert(itemsWithTemplateId);

      if (itemsError) throw itemsError;
    }
  }

  return getInvoiceTemplateById(id, userId) as Promise<InvoiceTemplate>;
}

export async function deleteInvoiceTemplate(id: string, userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('invoice_templates')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

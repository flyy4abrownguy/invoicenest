import { createClient } from '@/lib/supabase/server';
import { ClientPortalAccess, InvoiceShare, PortalActivityLog } from '../types';
import { randomBytes } from 'crypto';

// Client Portal Access
export async function getClientPortalAccess(
  clientId: string
): Promise<ClientPortalAccess | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('client_portal_access')
    .select('*')
    .eq('client_id', clientId)
    .single();

  if (error) return null;
  return data;
}

export async function createClientPortalAccess(
  clientId: string,
  email: string
): Promise<ClientPortalAccess> {
  const supabase = await createClient();

  const accessToken = randomBytes(32).toString('base64url');

  const { data, error } = await supabase
    .from('client_portal_access')
    .insert({
      client_id: clientId,
      access_token: accessToken,
      email,
      is_enabled: true,
      allow_payment: true,
      allow_download: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClientPortalAccess(
  clientId: string,
  updates: Partial<Omit<ClientPortalAccess, 'id' | 'client_id' | 'access_token' | 'created_at' | 'updated_at'>>
): Promise<ClientPortalAccess> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('client_portal_access')
    .update(updates)
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreatePortalAccess(
  clientId: string,
  email: string
): Promise<ClientPortalAccess> {
  const existing = await getClientPortalAccess(clientId);
  if (existing) return existing;
  return createClientPortalAccess(clientId, email);
}

// Invoice Shares
export async function getInvoiceShare(invoiceId: string): Promise<InvoiceShare | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoice_shares')
    .select('*')
    .eq('invoice_id', invoiceId)
    .single();

  if (error) return null;
  return data;
}

export async function getInvoiceByShareToken(token: string): Promise<any | null> {
  const supabase = await createClient();

  // Get share
  const { data: share, error: shareError } = await supabase
    .from('invoice_shares')
    .select('*')
    .eq('share_token', token)
    .single();

  if (shareError || !share) return null;

  // Check if expired
  if (share.expires_at && new Date(share.expires_at) < new Date()) {
    return null;
  }

  // Get invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      items:invoice_items(*),
      client:clients(*)
    `)
    .eq('id', share.invoice_id)
    .single();

  if (invoiceError) return null;

  // Update view count
  await supabase
    .from('invoice_shares')
    .update({
      view_count: share.view_count + 1,
      last_viewed_at: new Date().toISOString(),
    })
    .eq('id', share.id);

  return { invoice, share };
}

export async function createInvoiceShare(
  invoiceId: string,
  options?: {
    isPublic?: boolean;
    requiresPassword?: boolean;
    passwordHash?: string;
    expiresAt?: string;
  }
): Promise<InvoiceShare> {
  const supabase = await createClient();

  const shareToken = randomBytes(32).toString('base64url');

  const { data, error } = await supabase
    .from('invoice_shares')
    .insert({
      invoice_id: invoiceId,
      share_token: shareToken,
      is_public: options?.isPublic || false,
      requires_password: options?.requiresPassword || false,
      password_hash: options?.passwordHash,
      expires_at: options?.expiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvoiceShare(
  invoiceId: string,
  updates: Partial<Omit<InvoiceShare, 'id' | 'invoice_id' | 'share_token' | 'created_at'>>
): Promise<InvoiceShare> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoice_shares')
    .update(updates)
    .eq('invoice_id', invoiceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInvoiceShare(invoiceId: string): Promise<void> {
  const supabase = await createClient();

  await supabase.from('invoice_shares').delete().eq('invoice_id', invoiceId);
}

// Portal Activity Log
export async function logPortalActivity(
  activity: Omit<PortalActivityLog, 'id' | 'created_at'>
): Promise<void> {
  const supabase = await createClient();

  await supabase.from('portal_activity_log').insert(activity);
}

export async function getPortalActivity(
  userId: string,
  filters?: {
    clientId?: string;
    invoiceId?: string;
    activityType?: string;
    limit?: number;
  }
): Promise<PortalActivityLog[]> {
  const supabase = await createClient();

  let query = supabase
    .from('portal_activity_log')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  if (filters?.invoiceId) {
    query = query.eq('invoice_id', filters.invoiceId);
  }

  if (filters?.activityType) {
    query = query.eq('activity_type', filters.activityType);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

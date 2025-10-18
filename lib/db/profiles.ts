import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'

export async function getProfile(userId: string) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Profile
}

export async function updateProfile(
  userId: string,
  profile: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'invoice_count' | 'stripe_customer_id' | 'subscription_tier'>>
) {
  const supabase = await createSupabaseClient()

  // Build update object, only including defined fields
  const updateData: Record<string, any> = {}
  if (profile.email !== undefined) updateData.email = profile.email
  if (profile.full_name !== undefined) updateData.full_name = profile.full_name
  if (profile.avatar_url !== undefined) updateData.avatar_url = profile.avatar_url
  if (profile.company_name !== undefined) updateData.company_name = profile.company_name
  if (profile.company_logo !== undefined) updateData.company_logo = profile.company_logo
  if (profile.company_address !== undefined) updateData.company_address = profile.company_address
  if (profile.company_phone !== undefined) updateData.company_phone = profile.company_phone
  if (profile.company_email !== undefined) updateData.company_email = profile.company_email

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export async function checkFreeTierLimit(userId: string): Promise<boolean> {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .rpc('check_free_tier_limit', { p_user_id: userId })

  if (error) throw error
  return data as boolean
}

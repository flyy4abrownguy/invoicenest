import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { Client } from '@/lib/types'

export async function getClients(userId: string) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Client[]
}

export async function getClientById(clientId: string, userId: string) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as Client
}

export async function createClient(
  userId: string,
  client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('clients')
    .insert({
      user_id: userId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes,
    })
    .select()
    .single()

  if (error) throw error
  return data as Client
}

export async function updateClient(
  clientId: string,
  userId: string,
  client: Partial<Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('clients')
    .update({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes,
    })
    .eq('id', clientId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Client
}

export async function deleteClient(clientId: string, userId: string) {
  const supabase = await createSupabaseClient()

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)
    .eq('user_id', userId)

  if (error) throw error
}

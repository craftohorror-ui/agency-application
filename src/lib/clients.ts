import 'server-only'

import { requireStaff } from '@/lib/auth'
import type { Client } from '@/lib/types'

export interface ClientInput {
  name: string
  company?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  industry?: string | null
  address?: string | null
  notes?: string | null
  lead_id?: string | null
  portal_user_id?: string | null
}

function normalizeNullableText(value: string | null | undefined) {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function createClient(input: ClientInput): Promise<Client> {
  const { supabase } = await requireStaff()
  
  const name = input.name.trim()
  if (!name) throw new Error('Client name is required')

  const payload = {
    name,
    company: normalizeNullableText(input.company),
    email: normalizeNullableText(input.email),
    phone: normalizeNullableText(input.phone),
    website: normalizeNullableText(input.website),
    industry: normalizeNullableText(input.industry),
    address: normalizeNullableText(input.address),
    notes: normalizeNullableText(input.notes),
    lead_id: input.lead_id ?? null,
    portal_user_id: input.portal_user_id ?? null,
  }

  const { data, error } = await supabase
    .from('clients')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as Client
}

export interface ClientListFilters {
  search?: string
  limit?: number
  offset?: number
}

export interface ClientListResult {
  clients: Client[]
  count: number | null
}

function normalizeSearch(value: string) {
  return value.replace(/[%_,()\\]/g, '\\$&').trim()
}

export async function listClients(filters: ClientListFilters = {}): Promise<ClientListResult> {
  const { supabase } = await requireStaff()

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filters.search?.trim()) {
    const pattern = `%${normalizeSearch(filters.search)}%`
    query = query.or(
      `name.ilike.${pattern},company.ilike.${pattern},email.ilike.${pattern}`
    )
  }

  if (typeof filters.limit === 'number') {
    const offset = filters.offset ?? 0
    query = query.range(offset, offset + Math.max(0, filters.limit) - 1)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    clients: (data ?? []) as Client[],
    count,
  }
}

export async function getClient(id: string) {
  const { supabase } = await requireStaff()
  const { data, error } = await supabase
    .from('clients')
    .select('*, lead:leads(id, name, stage, created_at)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export type ClientUpdateInput = Partial<ClientInput>

export async function updateClient(id: string, input: ClientUpdateInput): Promise<Client> {
  const { supabase } = await requireStaff()
  const payload: Record<string, unknown> = {}

  if (input.name !== undefined) {
    const name = input.name.trim()
    if (!name) throw new Error('Client name is required')
    payload.name = name
  }
  if (input.company !== undefined) payload.company = normalizeNullableText(input.company)
  if (input.email !== undefined) payload.email = normalizeNullableText(input.email)
  if (input.phone !== undefined) payload.phone = normalizeNullableText(input.phone)
  if (input.website !== undefined) payload.website = normalizeNullableText(input.website)
  if (input.industry !== undefined) payload.industry = normalizeNullableText(input.industry)
  if (input.address !== undefined) payload.address = normalizeNullableText(input.address)
  if (input.notes !== undefined) payload.notes = normalizeNullableText(input.notes)
  if (input.lead_id !== undefined) payload.lead_id = input.lead_id
  if (input.portal_user_id !== undefined) payload.portal_user_id = input.portal_user_id

  if (Object.keys(payload).length === 0) {
    throw new Error('No client fields provided')
  }

  const { data, error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as Client
}

export async function deleteClient(id: string): Promise<void> {
  const { supabase } = await requireStaff()
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw new Error(error.message)
}


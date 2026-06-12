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

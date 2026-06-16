import 'server-only'

import { requireStaff, requireClient } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { insertAuditLog } from '@/lib/audit'
import type { Contract, ContractStatus } from '@/lib/types'

export interface ContractWithRelations extends Contract {
  client: { id: string; name: string; company: string | null } | null
  proposal: { id: string; title: string } | null
}

export interface ContractVersion {
  id: string
  contract_id: string
  version: number
  body: string
  created_at: string
}

// -------------------------------------------------------------
// STAFF QUERIES
// -------------------------------------------------------------

export async function listContracts(search?: string, status?: ContractStatus) {
  const { supabase } = await requireStaff()

  let query = supabase
    .from('contracts')
    .select('*, client:clients(id, name, company), proposal:proposals(id, title)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search?.trim()) {
    const pattern = `%${search.replace(/[%_,()\\]/g, '\\$&').trim()}%`
    query = query.or(`title.ilike.${pattern}`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return { contracts: data as ContractWithRelations[], count }
}

export async function getContract(id: string): Promise<ContractWithRelations | null> {
  const { supabase } = await requireStaff()
  const { data, error } = await supabase
    .from('contracts')
    .select('*, client:clients(id, name, company), proposal:proposals(id, title)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as ContractWithRelations | null
}

export async function updateContract(id: string, input: Partial<Contract>) {
  const { supabase } = await requireStaff()
  
  const { error } = await supabase.from('contracts').update(input).eq('id', id)
  if (error) throw new Error(error.message)
  
  return true
}

export async function listContractVersions(contractId: string): Promise<ContractVersion[]> {
  const { supabase } = await requireStaff()
  const { data, error } = await supabase
    .from('contract_versions')
    .select('*')
    .eq('contract_id', contractId)
    .order('version', { ascending: false })
    
  if (error) throw new Error(error.message)
  return data as ContractVersion[]
}

// -------------------------------------------------------------
// CLIENT (PORTAL) QUERIES
// -------------------------------------------------------------

export async function listPortalContracts() {
  const { supabase } = await requireClient()
  // RLS (contracts_client_read) filters this implicitly
  const { data, error } = await supabase
    .from('contracts')
    .select('*, proposal:proposals(id, title)')
    .in('status', ['pending', 'signed', 'expired']) // Don't show drafts to clients
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as ContractWithRelations[]
}

export async function getPortalContract(id: string): Promise<ContractWithRelations | null> {
  const { supabase } = await requireClient()
  const { data, error } = await supabase
    .from('contracts')
    .select('*, proposal:proposals(id, title)')
    .eq('id', id)
    .in('status', ['pending', 'signed', 'expired'])
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as ContractWithRelations | null
}

export async function signPortalContract(id: string, signatureName: string, ipAddress: string) {
  const { supabase } = await requireClient()
  
  // RLS (contracts_client_sign) ensures client can only update pending contracts they own
  const { error } = await supabase.from('contracts').update({
    status: 'signed',
    signed_by_name: signatureName,
    signature_data: signatureName, // Since we aren't doing canvas, we store the name as data
    signer_ip: ipAddress,
    signed_at: new Date().toISOString()
  }).eq('id', id)

  if (error) throw new Error(error.message)

  // Auto-create project
  // We need to fetch the contract to get the client_id
  const { data: contract } = await supabase.from('contracts').select('client_id, title').eq('id', id).single()
  
  if (contract?.client_id) {
    const adminSupabase = createAdminClient()
    await adminSupabase.from('projects').insert({
      name: contract.title,
      client_id: contract.client_id,
      stage: 'planning',
      description: 'Auto-generated from signed contract.',
    })
  }
  
  const { user } = await requireClient()
  await insertAuditLog(user.id, 'contract.signed', 'contract', id, { ipAddress, signatureName })
}

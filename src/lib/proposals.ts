import 'server-only'

import { requireStaff } from '@/lib/auth'
import type { Proposal, ProposalItem, ProposalStatus } from '@/lib/types'

export interface ProposalWithRelations extends Proposal {
  items: ProposalItem[]
  client: { id: string; name: string; company: string | null } | null
  lead: { id: string; name: string; company: string | null } | null
}

export async function listProposals(search?: string, status?: ProposalStatus) {
  const { supabase } = await requireStaff()

  let query = supabase
    .from('proposals')
    .select('*, client:clients(id, name, company), lead:leads(id, name, company)', { count: 'exact' })
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

  return { proposals: data as ProposalWithRelations[], count }
}

export async function getProposal(id: string): Promise<ProposalWithRelations | null> {
  const { supabase } = await requireStaff()
  
  const { data, error } = await supabase
    .from('proposals')
    .select(`
      *,
      items:proposal_items(*),
      client:clients(id, name, company),
      lead:leads(id, name, company)
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as ProposalWithRelations | null
}

export type CreateProposalInput = {
  client_id?: string | null
  lead_id?: string | null
  title: string
  scope?: string | null
  deliverables?: string | null
  timeline?: string | null
  terms?: string | null
  status?: ProposalStatus
}

export type CreateProposalItemInput = {
  description: string
  qty: number
  unit_price: number
}

export async function createProposal(input: CreateProposalInput, items: CreateProposalItemInput[]) {
  const { supabase, user } = await requireStaff()

  const amount = items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0)

  const { data: proposal, error: propError } = await supabase
    .from('proposals')
    .insert({
      ...input,
      amount,
      status: input.status || 'draft',
      created_by: user.id
    })
    .select('*')
    .single()

  if (propError) throw new Error(propError.message)

  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from('proposal_items')
      .insert(items.map(item => ({ ...item, proposal_id: proposal.id })))

    if (itemsError) throw new Error(itemsError.message)
  }

  return getProposal(proposal.id)
}

export async function updateProposal(id: string, input: Partial<CreateProposalInput>, items?: CreateProposalItemInput[]) {
  const { supabase } = await requireStaff()

  let amount: number | undefined
  if (items) {
    amount = items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0)
  }

  const { error: propError } = await supabase
    .from('proposals')
    .update({
      ...input,
      ...(amount !== undefined && { amount })
    })
    .eq('id', id)

  if (propError) throw new Error(propError.message)

  if (items) {
    await supabase.from('proposal_items').delete().eq('proposal_id', id)
    if (items.length > 0) {
      await supabase.from('proposal_items').insert(items.map(item => ({ ...item, proposal_id: id })))
    }
  }

  return getProposal(id)
}

export async function deleteProposal(id: string) {
  const { supabase } = await requireStaff()
  const { error } = await supabase.from('proposals').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function convertProposalToProject(id: string) {
  const { supabase, user } = await requireStaff()
  
  const proposal = await getProposal(id)
  if (!proposal) throw new Error('Proposal not found')
  if (!proposal.client_id) throw new Error('Proposal must be linked to a client to convert to project')

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      client_id: proposal.client_id,
      name: proposal.title,
      description: proposal.scope,
      stage: 'planning',
      budget: proposal.amount,
      notes: `Converted from Proposal: ${proposal.title}`,
      created_by: user.id
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return project
}

export async function convertProposalToContract(id: string) {
  const { supabase, user } = await requireStaff()
  
  const proposal = await getProposal(id)
  if (!proposal) throw new Error('Proposal not found')
  if (!proposal.client_id) throw new Error('Proposal must be linked to a client to convert to contract')

  const itemsList = proposal.items.map(i => `- ${i.qty}x ${i.description} ($${i.unit_price})`).join('\n')

  const contractBody = `# Service Agreement

This Agreement is entered into between **Our Agency** ("Agency") and **${proposal.client?.name || 'Client'}** ("Client") on ${new Date().toLocaleDateString()}.

## 1. Scope of Work
${proposal.scope || 'As outlined in the proposal.'}

## 2. Deliverables
${proposal.deliverables || 'As outlined in the proposal.'}

### Line Items:
${itemsList}

## 3. Timeline
${proposal.timeline || 'To be determined.'}

## 4. Payment Terms
**Total Amount:** $${proposal.amount}
${proposal.terms || 'Standard payment terms apply.'}

## 5. Termination
Either party may terminate this agreement with 30 days written notice.

## 6. Intellectual Property
Upon full payment, all deliverables become the property of the Client.

## 7. Confidentiality
Both parties agree to maintain the confidentiality of proprietary information.

## 8. Acceptance
By signing below, both parties agree to the terms outlined in this agreement.
`

  const { data: contract, error } = await supabase
    .from('contracts')
    .insert({
      client_id: proposal.client_id,
      proposal_id: proposal.id,
      title: `Contract: ${proposal.title}`,
      body: contractBody,
      status: 'draft',
      version: 1,
      created_by: user.id
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return contract
}

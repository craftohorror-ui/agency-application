import 'server-only'

import { requireStaff } from '@/lib/auth'
import { getCurrentAgencySettings } from '@/lib/agencies'
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
  const agencySettings = await getCurrentAgencySettings()

  const branding_snapshot = {
    agency_name: agencySettings.name,
    logo_url: agencySettings.logo_url,
    logo_dark_url: agencySettings.logo_dark_url,
    primary_color: agencySettings.primary_color || '#0f172a',
    secondary_color: agencySettings.secondary_color || '#334155',
    terms_and_conditions: agencySettings.terms_and_conditions,
    privacy_policy: agencySettings.privacy_policy,
    legal_name: agencySettings.legal_name,
    tax_id: agencySettings.tax_id,
    website: agencySettings.website
  }

  const amount = items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0)
  
  // Use agency default footer/terms if none provided
  const terms = input.terms || agencySettings.default_proposal_footer

  const { data: proposal, error: propError } = await supabase
    .from('proposals')
    .insert({
      ...input,
      terms,
      amount,
      status: input.status || 'draft',
      branding_snapshot,
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

  const itemsList = proposal.items.map(i => `- ${i.qty}x ${i.description} @ $${i.unit_price} each`).join('\n')

  const contractBody = `MASTER SERVICE AGREEMENT

PARTIES

This Master Service Agreement ("Agreement") is entered into and made effective as of ${new Date().toLocaleDateString()} (the "Effective Date"), by and between:

**Agency:**
Our Agency
(Hereinafter referred to as the "Agency")

**Client:**
${proposal.client?.name || 'Client'}
${proposal.client?.company || ''}
(Hereinafter referred to as the "Client")

Collectively referred to as the "Parties".

1. SERVICES
The Agency agrees to perform and deliver the professional services outlined below (the "Services"). The Agency shall perform these Services in a professional, timely, and workmanlike manner in accordance with industry standards.
${proposal.scope || 'Services will be provided as outlined and mutually agreed upon.'}

2. DELIVERABLES
In connection with the Services, the Agency will provide the following specific deliverables to the Client:
${proposal.deliverables || 'Deliverables will be provided as outlined and mutually agreed upon.'}

3. PROJECT TIMELINE
The Parties agree to the following timeline for the execution and completion of the Services:
${proposal.timeline || 'The timeline will be mutually agreed upon prior to the commencement of work.'}

4. FEES AND PAYMENT TERMS
In consideration of the Services performed, the Client agrees to pay the Agency the total sum of **$${proposal.amount}**.

**Line Items:**
${itemsList}

**Payment Terms:**
${proposal.terms || 'Invoices shall be paid within the agreed upon terms. The Agency reserves the right to suspend services for any undisputed past-due invoices.'}

5. CLIENT RESPONSIBILITIES
The Client agrees to provide timely access to all materials, information, and personnel necessary for the Agency to perform the Services. Delays in Client feedback or provision of assets may result in corresponding extensions to the Project Timeline.

6. CONFIDENTIALITY
Each Party agrees to retain in confidence the non-public information and know-how transmitted or disclosed to them by the other Party in the course of performing this Agreement. Neither Party shall disclose such information to any third party without prior written consent.

7. INTELLECTUAL PROPERTY
Upon receipt of full and final payment, the Agency grants the Client all rights, title, and interest in and to the final Deliverables. The Agency retains the right to use the Deliverables for promotional and portfolio purposes, unless otherwise agreed in writing.

8. LIMITATION OF LIABILITY
In no event shall the Agency be liable for any indirect, incidental, special, or consequential damages arising out of or related to this Agreement. The Agency's total liability shall not exceed the total fees paid by the Client under this Agreement.

9. TERMINATION
Either Party may terminate this Agreement for convenience upon providing thirty (30) days prior written notice to the other Party. Upon termination, the Client shall pay for all Services rendered and reasonable expenses incurred up to the date of termination.

10. ACCEPTANCE
By signing below, the Parties acknowledge that they have read, understood, and agreed to be bound by the terms and conditions of this Agreement.
`

  const agencySettings = await getCurrentAgencySettings()
  
  const branding_snapshot = {
    agency_name: agencySettings.name,
    logo_url: agencySettings.logo_url,
    logo_dark_url: agencySettings.logo_dark_url,
    primary_color: agencySettings.primary_color || '#0f172a',
    secondary_color: agencySettings.secondary_color || '#334155',
    terms_and_conditions: agencySettings.terms_and_conditions,
    privacy_policy: agencySettings.privacy_policy,
    legal_name: agencySettings.legal_name,
    tax_id: agencySettings.tax_id,
    website: agencySettings.website
  }

  const { data: contract, error } = await supabase
    .from('contracts')
    .insert({
      client_id: proposal.client_id,
      proposal_id: proposal.id,
      title: `Contract: ${proposal.title}`,
      body: contractBody,
      status: 'draft',
      version: 1,
      branding_snapshot,
      created_by: user.id
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return contract
}

export async function duplicateProposal(id: string) {
  const { supabase, user } = await requireStaff()
  
  // 1. Fetch existing proposal securely
  const proposal = await getProposal(id)
  if (!proposal) throw new Error('Proposal not found')

  // 2. Future-Proof Data Copying
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, client_id: _client, lead_id: _lead, status: _status, created_at: _created, updated_at: _updated, created_by: _createdBy, items: _itemsData, client: _clientData, lead: _leadData, ...clonedData } = proposal

  // 3. Smart Copy Naming
  const copyPattern = / \(Copy(?: (\d+))?\)$/
  const match = proposal.title.match(copyPattern)
  let newTitle = proposal.title
  if (match) {
    const num = match[1] ? parseInt(match[1], 10) + 1 : 2
    newTitle = proposal.title.replace(copyPattern, ` (Copy ${num})`)
  } else {
    newTitle = `${proposal.title} (Copy)`
  }

  // 4. Create new proposal
  const { data: newProposal, error: propError } = await supabase
    .from('proposals')
    .insert({
      ...clonedData,
      title: newTitle,
      client_id: null,
      lead_id: null,
      status: 'draft',
      created_by: user.id
    })
    .select('*')
    .single()

  if (propError) throw new Error(propError.message)

  // 5. Clone line items if they exist
  if (proposal.items && proposal.items.length > 0) {
    const newItems = proposal.items.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _itemId, proposal_id: _propId, ...clonedItem } = item
      return {
        ...clonedItem,
        proposal_id: newProposal.id
      }
    })

    const { error: itemsError } = await supabase
      .from('proposal_items')
      .insert(newItems)

    if (itemsError) throw new Error(itemsError.message)
  }

  return getProposal(newProposal.id)
}

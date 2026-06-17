import 'server-only'

import { requireStaff } from '@/lib/auth'
import { getCurrentAgencySettings } from '@/lib/agencies'
import type { Proposal, ProposalItem, ProposalStatus } from '@/lib/types'

export interface ProposalWithRelations extends Proposal {
  items: ProposalItem[]
  client: { id: string; name: string; company: string | null; email: string | null; phone: string | null; address: string | null; } | null
  lead: { id: string; name: string; company: string | null } | null
}

export async function listProposals(search?: string, status?: ProposalStatus) {
  const { supabase } = await requireStaff()

  let query = supabase
    .from('proposals')
    .select('*, client:clients(id, name, company, email, phone, address), lead:leads(id, name, company)', { count: 'exact' })
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
      client:clients(id, name, company, email, phone, address),
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
    accent_color: agencySettings.accent_color || '#2563eb',
    terms_and_conditions: agencySettings.terms_and_conditions,
    privacy_policy: agencySettings.privacy_policy,
    legal_name: agencySettings.legal_name,
    registration_number: agencySettings.registration_number,
    tax_id: agencySettings.tax_id,
    website: agencySettings.website,
    linkedin_url: agencySettings.linkedin_url,
    instagram_url: agencySettings.instagram_url,
    facebook_url: agencySettings.facebook_url,
    default_proposal_footer: agencySettings.default_proposal_footer,
    default_contract_footer: agencySettings.default_contract_footer,
    default_invoice_footer: agencySettings.default_invoice_footer,
    default_legal_disclaimer: agencySettings.default_legal_disclaimer
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
  const { supabase, user, profile } = await requireStaff()
  
  const proposal = await getProposal(id)
  if (!proposal) throw new Error('Proposal not found')
  if (!proposal.client_id) throw new Error('Proposal must be linked to a client to convert to contract')

  const agencySettings = await getCurrentAgencySettings()

  let repProfile = profile
  if (!repProfile.full_name || !repProfile.email) {
    const { data: owner } = await supabase
      .from('profiles')
      .select('*')
      .eq('agency_id', profile.agency_id)
      .eq('role', 'owner')
      .single()
    if (owner) {
      repProfile = owner
    }
  }

  const formattedDeliverablesRows = proposal.deliverables
    ? proposal.deliverables.split('\n').filter(d => d.trim()).map(d => {
        const clean = d.trim().replace(/^[-*•]\s*/, '')
        return `| ${clean} |`
      }).join('\n')
    : '| Deliverables will be provided as outlined and mutually agreed upon. |';

  const formattedDeliverables = `| DELIVERABLE DESCRIPTION |\n|---|\n${formattedDeliverablesRows}`

  const itemsListRows = proposal.items.map(i => `| **${i.qty}x** | **${i.description}** | $${i.unit_price} each |`).join('\n')
  const itemsList = `| QTY | SERVICE OR ITEM | RATE |\n|---|---|---|\n${itemsListRows}`

  const formattedPaymentTerms = proposal.terms 
    ? proposal.terms.split('\n').filter(t => t.trim()).map(t => {
        const clean = t.trim()
        return clean.startsWith('-') || clean.startsWith('•') || clean.startsWith('*') ? clean : `* ${clean}`
      }).join('\n\n')
    : '* Invoices shall be paid within the agreed upon terms.';

  const agencyName = agencySettings.legal_name || agencySettings.name || 'Agency'
  const repName = repProfile.full_name || 'Authorized Representative'
  const clientName = proposal.client?.name || 'Client'
  const clientCompany = proposal.client?.company || clientName
  const agreementNumber = `CTR-${new Date().getFullYear()}-${proposal.id.slice(0, 8).toUpperCase()}`

  const agencyReg = agencySettings.registration_number ? `Reg: ${agencySettings.registration_number}` : ''
  const agencyTax = agencySettings.tax_id ? `Tax ID: ${agencySettings.tax_id}` : ''
  const agencyDetails = [agencyReg, agencyTax].filter(Boolean).join(' | ')

  const overviewTable = `| AGREEMENT OVERVIEW | DETAILS |
|---|---|
| **Agreement Number** | ${agreementNumber} |
| **Effective Date** | ${new Date().toLocaleDateString()} |`

  const partiesTable = `| ROLE | LEGAL ENTITY | REPRESENTATIVE | DETAILS |
|---|---|---|---|
| **Agency** | **${agencyName.toUpperCase()}** | ${repName} | ${agencyDetails} |
| **Client** | **${clientCompany.toUpperCase()}** | ${clientName} | |`

  const commercialTable = `| CONTRACT VALUE | TIMELINE |
|---|---|
| **$${proposal.amount.toLocaleString()}** | **${proposal.timeline || 'To be mutually agreed'}** |`

  const contractBody = `# MASTER SERVICE AGREEMENT

${overviewTable}

## PARTIES

${partiesTable}

## 1. SERVICES

${proposal.scope || 'Services will be provided as outlined and mutually agreed upon.'}

## 2. DELIVERABLES

${formattedDeliverables}

## 3. COMMERCIAL TERMS

${commercialTable}

### LINE ITEMS
${itemsList}

## 4. PAYMENT TERMS

${formattedPaymentTerms}

---

## 5. CONFIDENTIALITY

Each Party agrees to retain in confidence the non-public information and know-how transmitted or disclosed to them by the other Party in the course of performing this Agreement. Neither Party shall disclose such information to any third party without prior written consent.

---

## 6. TERMINATION

Either Party may terminate this Agreement for convenience upon providing thirty (30) days prior written notice to the other Party. Upon termination, the Client shall pay for all Services rendered and reasonable expenses incurred up to the date of termination.

---

## 7. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law principles.
`
  
  const branding_snapshot = {
    agency_name: agencySettings.name,
    logo_url: agencySettings.logo_url,
    logo_dark_url: agencySettings.logo_dark_url,
    primary_color: agencySettings.primary_color || '#0f172a',
    secondary_color: agencySettings.secondary_color || '#334155',
    accent_color: agencySettings.accent_color || '#2563eb',
    terms_and_conditions: agencySettings.terms_and_conditions,
    privacy_policy: agencySettings.privacy_policy,
    legal_name: agencySettings.legal_name,
    registration_number: agencySettings.registration_number,
    tax_id: agencySettings.tax_id,
    website: agencySettings.website,
    linkedin_url: agencySettings.linkedin_url,
    instagram_url: agencySettings.instagram_url,
    facebook_url: agencySettings.facebook_url,
    default_proposal_footer: agencySettings.default_proposal_footer,
    default_contract_footer: agencySettings.default_contract_footer,
    default_invoice_footer: agencySettings.default_invoice_footer,
    default_legal_disclaimer: agencySettings.default_legal_disclaimer
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

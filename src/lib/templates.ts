export interface TemplateLineItem {
  id: string
  description: string
  qty: number
  unitPrice: number
  total: number
}

export interface TemplateData {
  title: string
  date: string
  clientName: string
  clientCompany: string
  agencyName: string
  agencyLogo?: string | null
  agencyEmail?: string | null
  agencyPhone?: string | null
  scope: string
  deliverables: string
  timeline: string
  terms: string
  totalAmount: number
  items: TemplateLineItem[]
  brandColor: string
  legalName?: string | null
  registrationNumber?: string | null
  taxId?: string | null
  termsConditions?: string | null
  privacyPolicy?: string | null
  proposalFooter?: string | null
}

// Map from the DB raw proposal to TemplateData
export function mapProposalToTemplateData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposal: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agencyContext: any = {},
  brandColor: string = '#0f172a'
): TemplateData {
  const clientName = proposal.client?.name || proposal.lead?.name || 'Client'
  const clientCompany = proposal.client?.company || proposal.lead?.company || ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (proposal.items || []).map((item: any) => ({
    id: item.id || '',
    description: item.description || '',
    qty: Number(item.qty || 0),
    unitPrice: Number(item.unit_price || 0),
    total: Number(item.qty || 0) * Number(item.unit_price || 0)
  }))

  const dateStr = proposal.created_at
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(proposal.created_at))
    : new Date().toLocaleDateString()

  // Fallback priority:
  // 1. Snapshot stored in proposal
  // 2. Live agency context passed in
  const snap = proposal.branding_snapshot || {}
  
  return {
    title: proposal.title || 'Proposal',
    date: dateStr,
    clientName,
    clientCompany,
    agencyName: snap.agency_name || agencyContext.name || 'Our Agency',
    agencyLogo: snap.logo_url || agencyContext.logo_url || agencyContext.logoUrl,
    agencyEmail: agencyContext.email, // Not in snapshot currently
    agencyPhone: agencyContext.phone,
    scope: proposal.scope || '',
    deliverables: proposal.deliverables || '',
    timeline: proposal.timeline || '',
    terms: proposal.terms || '',
    totalAmount: Number(proposal.amount),
    items,
    brandColor: snap.primary_color || brandColor,
    legalName: snap.legal_name || agencyContext.legal_name,
    registrationNumber: snap.registration_number || agencyContext.registration_number,
    taxId: snap.tax_id || agencyContext.tax_id,
    termsConditions: snap.terms_and_conditions || agencyContext.terms_and_conditions,
    privacyPolicy: snap.privacy_policy || agencyContext.privacy_policy,
    proposalFooter: snap.default_proposal_footer || agencyContext.default_proposal_footer,
  }
}


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
}

// Map from the DB raw proposal to TemplateData
export function mapProposalToTemplateData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposal: any,
  agencyContext: { name: string; logoUrl?: string | null; email?: string | null; phone?: string | null },
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

  return {
    title: proposal.title || 'Proposal',
    date: dateStr,
    clientName,
    clientCompany,
    agencyName: agencyContext.name || 'Our Agency',
    agencyLogo: agencyContext.logoUrl,
    agencyEmail: agencyContext.email,
    agencyPhone: agencyContext.phone,
    scope: proposal.scope || '',
    deliverables: proposal.deliverables || '',
    timeline: proposal.timeline || '',
    terms: proposal.terms || '',
    totalAmount: Number(proposal.amount),
    items,
    brandColor
  }
}


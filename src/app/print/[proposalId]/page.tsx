import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth'
import { getProposal } from '@/lib/proposals'
import { TemplateRegistry } from '@/lib/template-registry'
import '@/components/proposals/templates' // Manifest
import { mapProposalToTemplateData } from '@/lib/templates'

interface PrintProposalPageProps {
  params: Promise<{ proposalId: string }>
}

export default async function PrintProposalPage({ params }: PrintProposalPageProps) {
  // Use requireStaff just like the dashboard. Puppeteer will receive the auth cookie.
  const { profile, supabase } = await requireStaff()
  const resolvedParams = await params
  
  const proposal = await getProposal(resolvedParams.proposalId)

  if (!proposal) {
    notFound()
  }

  // Fetch Agency Context
  const { data: agency } = await supabase
    .from('agencies')
    .select('name, logo_url, settings')
    .eq('id', profile.agency_id)
    .single()

  const templateData = mapProposalToTemplateData(
    proposal, 
    { 
      name: agency?.name || 'Our Agency',
      logoUrl: agency?.logo_url,
      email: null,
      phone: null
    }
  )

  const templates = TemplateRegistry.getAll()
  const activeTemplateConfig = TemplateRegistry.getById(proposal.template_id) || templates[0]
  const ActiveComponent = activeTemplateConfig.component

  return (
    <div className="proposal-container bg-white min-h-screen">
      <ActiveComponent data={templateData} />
    </div>
  )
}

import { notFound } from 'next/navigation'
import { getProposalFromToken } from '@/lib/proposals-analytics'
import { TemplateRegistry } from '@/lib/template-registry'
import '@/components/proposals/templates' // Manifest
import { mapProposalToTemplateData } from '@/lib/templates'
import { PublicAnalyticsTracker } from '@/components/analytics/PublicAnalyticsTracker'
import { LockIcon } from 'lucide-react'

interface PublicProposalPageProps {
  params: Promise<{ token: string }>
}

function AccessDeniedView({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border text-center max-w-md w-full">
        <div className="bg-slate-100 text-slate-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500">{message}</p>
      </div>
    </div>
  )
}

export default async function PublicProposalPage({ params }: PublicProposalPageProps) {
  const resolvedParams = await params
  
  let result
  try {
    result = await getProposalFromToken(resolvedParams.token)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const msg = err.message || ''
    if (msg.includes('revoked') || msg.includes('Invalid') || msg.includes('expired') || msg.includes('not found')) {
      return <AccessDeniedView message="This proposal is no longer available. Please contact your agency for an updated link." />
    }
    // For unexpected database errors, throw so error.tsx catches it
    throw err
  }

  const { link, proposal, agencyName } = result

  // Fallback to modern-agency if template_id is somehow missing
  const templates = TemplateRegistry.getAll()
  const activeTemplateConfig = TemplateRegistry.getById(proposal.template_id) || templates[0]
  const ActiveComponent = activeTemplateConfig.component

  // Use the agencyName fetched securely by the service role
  const templateData = mapProposalToTemplateData(
    proposal, 
    { name: agencyName || 'Our Agency' }
  )

  return (
    <>
      <PublicAnalyticsTracker 
        linkId={link.id} 
        proposalId={link.proposal_id} 
        agencyId={link.agency_id} 
        token={resolvedParams.token} 
      />
      <div className="min-h-screen bg-slate-100">
        <ActiveComponent data={templateData} />
      </div>
    </>
  )
}

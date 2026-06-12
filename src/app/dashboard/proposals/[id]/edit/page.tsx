import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth'
import { getProposal } from '@/lib/proposals'
import { listClients } from '@/lib/clients'
import { listLeads } from '@/lib/leads'
import { ProposalForm } from '../../proposal-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProposalPage({ params }: PageProps) {
  await requireStaff()
  const resolvedParams = await params
  const proposal = await getProposal(resolvedParams.id)

  if (!proposal) {
    notFound()
  }

  const { clients } = await listClients()
  const { leads } = await listLeads()

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Edit Proposal</h1>
        <p className='text-sm text-muted-foreground'>Update the proposal scope, terms, and line items.</p>
      </div>

      <ProposalForm 
        proposal={proposal}
        clients={clients.map(c => ({ id: c.id, name: c.name }))} 
        leads={leads.map(l => ({ id: l.id, name: l.name }))} 
      />
    </div>
  )
}

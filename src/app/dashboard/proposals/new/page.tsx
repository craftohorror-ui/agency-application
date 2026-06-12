import { requireStaff } from '@/lib/auth'
import { listClients } from '@/lib/clients'
import { listLeads } from '@/lib/leads'
import { ProposalForm } from '../proposal-form'

export default async function NewProposalPage() {
  await requireStaff()
  
  const { clients } = await listClients()
  const { leads } = await listLeads()

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Create Proposal</h1>
        <p className='text-sm text-muted-foreground'>Draft a new proposal for a client or lead.</p>
      </div>

      <ProposalForm 
        clients={clients.map(c => ({ id: c.id, name: c.name }))} 
        leads={leads.map(l => ({ id: l.id, name: l.name }))} 
      />
    </div>
  )
}

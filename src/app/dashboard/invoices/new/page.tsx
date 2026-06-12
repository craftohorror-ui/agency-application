import { requireStaff } from '@/lib/auth'
import { listClients } from '@/lib/clients'
import { listProjects } from '@/lib/projects'
import { InvoiceForm } from '../invoice-form'

export default async function NewInvoicePage() {
  await requireStaff()
  
  // Need to fetch clients and projects to populate the select dropdowns
  const { clients } = await listClients()
  const { projects } = await listProjects()

  return (
    <div className='max-w-4xl space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Create Invoice</h1>
        <p className='text-sm text-muted-foreground'>Generate a new invoice for a client.</p>
      </div>

      <InvoiceForm clients={clients} projects={projects} />
    </div>
  )
}

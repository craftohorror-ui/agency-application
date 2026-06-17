import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth'
import { listClients } from '@/lib/clients'
import { listProjects } from '@/lib/projects'
import { getInvoice } from '@/lib/invoices'
import { InvoiceForm } from '../../invoice-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditInvoicePage({ params }: PageProps) {
  try {
    await requireStaff()
    const resolvedParams = await params

    const invoice = await getInvoice(resolvedParams.id)
  if (!invoice) notFound()

  const { clients } = await listClients()
  const { projects } = await listProjects()

  return (
    <div className='max-w-4xl space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Edit Invoice {invoice.number}</h1>
        <p className='text-sm text-muted-foreground'>Modify invoice details and line items.</p>
      </div>

      <InvoiceForm invoice={invoice} clients={clients} projects={projects} />
    </div>
  )
  } catch (err: any) {
    return (
      <div className="p-8 bg-red-50 text-red-900 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Runtime Error Diagnosis (Edit Page)</h1>
        <pre className="whitespace-pre-wrap">{err.stack || err.message || String(err)}</pre>
      </div>
    )
  }
}

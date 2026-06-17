import { notFound } from 'next/navigation'
import { getInvoice } from '@/lib/invoices'
import { listPayments } from '@/lib/payments'
import { getInvoiceTemplate, mapInvoiceToTemplateData } from '@/lib/invoice-template-registry'
import { requireStaff } from '@/lib/auth'

interface PrintPageProps {
  params: Promise<{ invoiceId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PrintInvoicePage({ params, searchParams }: PrintPageProps) {
  const resolvedParams = await params
  const invoice = await getInvoice(resolvedParams.invoiceId)
  
  if (!invoice) {
    notFound()
  }

  // Parse template from searchParams
  const resolvedSearch = await searchParams
  const templateParam = resolvedSearch.template as string
  const templateId = templateParam || invoice.template_id || 'modern-business'

  // Fetch Agency & Payments
  const { profile, supabase } = await requireStaff()
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', profile.agency_id)
    .single()

  const payments = await listPayments(invoice.id)
  const templateData = mapInvoiceToTemplateData({ ...invoice, payments }, agency)
  const selectedTemplate = getInvoiceTemplate(templateId) || getInvoiceTemplate('modern-business')

  if (!selectedTemplate) {
    notFound()
  }

  const TemplateComponent = selectedTemplate.component

  return (
    <div className="bg-white min-h-screen">
      <TemplateComponent data={templateData} />
    </div>
  )
}

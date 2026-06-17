import { notFound } from 'next/navigation'
import { getContract } from '@/lib/contracts'
import { createAdminClient } from '@/lib/supabase/admin'
import { getContractTemplate, mapContractToTemplateData } from '@/lib/contract-template-registry'
import '@/app/globals.css' // Ensure Tailwind styles load for print

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ contractId: string }>
  searchParams: Promise<{ template?: string }>
}

export default async function PrintContractPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const contract = await getContract(resolvedParams.contractId)

  if (!contract) {
    notFound()
  }

  // We are bypassing RLS by fetching via admin or relying on getContract which uses staff context?
  // Wait, the print route doesn't have an authenticated session if puppeteer hits it.
  // We need to fetch via admin or pass a token. We'll use a token like public proposals,
  // OR the export route injects an auth token. Actually, we can fetch the contract securely here.
  // Wait, `getContract` calls `requireStaff()`. Puppeteer won't have cookies.
  // I'll fetch via admin client directly.
  
  const supabaseAdmin = createAdminClient()
  const { data: adminContract, error: contractErr } = await supabaseAdmin
    .from('contracts')
    .select('*, client:clients(id, name, company)')
    .eq('id', resolvedParams.contractId)
    .single()

  if (contractErr || !adminContract) {
    notFound()
  }

  // Fetch Agency
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('agency_id')
    .eq('id', adminContract.created_by || '') // fallback, or we fetch the agency directly from client
    .maybeSingle()

  // Alternatively, just grab the first admin's agency or rely on something else.
  // Wait, contracts are scoped to client_id. Client has agency_id? No, clients don't explicitly have agency_id in this context, they belong to the agency.
  // Actually, we can just grab agency context from the client.
  // Let me check if clients have agency_id. If not, how do we get agency?
  // I will just fetch agency via the creator's profile.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let agencyData: any = { name: 'Our Agency', logoUrl: undefined as string | undefined }
  
  if (profile?.agency_id) {
    const { data: agency } = await supabaseAdmin
      .from('agencies')
      .select('*')
      .eq('id', profile.agency_id)
      .single()
    if (agency) {
      agencyData = agency
    }
  }

  const resolvedSearchParams = await searchParams
  const templateId = resolvedSearchParams.template || adminContract.template_id || 'modern-business'
  
  const selectedTemplate = getContractTemplate(templateId)
  
  if (!selectedTemplate) {
    return <div className="p-8 text-red-500 font-mono">Template not found: {templateId}</div>
  }

  const templateData = mapContractToTemplateData(adminContract, agencyData)

  const TemplateComponent = selectedTemplate.component

  return (
    <div className="bg-white min-h-screen print:bg-transparent">
      {/* We add a specific print wrap so templates can hook into it if needed */}
      <div className="print-safe-area">
        <TemplateComponent data={templateData} />
      </div>
    </div>
  )
}

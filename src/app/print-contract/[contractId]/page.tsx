import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { getContractTemplate, mapContractToTemplateData } from '@/lib/contract-template-registry'
import '@/app/globals.css' // Ensure Tailwind styles load for print

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ contractId: string }>
  searchParams: Promise<{ template?: string }>
}

export default async function PrintContractPage({ params, searchParams }: PageProps) {
  // Auth guard — page-level protection in addition to middleware
  const { supabase, profile } = await requireStaff()

  const resolvedParams = await params
  const contractId = resolvedParams.contractId

  // V-1 IDOR FIX: Before using the admin client, validate that this contract belongs
  // to the user's agency by fetching it through the authenticated (RLS-scoped) client.
  // The admin client bypasses RLS — so this check is the authorization gate.
  const { data: authCheck, error: authErr } = await supabase
    .from('contracts')
    .select('agency_id')
    .eq('id', contractId)
    .maybeSingle()

  if (authErr || !authCheck || authCheck.agency_id !== profile.agency_id) {
    notFound()
  }

  // Agency ownership confirmed — safe to use admin client for full render data
  const supabaseAdmin = createAdminClient()
  const { data: adminContract, error: contractErr } = await supabaseAdmin
    .from('contracts')
    .select('*, client:clients(id, name, company)')
    .eq('id', contractId)
    .single()

  if (contractErr || !adminContract) {
    notFound()
  }

  // Fetch Agency via creator's profile
  const { data: creatorProfile } = await supabaseAdmin
    .from('profiles')
    .select('agency_id')
    .eq('id', adminContract.created_by || '')
    .maybeSingle()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let agencyData: any = { name: 'Our Agency', logoUrl: undefined as string | undefined }
  
  if (creatorProfile?.agency_id) {
    const { data: agency } = await supabaseAdmin
      .from('agencies')
      .select('*')
      .eq('id', creatorProfile.agency_id)
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

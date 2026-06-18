import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getContractTemplate, mapContractToTemplateData } from '@/lib/contract-template-registry'
import { generateContractDocx } from '@/lib/docx-contract'
import { requireStaff } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth guard — must be before any data access
    const { supabase, profile } = await requireStaff()

    const resolvedParams = await params
    const id = resolvedParams.id
    
    // Parse template ID from query params
    const searchParams = request.nextUrl.searchParams
    const templateId = searchParams.get('template') || 'modern-business'

    // V-1 IDOR FIX: Validate agency ownership through the RLS-scoped client before
    // using createAdminClient() which bypasses RLS entirely.
    const { data: authCheck, error: authErr } = await supabase
      .from('contracts')
      .select('agency_id')
      .eq('id', id)
      .maybeSingle()

    if (authErr || !authCheck || authCheck.agency_id !== profile.agency_id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Agency ownership confirmed — safe to use admin client for full export data
    const supabaseAdmin = createAdminClient()
    const { data: adminContract, error: contractErr } = await supabaseAdmin
      .from('contracts')
      .select('*, client:clients(id, name, company)')
      .eq('id', id)
      .single()

    if (contractErr || !adminContract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Fetch Agency
    const { data: creatorProfile } = await supabaseAdmin
      .from('profiles')
      .select('agency_id')
      .eq('id', adminContract.created_by || '')
      .maybeSingle()

    let agencyData = { name: 'Our Agency', logoUrl: undefined as string | undefined }
    if (creatorProfile?.agency_id) {
      const { data: agency } = await supabaseAdmin
        .from('agencies')
        .select('name, logo_url')
        .eq('id', creatorProfile.agency_id)
        .single()
      if (agency) {
        agencyData = { name: agency.name, logoUrl: agency.logo_url }
      }
    }

    const templateData = mapContractToTemplateData(adminContract, agencyData)
    const selectedTemplate = getContractTemplate(templateId) || getContractTemplate('modern-business')

    if (!selectedTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 400 })
    }

    const blob = await generateContractDocx(templateData, selectedTemplate)
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="contract-${id}.docx"`,
      },
    })
  } catch (error) {
    console.error('Failed to generate DOCX:', error)
    return NextResponse.json({ error: 'Failed to generate DOCX' }, { status: 500 })
  }
}

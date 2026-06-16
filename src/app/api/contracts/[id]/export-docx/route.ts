import { NextRequest, NextResponse } from 'next/server'
import { getContract } from '@/lib/contracts'
import { createAdminClient } from '@/lib/supabase/admin'
import { getContractTemplate, mapContractToTemplateData } from '@/lib/contract-template-registry'
import { generateContractDocx } from '@/lib/docx-contract'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    
    // Parse template ID from query params
    const searchParams = request.nextUrl.searchParams
    const templateId = searchParams.get('template') || 'modern-business'

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
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('agency_id')
      .eq('id', adminContract.created_by || '')
      .maybeSingle()

    let agencyData = { name: 'Our Agency', logoUrl: undefined as string | undefined }
    if (profile?.agency_id) {
      const { data: agency } = await supabaseAdmin
        .from('agencies')
        .select('name, logo_url')
        .eq('id', profile.agency_id)
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

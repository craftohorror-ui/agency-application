import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getInvoiceTemplate, mapInvoiceToTemplateData } from '@/lib/invoice-template-registry'
import { generateInvoiceDocx } from '@/lib/docx-invoice'
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
      .from('invoices')
      .select('agency_id')
      .eq('id', id)
      .maybeSingle()

    if (authErr || !authCheck || authCheck.agency_id !== profile.agency_id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const supabaseAdmin = createAdminClient()
    const { data: invoice, error: invoiceErr } = await supabaseAdmin
      .from('invoices')
      .select('*, client:clients(id, name, company), project:projects(id, name, contract_id), items:invoice_items(*), payments(*)')
      .eq('id', id)
      .single()

    if (invoiceErr || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Fetch Agency
    const { data: clientData } = await supabaseAdmin
      .from('clients')
      .select('agency_id')
      .eq('id', invoice.client_id)
      .maybeSingle()

    let agencyData = { name: 'Our Agency', logoUrl: undefined as string | undefined }
    if (clientData?.agency_id) {
      const { data: agency } = await supabaseAdmin
        .from('agencies')
        .select('*')
        .eq('id', clientData.agency_id)
        .single()
      if (agency) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        agencyData = agency as any
      }
    }

    const templateData = mapInvoiceToTemplateData(invoice, agencyData)
    const selectedTemplate = getInvoiceTemplate(templateId) || getInvoiceTemplate('modern-business')

    if (!selectedTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 400 })
    }

    const blob = await generateInvoiceDocx(templateData, selectedTemplate)
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="invoice-${id}.docx"`,
      },
    })
  } catch (error) {
    console.error('Failed to generate DOCX:', error)
    return NextResponse.json({ error: 'Failed to generate DOCX' }, { status: 500 })
  }
}

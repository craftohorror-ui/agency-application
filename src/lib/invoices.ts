import 'server-only'

import { requireStaff, requireClient } from '@/lib/auth'
import { getCurrentAgencySettings } from '@/lib/agencies'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/lib/types'

export interface InvoiceWithRelations extends Invoice {
  items: InvoiceItem[]
  client: { id: string; name: string; company: string | null } | null
  project: { id: string; name: string } | null
}

// -------------------------------------------------------------
// ENHANCEMENT MAPPER (Temporary until migration)
// -------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInvoiceEnhancements(invoice: any) {
  if (!invoice) return invoice
  if (invoice.currency === undefined) {
    invoice.currency = invoice.branding_snapshot?.currency || 'USD'
    invoice.discount_type = invoice.branding_snapshot?.discount_type || 'fixed'
    invoice.discount_value = invoice.branding_snapshot?.discount_value || 0
    invoice.tax_type = invoice.branding_snapshot?.tax_type || 'none'
    invoice.template_id = invoice.branding_snapshot?.template_id || 'modern-business'
  }
  return invoice
}

// -------------------------------------------------------------
// CORE CALCULATIONS
// -------------------------------------------------------------

function calculateTotals(
  items: { qty: number; unit_price: number }[], 
  taxRate: number,
  discountType: string = 'fixed',
  discountValue: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0)
  
  let discountAmount = 0
  if (discountType === 'percentage') {
    discountAmount = subtotal * (discountValue / 100)
  } else {
    discountAmount = discountValue
  }
  
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const taxAmount = (subtotalAfterDiscount * taxRate) / 100
  const total = subtotalAfterDiscount + taxAmount
  
  return { subtotal, taxAmount, total }
}

function determineStatus(amountPaid: number, total: number, dueDate: string, currentStatus: InvoiceStatus): InvoiceStatus {
  if (currentStatus === 'draft') return currentStatus
  
  if (amountPaid >= total && total > 0) return 'paid'
  if (amountPaid > 0 && amountPaid < total) return 'partially_paid'
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  
  if (today > due && amountPaid < total) return 'overdue'
  
  return currentStatus === 'paid' ? 'sent' : currentStatus
}

export async function recalculateInvoice(id: string) {
  const { supabase } = await requireStaff()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('status, due_date, tax_rate, amount_paid, branding_snapshot')
    .eq('id', id)
    .single()

  if (!invoice) return

  const { data: items } = await supabase
    .from('invoice_items')
    .select('qty, unit_price')
    .eq('invoice_id', id)

  const discount_type = invoice.branding_snapshot?.discount_type || 'fixed'
  const discount_value = invoice.branding_snapshot?.discount_value || 0

  const { subtotal, taxAmount, total } = calculateTotals(
    items || [], 
    invoice.tax_rate, 
    discount_type, 
    discount_value
  )
  const newStatus = determineStatus(invoice.amount_paid, total, invoice.due_date, invoice.status)

  await supabase.from('invoices').update({
    subtotal,
    tax_amount: taxAmount,
    total,
    status: newStatus
  }).eq('id', id)
}

export async function recalculateInvoicePayments(id: string) {
  const { supabase } = await requireStaff()
  
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('invoice_id', id)

  const amount_paid = (payments || []).reduce((sum, p) => sum + p.amount, 0)

  await supabase.from('invoices').update({ amount_paid }).eq('id', id)
  await recalculateInvoice(id)
}

// -------------------------------------------------------------
// STAFF QUERIES
// -------------------------------------------------------------

export async function listInvoices(search?: string, status?: InvoiceStatus) {
  const { supabase } = await requireStaff()

  let query = supabase
    .from('invoices')
    .select('*, client:clients(id, name, company), project:projects(id, name)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search?.trim()) {
    const pattern = `%${search.replace(/[%_,()\\]/g, '\\$&').trim()}%`
    query = query.or(`number.ilike.${pattern},client.name.ilike.${pattern}`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return { invoices: (data || []).map(mapInvoiceEnhancements) as InvoiceWithRelations[], count }
}

export async function getInvoice(id: string): Promise<InvoiceWithRelations | null> {
  const { supabase } = await requireStaff()
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      items:invoice_items(*),
      client:clients(id, name, company),
      project:projects(id, name)
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return mapInvoiceEnhancements(data) as InvoiceWithRelations | null
}

export type CreateInvoiceInput = {
  client_id: string
  project_id?: string | null
  status?: InvoiceStatus
  issue_date: string
  due_date: string
  tax_rate?: number
  tax_type?: string
  currency?: string
  discount_type?: string
  discount_value?: number
  template_id?: string
  notes?: string | null
}

export type CreateInvoiceItemInput = {
  description: string
  qty: number
  unit_price: number
}

export async function createInvoice(input: CreateInvoiceInput, items: CreateInvoiceItemInput[]) {
  const { supabase } = await requireStaff()
  const agencySettings = await getCurrentAgencySettings()

  const branding_snapshot = {
    agency_name: agencySettings.name,
    logo_url: agencySettings.logo_url,
    logo_dark_url: agencySettings.logo_dark_url,
    primary_color: agencySettings.primary_color || '#0f172a',
    secondary_color: agencySettings.secondary_color || '#334155',
    accent_color: agencySettings.accent_color || '#2563eb',
    terms_and_conditions: agencySettings.terms_and_conditions,
    privacy_policy: agencySettings.privacy_policy,
    legal_name: agencySettings.legal_name,
    registration_number: agencySettings.registration_number,
    tax_id: agencySettings.tax_id,
    website: agencySettings.website,
    linkedin_url: agencySettings.linkedin_url,
    instagram_url: agencySettings.instagram_url,
    facebook_url: agencySettings.facebook_url,
    default_proposal_footer: agencySettings.default_proposal_footer,
    default_contract_footer: agencySettings.default_contract_footer,
    default_invoice_footer: agencySettings.default_invoice_footer,
    default_legal_disclaimer: agencySettings.default_legal_disclaimer
  }

  const taxRate = input.tax_rate || 0
  const { subtotal, taxAmount, total } = calculateTotals(
    items,
    taxRate,
    input.discount_type || 'fixed',
    input.discount_value || 0
  )
  
  // Use agency default notes/disclaimer if none provided
  const notes = input.notes || agencySettings.default_invoice_footer

  // Temporary fix: strip new columns that aren't in the DB yet
  const { tax_type, currency, discount_type, discount_value, template_id, ...safeInput } = input

  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .insert({
      ...safeInput,
      notes,
      tax_rate: taxRate,
      subtotal,
      tax_amount: taxAmount,
      total,
      amount_paid: 0,
      status: safeInput.status || 'draft',
      branding_snapshot: {
        ...branding_snapshot,
        // Store template data here temporarily until migration runs
        tax_type, currency, discount_type, discount_value, template_id
      }
    })
    .select('*')
    .single()

  if (invError) throw new Error(invError.message)

  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(items.map(item => ({ ...item, invoice_id: invoice.id })))

    if (itemsError) throw new Error(itemsError.message)
  }

  return getInvoice(invoice.id)
}

export async function updateInvoice(id: string, input: Partial<CreateInvoiceInput>, items?: CreateInvoiceItemInput[]) {
  const { supabase } = await requireStaff()

  // Temporary fix: strip new columns that aren't in the DB yet
  const { tax_type, currency, discount_type, discount_value, template_id, ...safeInput } = input

  // Fetch current branding snapshot to preserve and update
  const { data: existing } = await supabase.from('invoices').select('branding_snapshot').eq('id', id).single()
  const existingSnapshot = existing?.branding_snapshot || {}
  
  const updatedSnapshot = {
    ...existingSnapshot,
    tax_type: tax_type !== undefined ? tax_type : existingSnapshot.tax_type,
    currency: currency !== undefined ? currency : existingSnapshot.currency,
    discount_type: discount_type !== undefined ? discount_type : existingSnapshot.discount_type,
    discount_value: discount_value !== undefined ? discount_value : existingSnapshot.discount_value,
    template_id: template_id !== undefined ? template_id : existingSnapshot.template_id,
  }

  const { error: invError } = await supabase
    .from('invoices')
    .update({
      ...safeInput,
      branding_snapshot: updatedSnapshot
    })
    .eq('id', id)

  if (invError) throw new Error(invError.message)

  if (items) {
    await supabase.from('invoice_items').delete().eq('invoice_id', id)
    if (items.length > 0) {
      await supabase.from('invoice_items').insert(items.map(item => ({ ...item, invoice_id: id })))
    }
  }

  // Recalculate everything
  await recalculateInvoice(id)

  return getInvoice(id)
}

export async function deleteInvoice(id: string) {
  const { supabase } = await requireStaff()
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// -------------------------------------------------------------
// CLIENT (PORTAL) QUERIES
// -------------------------------------------------------------

export async function listPortalInvoices() {
  const { supabase } = await requireClient()
  
  // Implicitly scoped by my_client_id() RLS
  const { data, error } = await supabase
    .from('invoices')
    .select('*, project:projects(id, name)')
    .in('status', ['sent', 'partially_paid', 'paid', 'overdue']) // hide drafts
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map(mapInvoiceEnhancements) as InvoiceWithRelations[]
}

export async function getPortalInvoice(id: string): Promise<InvoiceWithRelations | null> {
  const { supabase } = await requireClient()
  
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      items:invoice_items(*),
      client:clients(id, name, company),
      project:projects(id, name)
    `)
    .eq('id', id)
    .in('status', ['sent', 'partially_paid', 'paid', 'overdue'])
    .maybeSingle()

  if (error) throw new Error(error.message)
  return mapInvoiceEnhancements(data) as InvoiceWithRelations | null
}

export async function generateInvoiceFromProject(projectId: string) {
  const { supabase } = await requireStaff()
  
  const { data: project, error: pErr } = await supabase.from('projects').select('*, milestones(*)').eq('id', projectId).single()
  if (pErr) throw new Error(pErr.message)
  if (!project || !project.client_id) throw new Error('Project has no linked client')

  const items = []
  if (project.milestones && project.milestones.length > 0) {
    for (const m of project.milestones) {
      if (m.amount > 0) {
        items.push({ description: `Milestone: ${m.title}`, qty: 1, unit_price: m.amount })
      }
    }
  }

  if (items.length === 0 && project.budget > 0) {
    items.push({ description: `Project Implementation: ${project.name}`, qty: 1, unit_price: project.budget })
  }

  const { subtotal, taxAmount, total } = calculateTotals(items, 0)
  
  const issue_date = new Date().toISOString().split('T')[0]
  const due_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const agencySettings = await getCurrentAgencySettings()
  
  const branding_snapshot = {
    agency_name: agencySettings.name,
    logo_url: agencySettings.logo_url,
    logo_dark_url: agencySettings.logo_dark_url,
    primary_color: agencySettings.primary_color || '#0f172a',
    secondary_color: agencySettings.secondary_color || '#334155',
    accent_color: agencySettings.accent_color || '#2563eb',
    terms_and_conditions: agencySettings.terms_and_conditions,
    privacy_policy: agencySettings.privacy_policy,
    legal_name: agencySettings.legal_name,
    registration_number: agencySettings.registration_number,
    tax_id: agencySettings.tax_id,
    website: agencySettings.website,
    linkedin_url: agencySettings.linkedin_url,
    instagram_url: agencySettings.instagram_url,
    facebook_url: agencySettings.facebook_url,
    default_proposal_footer: agencySettings.default_proposal_footer,
    default_contract_footer: agencySettings.default_contract_footer,
    default_invoice_footer: agencySettings.default_invoice_footer,
    default_legal_disclaimer: agencySettings.default_legal_disclaimer
  }

  const { data: invoice, error } = await supabase.from('invoices').insert({
    client_id: project.client_id,
    project_id: project.id,
    issue_date,
    due_date,
    tax_rate: 0,
    subtotal,
    tax_amount: taxAmount,
    total,
    amount_paid: 0,
    status: 'draft',
    notes: agencySettings.default_invoice_footer,
    branding_snapshot
  }).select('id').single()

  if (error) throw new Error(error.message)

  if (items.length > 0) {
    await supabase.from('invoice_items').insert(items.map(item => ({ ...item, invoice_id: invoice.id })))
  }

  return invoice.id
}

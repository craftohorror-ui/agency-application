import 'server-only'

import { requireStaff, requireClient } from '@/lib/auth'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/lib/types'

export interface InvoiceWithRelations extends Invoice {
  items: InvoiceItem[]
  client: { id: string; name: string; company: string | null } | null
  project: { id: string; name: string } | null
}

// -------------------------------------------------------------
// CORE CALCULATIONS
// -------------------------------------------------------------

function calculateTotals(items: { qty: number; unit_price: number }[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount
  return { subtotal, taxAmount, total }
}

function determineStatus(amountPaid: number, total: number, dueDate: string, currentStatus: InvoiceStatus): InvoiceStatus {
  if (currentStatus === 'draft' || currentStatus === 'cancelled') return currentStatus
  
  if (amountPaid >= total && total > 0) return 'paid'
  if (amountPaid > 0 && amountPaid < total) return 'partial'
  
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
    .select('status, due_date, tax_rate, amount_paid')
    .eq('id', id)
    .single()

  if (!invoice) return

  const { data: items } = await supabase
    .from('invoice_items')
    .select('qty, unit_price')
    .eq('invoice_id', id)

  const { subtotal, taxAmount, total } = calculateTotals(items || [], invoice.tax_rate)
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

  return { invoices: data as InvoiceWithRelations[], count }
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
  return data as InvoiceWithRelations | null
}

export type CreateInvoiceInput = {
  client_id: string
  project_id?: string | null
  status?: InvoiceStatus
  issue_date: string
  due_date: string
  tax_rate?: number
  notes?: string | null
}

export type CreateInvoiceItemInput = {
  description: string
  qty: number
  unit_price: number
}

export async function createInvoice(input: CreateInvoiceInput, items: CreateInvoiceItemInput[]) {
  const { supabase } = await requireStaff()

  const taxRate = input.tax_rate || 0
  const { subtotal, taxAmount, total } = calculateTotals(items, taxRate)

  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .insert({
      ...input,
      tax_rate: taxRate,
      subtotal,
      tax_amount: taxAmount,
      total,
      amount_paid: 0,
      status: input.status || 'draft'
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

  const { error: invError } = await supabase
    .from('invoices')
    .update(input)
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
    .in('status', ['sent', 'partial', 'paid', 'overdue', 'cancelled']) // hide drafts
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as InvoiceWithRelations[]
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
    .in('status', ['sent', 'partial', 'paid', 'overdue', 'cancelled'])
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as InvoiceWithRelations | null
}

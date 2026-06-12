import 'server-only'

import { requireStaff, requireClient } from '@/lib/auth'
import { recalculateInvoicePayments } from './invoices'

export interface Payment {
  id: string
  invoice_id: string
  amount: number
  paid_at: string
  method: string | null
  reference: string | null
}

export async function listPayments(invoiceId: string) {
  const { supabase } = await requireStaff()
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('paid_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Payment[]
}

export async function recordPayment(invoiceId: string, input: { amount: number; method?: string; reference?: string; paid_at?: string }) {
  const { supabase } = await requireStaff()

  const { error } = await supabase
    .from('payments')
    .insert({
      invoice_id: invoiceId,
      amount: input.amount,
      method: input.method || null,
      reference: input.reference || null,
      paid_at: input.paid_at || new Date().toISOString()
    })

  if (error) throw new Error(error.message)

  // Trigger invoice recalculation
  await recalculateInvoicePayments(invoiceId)
}

export async function deletePayment(id: string, invoiceId: string) {
  const { supabase } = await requireStaff()
  
  const { error } = await supabase.from('payments').delete().eq('id', id)
  if (error) throw new Error(error.message)

  // Trigger invoice recalculation
  await recalculateInvoicePayments(invoiceId)
}

// -------------------------------------------------------------
// CLIENT (PORTAL) QUERIES
// -------------------------------------------------------------

export async function listPortalPayments(invoiceId: string) {
  const { supabase } = await requireClient()
  
  // Note: RLS on payments implicitly requires access to the invoice
  // Let's verify invoice ownership first just in case
  const { data: invoice } = await supabase.from('invoices').select('id').eq('id', invoiceId).single()
  if (!invoice) throw new Error('Invoice not found or unauthorized')

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('paid_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Payment[]
}

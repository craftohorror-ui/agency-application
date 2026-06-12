'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createInvoice, updateInvoice, deleteInvoice, generateInvoiceFromProject } from '@/lib/invoices'
import { recordPayment, deletePayment } from '@/lib/payments'
import type { InvoiceStatus } from '@/lib/types'

export type InvoiceFormState = {
  errors?: {
    client_id?: string[]
    issue_date?: string[]
    due_date?: string[]
    items?: string
    server?: string
  }
}

export async function createInvoiceAction(prevState: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  const client_id = formData.get('client_id') as string
  const project_id = formData.get('project_id') as string || null
  const issue_date = formData.get('issue_date') as string
  const due_date = formData.get('due_date') as string
  const tax_rate = parseFloat(formData.get('tax_rate') as string) || 0
  const notes = formData.get('notes') as string
  const status = formData.get('status') as InvoiceStatus

  if (!client_id) return { errors: { client_id: ['Client is required'] } }
  if (!issue_date) return { errors: { issue_date: ['Issue date is required'] } }
  if (!due_date) return { errors: { due_date: ['Due date is required'] } }

  const itemsJson = formData.get('items') as string
  let items = []
  try {
    items = JSON.parse(itemsJson)
  } catch (e) {
    return { errors: { items: 'Invalid items format' } }
  }

  try {
    const invoice = await createInvoice({
      client_id,
      project_id,
      issue_date,
      due_date,
      tax_rate,
      notes,
      status
    }, items)

    revalidatePath('/dashboard/invoices')
    redirect(`/dashboard/invoices/${invoice?.id}`)
  } catch (err: unknown) {
    return { errors: { server: err instanceof Error ? err.message : String(err) } }
  }
}

export async function updateInvoiceAction(id: string, prevState: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  const client_id = formData.get('client_id') as string
  const project_id = formData.get('project_id') as string || null
  const issue_date = formData.get('issue_date') as string
  const due_date = formData.get('due_date') as string
  const tax_rate = parseFloat(formData.get('tax_rate') as string) || 0
  const notes = formData.get('notes') as string
  const status = formData.get('status') as InvoiceStatus

  if (!client_id) return { errors: { client_id: ['Client is required'] } }
  if (!issue_date) return { errors: { issue_date: ['Issue date is required'] } }
  if (!due_date) return { errors: { due_date: ['Due date is required'] } }

  const itemsJson = formData.get('items') as string
  let items = []
  try {
    items = JSON.parse(itemsJson)
  } catch (e) {
    return { errors: { items: 'Invalid items format' } }
  }

  try {
    await updateInvoice(id, {
      client_id,
      project_id,
      issue_date,
      due_date,
      tax_rate,
      notes,
      status
    }, items)

    revalidatePath('/dashboard/invoices')
    redirect(`/dashboard/invoices/${id}`)
  } catch (err: unknown) {
    return { errors: { server: err instanceof Error ? err.message : String(err) } }
  }
}

export async function deleteInvoiceAction(id: string) {
  await deleteInvoice(id)
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function recordPaymentAction(invoiceId: string, formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string)
  const method = formData.get('method') as string
  const reference = formData.get('reference') as string
  const paid_at = formData.get('paid_at') as string

  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid payment amount')
  }

  await recordPayment(invoiceId, { amount, method, reference, paid_at })
  revalidatePath(`/dashboard/invoices/${invoiceId}`)
  revalidatePath('/dashboard/invoices')
}

export async function deletePaymentAction(paymentId: string, invoiceId: string) {
  await deletePayment(paymentId, invoiceId)
  revalidatePath(`/dashboard/invoices/${invoiceId}`)
  revalidatePath('/dashboard/invoices')
}

export async function updateInvoiceStatusAction(id: string, status: InvoiceStatus) {
  await updateInvoice(id, { status })
  revalidatePath(`/dashboard/invoices/${id}`)
  revalidatePath('/dashboard/invoices')
}

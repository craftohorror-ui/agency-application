'use server'

import { revalidatePath } from 'next/cache'
import { redirect, unstable_rethrow } from 'next/navigation'
import { createInvoice, updateInvoice, deleteInvoice, generateInvoiceFromProject } from '@/lib/invoices'
import { requireStaff } from '@/lib/auth'
import { insertAuditLog } from '@/lib/audit'
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
  await requireStaff()
  const client_id = formData.get('client_id') as string
  const project_id = formData.get('project_id') as string || null
  const issue_date = formData.get('issue_date') as string
  const due_date = formData.get('due_date') as string
  const tax_rate = parseFloat(formData.get('tax_rate') as string) || 0
  const tax_type = formData.get('tax_type') as string || 'none'
  const currency = formData.get('currency') as string || 'USD'
  const discount_type = formData.get('discount_type') as 'percentage' | 'fixed' || 'fixed'
  const discount_value = parseFloat(formData.get('discount_value') as string) || 0
  const template_id = formData.get('template_id') as string || 'modern-business'
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

  let invoiceId: string
  try {
    const invoice = await createInvoice({
      client_id,
      project_id,
      issue_date,
      due_date,
      tax_rate,
      tax_type,
      currency,
      discount_type,
      discount_value,
      template_id,
      notes,
      status
    }, items)
    if (!invoice) throw new Error('Failed to create invoice')
    invoiceId = invoice.id

    revalidatePath('/dashboard/invoices')
  } catch (err: unknown) {
    unstable_rethrow(err)
    return { errors: { server: err instanceof Error ? err.message : 'Unable to create invoice.' } }
  }

  redirect(`/dashboard/invoices/${invoiceId}?success=Invoice+created+successfully`)
}

export async function updateInvoiceAction(id: string, prevState: InvoiceFormState, formData: FormData): Promise<InvoiceFormState> {
  // Auth FIRST — before any mutation
  const { user } = await requireStaff()

  const client_id = formData.get('client_id') as string
  const project_id = formData.get('project_id') as string || null
  const issue_date = formData.get('issue_date') as string
  const due_date = formData.get('due_date') as string
  const tax_rate = parseFloat(formData.get('tax_rate') as string) || 0
  const tax_type = formData.get('tax_type') as string || 'none'
  const currency = formData.get('currency') as string || 'USD'
  const discount_type = formData.get('discount_type') as 'percentage' | 'fixed' || 'fixed'
  const discount_value = parseFloat(formData.get('discount_value') as string) || 0
  const template_id = formData.get('template_id') as string || 'modern-business'
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
      tax_type,
      currency,
      discount_type,
      discount_value,
      template_id,
      notes,
      status
    }, items)

    await insertAuditLog(user.id, 'invoice.updated', 'invoice', id, { status, due_date })

    revalidatePath('/dashboard/invoices')
  } catch (err: unknown) {
    unstable_rethrow(err)
    return { errors: { server: err instanceof Error ? err.message : 'Unable to update invoice.' } }
  }

  redirect(`/dashboard/invoices/${id}?success=Invoice+updated+successfully`)
}

export async function deleteInvoiceAction(id: string) {
  const { user } = await requireStaff()
  await deleteInvoice(id)
  await insertAuditLog(user.id, 'invoice.deleted', 'invoice', id)
  
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices?success=Invoice+deleted+successfully')
}

export async function recordPaymentAction(invoiceId: string, formData: FormData) {
  await requireStaff()
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
  await requireStaff()
  await deletePayment(paymentId, invoiceId)
  revalidatePath(`/dashboard/invoices/${invoiceId}`)
  revalidatePath('/dashboard/invoices')
}

export async function updateInvoiceStatusAction(id: string, status: InvoiceStatus) {
  await requireStaff()
  await updateInvoice(id, { status })
  revalidatePath(`/dashboard/invoices/${id}`)
  revalidatePath('/dashboard/invoices')
}

export async function generateInvoiceFromProjectAction(projectId: string) {
  await requireStaff()
  const invoiceId = await generateInvoiceFromProject(projectId)
  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath('/dashboard/invoices')
  redirect(`/dashboard/invoices/${invoiceId}?success=Invoice+created+from+project`)
}

export async function updateInvoiceTemplateAction(id: string, templateId: string) {
  await requireStaff()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateInvoice(id, { template_id: templateId } as any)
  revalidatePath(`/dashboard/invoices/${id}`)
  revalidatePath('/dashboard/invoices')
}


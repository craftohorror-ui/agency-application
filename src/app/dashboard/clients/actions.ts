'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  updateClient,
  deleteClient,
  type ClientUpdateInput,
} from '@/lib/clients'
import { requireStaff } from '@/lib/auth'
import { insertAuditLog } from '@/lib/audit'

const CLIENTS_PATH = '/dashboard/clients'

type ClientFormField =
  | 'name'
  | 'email'
  | 'phone'
  | 'company'
  | 'industry'
  | 'address'
  | 'website'
  | 'notes'

export interface ClientFormValues {
  name: string
  email: string
  phone: string
  company: string
  industry: string
  address: string
  website: string
  notes: string
}

export interface ClientFormState {
  errors: Partial<Record<ClientFormField, string>>
  message?: string
  values: ClientFormValues
}

export async function deleteClientAction(id: string) {
  const { user } = await requireStaff()
  await deleteClient(id)
  await insertAuditLog(user.id, 'client.deleted', 'client', id)

  revalidatePath(CLIENTS_PATH)
  redirect(CLIENTS_PATH)
}

function revalidateClientPaths(clientId?: string) {
  revalidatePath(CLIENTS_PATH)

  if (clientId) {
    revalidatePath(`${CLIENTS_PATH}/${clientId}`)
  }
}

function getFormValue(formData: FormData, key: keyof ClientFormValues) {
  return String(formData.get(key) ?? '').trim()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function updateClientFormAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const values: ClientFormValues = {
    name: getFormValue(formData, 'name'),
    email: getFormValue(formData, 'email'),
    phone: getFormValue(formData, 'phone'),
    company: getFormValue(formData, 'company'),
    industry: getFormValue(formData, 'industry'),
    address: getFormValue(formData, 'address'),
    website: getFormValue(formData, 'website'),
    notes: getFormValue(formData, 'notes'),
  }

  const errors: ClientFormState['errors'] = {}

  if (!values.name) {
    errors.name = 'Name is required.'
  }

  if (values.email && !isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values,
      message: 'Please correct the highlighted fields.',
    }
  }

  const clientId = String(formData.get('client_id') || '');
  if (!clientId) {
     return { errors: {}, values, message: 'Missing client ID' }
  }

  try {
    const input: ClientUpdateInput = {
      name: values.name,
      email: values.email || null,
      phone: values.phone || null,
      company: values.company || null,
      industry: values.industry || null,
      address: values.address || null,
      website: values.website || null,
      notes: values.notes || null,
    }
    
    await updateClient(clientId, input)
    revalidateClientPaths(clientId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update client.'

    return {
      errors: {},
      values,
      message,
    }
  }

  redirect(`${CLIENTS_PATH}/${clientId}`)
}

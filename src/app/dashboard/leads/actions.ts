'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  LEAD_STAGES,
  createLead,
  deleteLead,
  updateLead,
  updateLeadStage,
  type LeadInput,
  type LeadUpdateInput,
} from '@/lib/leads'
import type { LeadStage } from '@/lib/types'

const LEADS_PATH = '/dashboard/leads'

type LeadCreateFormField =
  | 'name'
  | 'email'
  | 'phone'
  | 'company'
  | 'source'
  | 'notes'
  | 'value_estimate'
  | 'assigned_to'
  | 'stage'

export interface LeadCreateFormValues {
  name: string
  email: string
  phone: string
  company: string
  source: string
  notes: string
  value_estimate: string
  assigned_to: string
  stage: string
}

export interface LeadCreateFormState {
  errors: Partial<Record<LeadCreateFormField, string>>
  message?: string
  values: LeadCreateFormValues
}

export const initialLeadCreateFormState: LeadCreateFormState = {
  errors: {},
  values: {
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    notes: '',
    value_estimate: '',
    assigned_to: '',
    stage: 'new_lead',
  },
}

function revalidateLeadPaths(leadId?: string) {
  revalidatePath(LEADS_PATH)

  if (leadId) {
    revalidatePath(`${LEADS_PATH}/${leadId}`)
  }
}

export async function createLeadAction(input: LeadInput) {
  const lead = await createLead(input)
  revalidateLeadPaths(lead.id)
  return lead
}

function getFormValue(formData: FormData, key: keyof LeadCreateFormValues) {
  return String(formData.get(key) ?? '').trim()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isLeadStage(value: string): value is LeadStage {
  return LEAD_STAGES.includes(value as LeadStage)
}

export async function createLeadFormAction(
  _prevState: LeadCreateFormState,
  formData: FormData
): Promise<LeadCreateFormState> {
  const values: LeadCreateFormValues = {
    name: getFormValue(formData, 'name'),
    email: getFormValue(formData, 'email'),
    phone: getFormValue(formData, 'phone'),
    company: getFormValue(formData, 'company'),
    source: getFormValue(formData, 'source'),
    notes: getFormValue(formData, 'notes'),
    value_estimate: getFormValue(formData, 'value_estimate'),
    assigned_to: getFormValue(formData, 'assigned_to'),
    stage: getFormValue(formData, 'stage') || 'new_lead',
  }

  const errors: LeadCreateFormState['errors'] = {}

  if (!values.name) {
    errors.name = 'Name is required.'
  }

  if (values.email && !isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!isLeadStage(values.stage)) {
    errors.stage = 'Select a valid lead stage.'
  }

  if (values.value_estimate) {
    errors.value_estimate =
      'Value estimate is not available in the current leads schema yet. Leave this blank for now.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values,
      message: 'Please correct the highlighted fields.',
    }
  }

  try {
    await createLeadAction({
      name: values.name,
      email: values.email || null,
      phone: values.phone || null,
      company: values.company || null,
      source: values.source || null,
      notes: values.notes || null,
      owner_id: values.assigned_to || null,
      stage: values.stage as LeadStage,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create lead.'

    return {
      errors: {},
      values,
      message,
    }
  }

  redirect(LEADS_PATH)
}

export async function updateLeadFormAction(
  _prevState: LeadCreateFormState,
  formData: FormData
): Promise<LeadCreateFormState> {
  const values: LeadCreateFormValues = {
    name: getFormValue(formData, 'name'),
    email: getFormValue(formData, 'email'),
    phone: getFormValue(formData, 'phone'),
    company: getFormValue(formData, 'company'),
    source: getFormValue(formData, 'source'),
    notes: getFormValue(formData, 'notes'),
    value_estimate: getFormValue(formData, 'value_estimate'),
    assigned_to: getFormValue(formData, 'assigned_to'),
    stage: getFormValue(formData, 'stage') || 'new_lead',
  }

  const errors: LeadCreateFormState['errors'] = {}

  if (!values.name) {
    errors.name = 'Name is required.'
  }

  if (values.email && !isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!isLeadStage(values.stage)) {
    errors.stage = 'Select a valid lead stage.'
  }

  if (values.value_estimate) {
    errors.value_estimate =
      'Value estimate is not available in the current leads schema yet. Leave this blank for now.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values,
      message: 'Please correct the highlighted fields.',
    }
  }

  const leadId = String(formData.get('lead_id') || '');
  if (!leadId) {
     return { errors: {}, values, message: 'Missing lead ID' }
  }

  try {
    await updateLeadAction(leadId, {
      name: values.name,
      email: values.email || null,
      phone: values.phone || null,
      company: values.company || null,
      source: values.source || null,
      notes: values.notes || null,
      owner_id: values.assigned_to || null,
      stage: values.stage as LeadStage,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update lead.'

    return {
      errors: {},
      values,
      message,
    }
  }

  redirect(`${LEADS_PATH}/${leadId}`)
}

export async function updateLeadAction(id: string, input: LeadUpdateInput) {
  const lead = await updateLead(id, input)
  revalidateLeadPaths(lead.id)
  return lead
}

export async function updateLeadStageAction(id: string, stage: LeadStage) {
  const lead = await updateLeadStage(id, stage)
  revalidateLeadPaths(lead.id)
  return lead
}

export async function deleteLeadAction(id: string) {
  await deleteLead(id)
  revalidateLeadPaths(id)
}

'use server'

import { revalidatePath } from 'next/cache'
import {
  createLead,
  deleteLead,
  updateLead,
  updateLeadStage,
  type LeadInput,
  type LeadUpdateInput,
} from '@/lib/leads'
import type { LeadStage } from '@/lib/types'

const LEADS_PATH = '/dashboard/leads'

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

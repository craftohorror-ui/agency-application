'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createProposal, updateProposal, deleteProposal, convertProposalToContract, convertProposalToProject } from '@/lib/proposals'
import type { ProposalStatus } from '@/lib/types'

export type ProposalFormState = {
  errors?: {
    title?: string
    client_or_lead?: string
    items?: string
    server?: string
  }
}

export async function createProposalAction(prevState: ProposalFormState, formData: FormData): Promise<ProposalFormState> {
  const title = formData.get('title') as string
  const client_id = formData.get('client_id') as string
  const lead_id = formData.get('lead_id') as string
  const scope = formData.get('scope') as string
  const deliverables = formData.get('deliverables') as string
  const timeline = formData.get('timeline') as string
  const terms = formData.get('terms') as string
  const status = formData.get('status') as ProposalStatus
  const itemsJson = formData.get('items') as string

  const errors: ProposalFormState['errors'] = {}

  if (!title?.trim()) errors.title = 'Title is required'
  if (!client_id && !lead_id) errors.client_or_lead = 'You must select a Client or Lead'
  
  let parsedItems = []
  try {
    parsedItems = JSON.parse(itemsJson || '[]')
  } catch (e) {
    errors.items = 'Invalid items format'
  }

  if (Object.keys(errors).length > 0) return { errors }

  try {
    const proposal = await createProposal({
      title,
      client_id: client_id || null,
      lead_id: lead_id || null,
      scope,
      deliverables,
      timeline,
      terms,
      status
    }, parsedItems)

    revalidatePath('/dashboard/proposals')
    redirect(`/dashboard/proposals/${proposal?.id}`)
  } catch (err: unknown) {
    return { errors: { server: err instanceof Error ? err.message : String(err) } }
  }
}

export async function updateProposalAction(id: string, prevState: ProposalFormState, formData: FormData): Promise<ProposalFormState> {
  const title = formData.get('title') as string
  const client_id = formData.get('client_id') as string
  const lead_id = formData.get('lead_id') as string
  const scope = formData.get('scope') as string
  const deliverables = formData.get('deliverables') as string
  const timeline = formData.get('timeline') as string
  const terms = formData.get('terms') as string
  const status = formData.get('status') as ProposalStatus
  const itemsJson = formData.get('items') as string

  const errors: ProposalFormState['errors'] = {}

  if (!title?.trim()) errors.title = 'Title is required'
  if (!client_id && !lead_id) errors.client_or_lead = 'You must select a Client or Lead'
  
  let parsedItems = []
  try {
    parsedItems = JSON.parse(itemsJson || '[]')
  } catch (e) {
    errors.items = 'Invalid items format'
  }

  if (Object.keys(errors).length > 0) return { errors }

  try {
    await updateProposal(id, {
      title,
      client_id: client_id || null,
      lead_id: lead_id || null,
      scope,
      deliverables,
      timeline,
      terms,
      status
    }, parsedItems)

    revalidatePath('/dashboard/proposals')
    redirect(`/dashboard/proposals/${id}`)
  } catch (err: unknown) {
    return { errors: { server: err instanceof Error ? err.message : String(err) } }
  }
}

export async function deleteProposalAction(id: string) {
  await deleteProposal(id)
  revalidatePath('/dashboard/proposals')
  redirect('/dashboard/proposals')
}

export async function convertProposalToContractAction(id: string) {
  const contract = await convertProposalToContract(id)
  revalidatePath('/dashboard/proposals')
  revalidatePath('/dashboard/contracts')
  redirect(`/dashboard/contracts/${contract.id}`)
}

export async function convertProposalToProjectAction(id: string) {
  const project = await convertProposalToProject(id)
  revalidatePath('/dashboard/proposals')
  revalidatePath('/dashboard/projects')
  redirect(`/dashboard/projects/${project.id}`)
}

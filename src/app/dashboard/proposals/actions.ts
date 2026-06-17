'use server'

import { redirect, unstable_rethrow } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createProposal, updateProposal, deleteProposal, convertProposalToContract, convertProposalToProject, duplicateProposal, convertProposalToInvoice, checkExistingInvoiceForProposal } from '@/lib/proposals'
import { generatePublicLink, revokePublicLink } from '@/lib/proposals-analytics'
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

  let proposalId: string
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
    if (!proposal) throw new Error('Failed to create proposal')
    proposalId = proposal.id

    revalidatePath('/dashboard/proposals')
  } catch (err: unknown) {
    unstable_rethrow(err)
    return { errors: { server: err instanceof Error ? err.message : 'Unable to create proposal.' } }
  }

  redirect(`/dashboard/proposals/${proposalId}?success=Proposal+created+successfully`)
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
  } catch (err: unknown) {
    unstable_rethrow(err)
    return { errors: { server: err instanceof Error ? err.message : 'Unable to update proposal.' } }
  }

  redirect(`/dashboard/proposals/${id}?success=Proposal+updated+successfully`)
}

export async function deleteProposalAction(id: string) {
  await deleteProposal(id)
  revalidatePath('/dashboard/proposals')
  redirect('/dashboard/proposals?success=Proposal+deleted+successfully')
}

export async function convertProposalToContractAction(id: string) {
  const contract = await convertProposalToContract(id)
  revalidatePath('/dashboard/proposals')
  revalidatePath('/dashboard/contracts')
  redirect(`/dashboard/contracts/${contract.id}?success=Proposal+converted+to+contract`)
}

export async function convertProposalToProjectAction(id: string) {
  const project = await convertProposalToProject(id)
  revalidatePath('/dashboard/proposals')
  revalidatePath('/dashboard/projects')
  redirect(`/dashboard/projects/${project.id}?success=Contract+converted+to+project`)
}

export async function duplicateProposalAction(id: string) {
  const newProposal = await duplicateProposal(id)
  if (!newProposal) {
    throw new Error('Failed to duplicate proposal')
  }
  revalidatePath('/dashboard/proposals')
  redirect(`/dashboard/proposals/${newProposal.id}?success=Proposal+duplicated+successfully`)
}

export async function generatePublicLinkAction(proposalId: string, name?: string, expiresInDays: number = 30) {
  const link = await generatePublicLink(proposalId, name, expiresInDays)
  revalidatePath(`/dashboard/proposals/${proposalId}`)
  return link
}

export async function updateProposalTemplateAction(proposalId: string, templateId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateProposal(proposalId, { template_id: templateId } as any)
  revalidatePath(`/dashboard/proposals/${proposalId}`)
}

export async function revokePublicLinkAction(linkId: string, proposalId: string) {
  await revokePublicLink(linkId)
  revalidatePath(`/dashboard/proposals/${proposalId}`)
}

export async function checkExistingInvoiceAction(proposalId: string, clientId: string) {
  return await checkExistingInvoiceForProposal(proposalId, clientId)
}

export async function convertProposalToInvoiceAction(id: string) {
  const invoice = await convertProposalToInvoice(id)
  revalidatePath('/dashboard/proposals')
  revalidatePath('/dashboard/invoices')
  redirect(`/dashboard/invoices/${invoice.id}?success=Proposal+converted+to+invoice`)
}


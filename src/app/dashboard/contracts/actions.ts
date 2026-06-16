'use server'

import { revalidatePath } from 'next/cache'
import { updateContract } from '@/lib/contracts'
import type { ContractStatus } from '@/lib/types'

export async function updateContractStatusAction(id: string, status: ContractStatus) {
  await updateContract(id, { status })
  revalidatePath(`/dashboard/contracts/${id}`)
  revalidatePath('/dashboard/contracts')
}

export async function updateContractBodyAction(id: string, formData: FormData) {
  const body = formData.get('body') as string
  if (!body) return
  
  await updateContract(id, { body })
  revalidatePath(`/dashboard/contracts/${id}`)
}

export async function updateContractTemplateAction(id: string, templateId: string) {
  await updateContract(id, { template_id: templateId })
  revalidatePath(`/dashboard/contracts/${id}`)
}

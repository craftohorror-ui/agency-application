'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signPortalContract } from '@/lib/contracts'

export async function signContractAction(id: string, formData: FormData) {
  const signatureName = formData.get('signature_name') as string
  if (!signatureName?.trim()) {
    throw new Error('Signature name is required')
  }

  // Get real IP or fallback
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1'

  await signPortalContract(id, signatureName.trim(), ipAddress)

  revalidatePath(`/portal/contracts/${id}`)
  revalidatePath('/portal/contracts')
  redirect(`/portal/contracts/${id}`)
}

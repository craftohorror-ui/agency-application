'use server'

import { requireClient } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function downloadPortalFileAction(path: string) {
  const { supabase } = await requireClient()
  const { data, error } = await supabase.storage.from('files').createSignedUrl(path, 60 * 60) // 1 hour expiry
  
  if (error || !data) {
    throw new Error('Failed to generate secure download link')
  }

  redirect(data.signedUrl)
}

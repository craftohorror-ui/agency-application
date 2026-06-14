'use server'

import { requireClient } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function downloadPortalFileAction(id: string) {
  const { supabase } = await requireClient()
  
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (fetchError || !file) {
    throw new Error('File not found or access denied')
  }

  const { data, error } = await supabase.storage.from('files').createSignedUrl(file.storage_path, 300)
  
  if (error || !data) {
    throw new Error('Failed to generate secure download link')
  }

  redirect(data.signedUrl)
}

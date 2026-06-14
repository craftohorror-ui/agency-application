'use server'

import { revalidatePath } from 'next/cache'
import { uploadFileServer, deleteFile, getFileDownloadUrl } from '@/lib/files'
import { unstable_rethrow } from 'next/navigation'

export async function uploadFileAction(formData: FormData) {
  console.log('[uploadFileAction] Triggered via Server Action')
  try {
    await uploadFileServer(formData)
    console.log('[uploadFileAction] Upload successful, triggering revalidations')
    revalidatePath('/dashboard/files')
    revalidatePath('/dashboard/projects')
    revalidatePath('/dashboard/leads')
    revalidatePath('/dashboard/clients')
    return { success: true, message: 'File uploaded successfully.' }
  } catch (error: unknown) {
    console.error('[uploadFileAction] Caught error:', error)
    unstable_rethrow(error)
    if (error instanceof Error) return { error: error.message }
    return { error: 'Unknown error' }
  }
}

export async function deleteFileAction(id: string) {
  try {
    await deleteFile(id)
    revalidatePath('/dashboard/files')
    revalidatePath('/dashboard/projects')
    revalidatePath('/dashboard/leads')
    revalidatePath('/dashboard/clients')
    return { success: true }
  } catch (error: unknown) {
    unstable_rethrow(error)
    if (error instanceof Error) return { error: error.message }
    return { error: 'Unknown error' }
  }
}

export async function getDownloadUrlAction(storagePath: string) {
  try {
    const url = await getFileDownloadUrl(storagePath)
    return { url }
  } catch (error: unknown) {
    unstable_rethrow(error)
    if (error instanceof Error) return { error: error.message }
    return { error: 'Unknown error' }
  }
}

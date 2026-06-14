'use server'

import { revalidatePath } from 'next/cache'
import { uploadFileServer, deleteFile, getFileDownloadUrl } from '@/lib/files'
import { unstable_rethrow } from 'next/navigation'

export async function uploadFileAction(formData: FormData) {
  console.log('================= UPLOAD ACTION START =================')
  console.log('[uploadFileAction] Triggered via Server Action')
  try {
    const file = formData.get('file') as File | null;
    console.log('[uploadFileAction] Frontend FormData received.')
    console.log(`[uploadFileAction] File presence: ${!!file}, name: ${file?.name}, size: ${file?.size}`)
    
    console.log('[uploadFileAction] Calling uploadFileServer...')
    const result = await uploadFileServer(formData)
    console.log('[uploadFileAction] uploadFileServer completed successfully! Return type:', typeof result)
    console.log('[uploadFileAction] JSON.stringify(result):', JSON.stringify(result))
    
    console.log('[uploadFileAction] Triggering revalidations...')
    revalidatePath('/dashboard/files')
    revalidatePath('/dashboard/projects')
    revalidatePath('/dashboard/leads')
    revalidatePath('/dashboard/clients')
    console.log('[uploadFileAction] Revalidations done. Returning success object.')
    return { success: true, message: 'Upload successful' }
  } catch (error: unknown) {
    console.error('================= UPLOAD ACTION CRASHED =================')
    console.error('[uploadFileAction] Caught error in outer action block:', error)
    if (error instanceof Error) {
      console.error('[uploadFileAction] Error Message:', error.message)
      console.error('[uploadFileAction] Stack Trace:', error.stack)
      return { success: false, error: error.message }
    }
    return { success: false, error: String(error) }
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

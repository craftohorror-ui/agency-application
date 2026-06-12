'use server'

import { revalidatePath } from 'next/cache'
import { uploadFileServer, deleteFile, getFileDownloadUrl } from '@/lib/files'

export async function uploadFileAction(formData: FormData) {
  try {
    await uploadFileServer(formData)
    revalidatePath('/dashboard/files')
    revalidatePath('/dashboard/projects')
    revalidatePath('/dashboard/leads')
    revalidatePath('/dashboard/clients')
    return { success: true }
  } catch (error: unknown) {
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
    if (error instanceof Error) return { error: error.message }
    return { error: 'Unknown error' }
  }
}

export async function getDownloadUrlAction(storagePath: string) {
  try {
    const url = await getFileDownloadUrl(storagePath)
    return { url }
  } catch (error: unknown) {
    if (error instanceof Error) return { error: error.message }
    return { error: 'Unknown error' }
  }
}

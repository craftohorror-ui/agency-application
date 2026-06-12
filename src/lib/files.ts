import 'server-only'

import { requireStaff } from '@/lib/auth'
import type { FileRecord, FileFolder } from '@/lib/types'

export interface FileInput {
  name: string
  folder?: FileFolder
  storage_path: string
  mime_type?: string
  size_bytes?: number
  project_id?: string
  client_id?: string
  lead_id?: string
}

export interface FileListFilters {
  folder?: FileFolder
  projectId?: string
  clientId?: string
  leadId?: string
  limit?: number
}

export async function listFiles(filters: FileListFilters = {}) {
  const { supabase } = await requireStaff()

  let query = supabase
    .from('files')
    .select('*, uploader:profiles!uploaded_by(full_name)')
    .order('created_at', { ascending: false })

  if (filters.folder) query = query.eq('folder', filters.folder)
  if (filters.projectId) query = query.eq('project_id', filters.projectId)
  if (filters.clientId) query = query.eq('client_id', filters.clientId)
  if (filters.leadId) query = query.eq('lead_id', filters.leadId)
  if (typeof filters.limit === 'number') query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function deleteFile(id: string) {
  const { supabase } = await requireStaff()
  
  // Get file record to know storage_path
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)
  if (!file) throw new Error('File not found')

  // Remove from storage
  const { error: storageError } = await supabase.storage.from('files').remove([file.storage_path])
  if (storageError) throw new Error(storageError.message)

  // Remove DB record
  const { error: dbError } = await supabase.from('files').delete().eq('id', id)
  if (dbError) throw new Error(dbError.message)
}

export async function getFileDownloadUrl(storagePath: string) {
  const { supabase } = await requireStaff()
  // Generate a short-lived signed URL for download
  const { data, error } = await supabase.storage.from('files').createSignedUrl(storagePath, 60 * 60, {
    download: true
  })
  if (error) throw new Error(error.message)
  return data.signedUrl
}

export async function uploadFileServer(formData: FormData) {
  const { supabase, user } = await requireStaff()
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const folder = (formData.get('folder') as FileFolder) || 'assets'
  const projectId = formData.get('projectId') as string | null
  const clientId = formData.get('clientId') as string | null
  const leadId = formData.get('leadId') as string | null

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
  const storagePath = `${folder}/${fileName}`

  const { error: storageError } = await supabase.storage
    .from('files')
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false
    })

  if (storageError) throw new Error(storageError.message)

  const { data, error: dbError } = await supabase
    .from('files')
    .insert({
      name: file.name,
      folder,
      storage_path: storagePath,
      mime_type: file.type,
      size_bytes: file.size,
      project_id: projectId || null,
      client_id: clientId || null,
      lead_id: leadId || null,
      uploaded_by: user.id
    })
    .select()
    .single()

  if (dbError) {
    await supabase.storage.from('files').remove([storagePath])
    throw new Error(dbError.message)
  }

  return data as FileRecord
}

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
  console.log('[uploadFileServer] Started file upload process')
  const { supabase, user } = await requireStaff()
  console.log(`[uploadFileServer] Authenticated as user: ${user.id}`)

  const file = formData.get('file') as File
  if (!file) {
    console.error('[uploadFileServer] Error: No file provided')
    throw new Error('No file provided')
  }

  console.log(`[uploadFileServer] Received file: ${file.name}, size: ${file.size}, type: ${file.type}`)

  // 1. File Size Validation (Max 50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024
  if (file.size > MAX_FILE_SIZE) {
    console.error(`[uploadFileServer] Error: File size ${file.size} exceeds 50MB limit`)
    throw new Error('File size exceeds the 50 MB upload limit.')
  }

  // 2. Allowed Extensions Validation
  const allowedExtensions = ['pdf', 'doc', 'docx', 'xlsx', 'csv', 'png', 'jpg', 'jpeg', 'zip']
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !allowedExtensions.includes(ext)) {
    console.error(`[uploadFileServer] Error: Unsupported file extension .${ext}`)
    throw new Error('Unsupported file type. Please upload a valid document or image.')
  }

  const folder = (formData.get('folder') as FileFolder) || 'assets'
  const projectId = formData.get('projectId') as string | null
  const clientId = formData.get('clientId') as string | null
  const leadId = formData.get('leadId') as string | null

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
  const storagePath = `${folder}/${fileName}`
  
  console.log(`[uploadFileServer] Generated storage path: ${storagePath}`)

  // 3. Convert ArrayBuffer to Node Buffer to prevent undici/fetch hanging
  console.log('[uploadFileServer] Converting File to ArrayBuffer...')
  const arrayBuffer = await file.arrayBuffer()
  console.log('[uploadFileServer] Converting ArrayBuffer to Node Buffer...')
  const buffer = Buffer.from(arrayBuffer)
  
  console.log('[uploadFileServer] Uploading buffer to Supabase Storage bucket: "files"...')
  const { error: storageError } = await supabase.storage
    .from('files')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false
    })

  if (storageError) {
    console.error('[uploadFileServer] Supabase Storage upload failed:', storageError.message)
    throw new Error(`Upload failed: ${storageError.message}`)
  }
  console.log('[uploadFileServer] Supabase Storage upload successful.')

  console.log('[uploadFileServer] Inserting database record into "files" table...')
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
      // agency_id is omitted here because it defaults to public.current_agency_id() at the database level!
    })
    .select()
    .single()

  if (dbError) {
    console.error('[uploadFileServer] Database insert failed:', dbError.message)
    console.log('[uploadFileServer] Rolling back storage upload...')
    await supabase.storage.from('files').remove([storagePath])
    throw new Error(`Database insert failed: ${dbError.message}`)
  }

  console.log(`[uploadFileServer] Database record created successfully with ID: ${data.id}`)
  return data as FileRecord
}

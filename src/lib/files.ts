import 'server-only'

import { requireStaff } from '@/lib/auth'
import type { FileRecord, FileFolder } from '@/lib/types'

export interface FileListFilters {
  folder?: string
  projectId?: string
  clientId?: string
  leadId?: string
  limit?: number
  page?: number
  query?: string
  sortBy?: string
}

export async function getFileCounts() {
  const { supabase } = await requireStaff()
  
  const folders = ['assets', 'contracts', 'invoices', 'deliverables', 'client_files'] as const
  const counts: Record<string, number> = { all: 0 }
  
  const promises = folders.map(async (folder) => {
    const { count, error } = await supabase.from('files').select('*', { count: 'exact', head: true }).eq('folder', folder)
    if (!error && count !== null) {
      counts[folder] = count
      counts.all += count
    } else {
      counts[folder] = 0
    }
  })
  
  await Promise.all(promises)
  return counts
}

export async function listFiles(filters: FileListFilters = {}) {
  const { supabase } = await requireStaff()

  let query = supabase
    .from('files')
    .select('*, uploader:profiles!uploaded_by(full_name)', { count: 'exact' })

  if (filters.folder && filters.folder !== 'all') {
    query = query.eq('folder', filters.folder)
  }
  if (filters.projectId) query = query.eq('project_id', filters.projectId)
  if (filters.clientId) query = query.eq('client_id', filters.clientId)
  if (filters.leadId) query = query.eq('lead_id', filters.leadId)
  
  if (filters.query) {
    query = query.or(`display_name.ilike.%${filters.query}%,name.ilike.%${filters.query}%`)
  }

  switch (filters.sortBy) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'name-asc':
      query = query.order('display_name', { ascending: true })
      break
    case 'name-desc':
      query = query.order('display_name', { ascending: false })
      break
    case 'size-desc':
      query = query.order('size_bytes', { ascending: false })
      break
    case 'size-asc':
      query = query.order('size_bytes', { ascending: true })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const limit = filters.limit || 25
  const page = filters.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) throw new Error(error.message)
  return { data: data as unknown as (FileRecord & { uploader: { full_name: string } | null })[], count }
}

export async function deleteFile(id: string) {
  const { supabase } = await requireStaff()
  
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)
  if (!file) throw new Error('File not found')

  const { error: storageError } = await supabase.storage.from('files').remove([file.storage_path])
  if (storageError) throw new Error(storageError.message)

  const { error: dbError } = await supabase.from('files').delete().eq('id', id)
  if (dbError) throw new Error(dbError.message)
}

export async function getFileDownloadUrl(storagePath: string) {
  const { supabase } = await requireStaff()
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

  const displayNameRaw = formData.get('display_name') as string
  const displayName = displayNameRaw?.trim() || file.name
  if (displayName.length > 100) {
    throw new Error('Document Name must be 100 characters or less.')
  }

  console.log(`[uploadFileServer] Received file: ${file.name}, display_name: ${displayName}, size: ${file.size}, type: ${file.type}`)

  const MAX_FILE_SIZE = 50 * 1024 * 1024
  if (file.size > MAX_FILE_SIZE) {
    console.error(`[uploadFileServer] Error: File size ${file.size} exceeds 50MB limit`)
    throw new Error('File size exceeds the 50 MB upload limit.')
  }

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
      display_name: displayName,
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
    console.error('[uploadFileServer] Database insert failed:', dbError.message)
    console.log('[uploadFileServer] Rolling back storage upload...')
    await supabase.storage.from('files').remove([storagePath])
    throw new Error(`Database insert failed: ${dbError.message}`)
  }

  console.log(`[uploadFileServer] Database record created successfully with ID: ${data.id}`)
  return data as FileRecord
}

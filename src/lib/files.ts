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
  
  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single()
  const agencyId = profile?.agency_id || 'NOT_FOUND'

  const file = formData.get('file') as File
  const displayNameRaw = formData.get('display_name') as string
  const folder = (formData.get('folder') as FileFolder) || 'assets'
  const displayName = displayNameRaw?.trim() || file?.name || 'UNKNOWN'

  let debugLog = `[UPLOAD_DEBUG] UserID: ${user.id} | AgencyID: ${agencyId} | File: ${file?.name} | Size: ${file?.size} | Type: ${file?.type} | DisplayName: ${displayName} | Folder: ${folder}`

  try {
    if (!file) throw new Error('No file provided')
    if (displayName.length > 100) throw new Error('Document Name must be 100 characters or less.')
    const MAX_FILE_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) throw new Error('File size exceeds the 50 MB upload limit.')

    const allowedExtensions = ['pdf', 'doc', 'docx', 'xlsx', 'csv', 'png', 'jpg', 'jpeg', 'zip']
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !allowedExtensions.includes(ext)) {
      throw new Error('Unsupported file type.')
    }

    const projectId = formData.get('projectId') as string | null
    const clientId = formData.get('clientId') as string | null
    const leadId = formData.get('leadId') as string | null

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const storagePath = `${folder}/${fileName}`
    debugLog += ` | StoragePath: ${storagePath}`

    const { error: storageError } = await supabase.storage
      .from('files')
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (storageError) {
      debugLog += ` | Storage reached: YES | Storage Error: ${JSON.stringify(storageError)}`
      throw new Error(debugLog)
    }
    debugLog += ` | Storage reached: YES | Storage SUCCESS`

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
      debugLog += ` | DB insert executed: YES | DB Error: ${JSON.stringify(dbError)}`
      await supabase.storage.from('files').remove([storagePath])
      throw new Error(debugLog)
    }
    debugLog += ` | DB insert executed: YES | DB SUCCESS`

    return data as FileRecord
  } catch (err: unknown) {
    const error = err as Error
    if (error.message && error.message.includes('[UPLOAD_DEBUG]')) throw error
    throw new Error(`${debugLog} | Server Action Caught Exception: ${error.message || String(error)}`)
  }
}

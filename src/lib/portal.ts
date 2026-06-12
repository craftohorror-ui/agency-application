import 'server-only'
import { requireClient } from '@/lib/auth'
import type { Project, ProjectStage, Deliverable, FileRecord } from '@/lib/types'

export interface PortalProject extends Project {
  milestones?: { id: string; title: string; is_completed: boolean; amount: number; due_date: string | null }[]
  tasks?: { id: string; title: string; status: string; due_date: string | null }[]
  deliverables?: Deliverable[]
  files?: FileRecord[]
}

export async function getPortalDashboardMetrics() {
  const { supabase } = await requireClient()

  // Because of RLS, these queries automatically scope to my_client_id()
  const [
    { count: activeProjects },
    { count: completedProjects },
    { data: deliverables },
    { data: recentFiles },
    { data: recentConversations },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).neq('stage', 'completed'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('stage', 'completed'),
    supabase.from('deliverables').select('*, project:projects(name)').eq('status', 'pending').limit(5),
    supabase.from('files').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('conversations').select('id, title, updated_at:created_at').order('created_at', { ascending: false }).limit(5)
  ])

  // Get recent messages from those conversations
  let recentMessages: { id: string; body: string; created_at: string; sender: { full_name: string; avatar_url: string | null; role: string } | null }[] = []
  if (recentConversations && recentConversations.length > 0) {
    const { data: msgs } = await supabase
      .from('messages')
      .select('*, sender:profiles(full_name, avatar_url, role)')
      .in('conversation_id', recentConversations.map(c => c.id))
      .order('created_at', { ascending: false })
      .limit(5)
    recentMessages = msgs ?? []
  }

  return {
    activeProjects: activeProjects ?? 0,
    completedProjects: completedProjects ?? 0,
    pendingDeliverables: deliverables ?? [],
    recentFiles: recentFiles ?? [],
    recentMessages
  }
}

export async function listPortalProjects(search?: string, stage?: ProjectStage) {
  const { supabase } = await requireClient()

  let query = supabase
    .from('projects')
    .select('*, client:clients(id, name, company)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search?.trim()) {
    const pattern = `%${search.replace(/[%_,()\\]/g, '\\$&').trim()}%`
    query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`)
  }
  if (stage) {
    query = query.eq('stage', stage)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return { projects: data ?? [], count }
}

export async function getPortalProject(id: string): Promise<PortalProject | null> {
  const { supabase } = await requireClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      milestones(*),
      tasks(*),
      deliverables(*),
      files(*)
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function listPortalFiles(search?: string) {
  const { supabase } = await requireClient()

  let query = supabase.from('files').select('*').order('created_at', { ascending: false })

  if (search?.trim()) {
    const pattern = `%${search.replace(/[%_,()\\]/g, '\\$&').trim()}%`
    query = query.ilike('name', pattern)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as FileRecord[]
}

export async function listPortalConversations() {
  const { supabase } = await requireClient()
  const { data, error } = await supabase
    .from('conversations')
    .select('*, participants:conversation_participants(profile:profiles(id, full_name, avatar_url, role))')
    .order('created_at', { ascending: false })
    
  if (error) throw new Error(error.message)
  return data
}

export async function getOrCreateGeneralSupportConversation() {
  const { supabase, profile } = await requireClient()
  
  // Find my client ID
  const { data: client } = await supabase.from('clients').select('id').eq('portal_user_id', profile.id).single()
  if (!client) throw new Error('Client record not found')

  // Find general support conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('client_id', client.id)
    .eq('type', 'client')
    .eq('title', 'General Support')
    .maybeSingle()

  if (existing) return existing

  // Create it
  const { data: owner } = await supabase.from('profiles').select('id').eq('role', 'owner').limit(1).single()
  if (!owner) throw new Error('No agency owner found')

  const { data: newConv, error } = await supabase
    .from('conversations')
    .insert({
      title: 'General Support',
      type: 'client',
      client_id: client.id
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  // Add participants
  await supabase.from('conversation_participants').insert([
    { conversation_id: newConv.id, profile_id: profile.id },
    { conversation_id: newConv.id, profile_id: owner.id }
  ])

  return newConv
}

export async function getConversationMessages(conversationId: string) {
  const { supabase } = await requireClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles(id, full_name, avatar_url, role)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function getSignedFileUrl(filePath: string) {
  const { supabase } = await requireClient()
  const { data, error } = await supabase.storage.from('files').createSignedUrl(filePath, 3600) // 1 hour
  if (error) throw new Error(error.message)
  return data.signedUrl
}

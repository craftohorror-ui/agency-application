import 'server-only'

import { requireStaff } from '@/lib/auth'
import type { Project, ProjectStage, Client } from '@/lib/types'

export const PROJECT_STAGES = [
  'planning',
  'in_progress',
  'review',
  'client_approval',
  'completed',
] as const satisfies readonly ProjectStage[]

export interface ProjectWithClient extends Project {
  client: Pick<Client, 'id' | 'name' | 'company'> | null
}

export interface ProjectInput {
  name: string
  client_id?: string | null
  description?: string | null
  stage?: ProjectStage
  budget?: number | null
  deadline?: string | null
  notes?: string | null
}

export type ProjectUpdateInput = Partial<ProjectInput>

export interface ProjectListFilters {
  search?: string
  stage?: ProjectStage | ProjectStage[]
  clientId?: string
  limit?: number
  offset?: number
}

export interface ProjectListResult {
  projects: ProjectWithClient[]
  count: number | null
}

function normalizeNullableText(value: string | null | undefined) {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeSearch(value: string) {
  return value.replace(/[%_,()\\]/g, '\\$&').trim()
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { supabase, user } = await requireStaff()
  
  const name = input.name.trim()
  if (!name) throw new Error('Project name is required')

  const payload = {
    name,
    client_id: input.client_id ?? null,
    description: normalizeNullableText(input.description),
    stage: input.stage ?? 'planning',
    budget: input.budget ?? null,
    deadline: normalizeNullableText(input.deadline),
    notes: normalizeNullableText(input.notes),
    created_by: user.id,
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as Project
}

export async function updateProject(id: string, input: ProjectUpdateInput): Promise<Project> {
  const { supabase, profile } = await requireStaff()
  const payload: Record<string, unknown> = {}

  // H-1 FIX: Owners can update any project; Members can only update projects they belong to.
  if (profile.role === 'member') {
    const { data: membership } = await supabase
      .from('project_members')
      .select('profile_id')
      .eq('project_id', id)
      .eq('profile_id', profile.id)
      .maybeSingle()
    if (!membership) throw new Error('Access denied: you are not a member of this project')
  }

  if (input.name !== undefined) {
    const name = input.name.trim()
    if (!name) throw new Error('Project name is required')
    payload.name = name
  }
  if (input.client_id !== undefined) payload.client_id = input.client_id
  if (input.description !== undefined) payload.description = normalizeNullableText(input.description)
  if (input.stage !== undefined) payload.stage = input.stage
  if (input.budget !== undefined) payload.budget = input.budget
  if (input.deadline !== undefined) payload.deadline = normalizeNullableText(input.deadline)
  if (input.notes !== undefined) payload.notes = normalizeNullableText(input.notes)

  if (Object.keys(payload).length === 0) {
    throw new Error('No project fields provided')
  }

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as Project
}

export async function listProjects(filters: ProjectListFilters = {}): Promise<ProjectListResult> {
  const { supabase, profile } = await requireStaff()

  // H-1 FIX: Members only see projects they are assigned to.
  // Owners see all agency projects (RLS on the projects table scopes to agency already).
  if (profile.role === 'member') {
    // Fetch only the project IDs this member is assigned to, then filter
    const { data: memberRows, error: memberErr } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('profile_id', profile.id)

    if (memberErr) throw new Error(memberErr.message)

    const assignedIds = (memberRows ?? []).map((r: { project_id: string }) => r.project_id)

    if (assignedIds.length === 0) {
      return { projects: [], count: 0 }
    }

    let query = supabase
      .from('projects')
      .select('*, client:clients(id, name, company)', { count: 'exact' })
      .in('id', assignedIds)
      .order('created_at', { ascending: false })

    if (filters.search?.trim()) {
      const pattern = `%${normalizeSearch(filters.search)}%`
      query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`)
    }

    if (filters.stage) {
      query = Array.isArray(filters.stage)
        ? query.in('stage', filters.stage)
        : query.eq('stage', filters.stage)
    }

    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }

    if (typeof filters.limit === 'number') {
      const offset = filters.offset ?? 0
      query = query.range(offset, offset + Math.max(0, filters.limit) - 1)
    }

    const { data, error, count } = await query
    if (error) throw new Error(error.message)

    return { projects: data ?? [], count }
  }

  // Owner path: all agency projects (scoped by RLS)
  let query = supabase
    .from('projects')
    .select('*, client:clients(id, name, company)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filters.search?.trim()) {
    const pattern = `%${normalizeSearch(filters.search)}%`
    query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`)
  }

  if (filters.stage) {
    query = Array.isArray(filters.stage)
      ? query.in('stage', filters.stage)
      : query.eq('stage', filters.stage)
  }

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId)
  }

  if (typeof filters.limit === 'number') {
    const offset = filters.offset ?? 0
    query = query.range(offset, offset + Math.max(0, filters.limit) - 1)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    projects: data ?? [],
    count,
  }
}

export async function getProject(id: string) {
  const { supabase, profile } = await requireStaff()

  // H-1 FIX: Members can only access projects they are assigned to.
  if (profile.role === 'member') {
    const { data: membership } = await supabase
      .from('project_members')
      .select('profile_id')
      .eq('project_id', id)
      .eq('profile_id', profile.id)
      .maybeSingle()

    if (!membership) {
      // Return null so the page shows a 404 — does not reveal the project exists
      return null
    }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*, client:clients(id, name, company, email, phone)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

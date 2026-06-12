import 'server-only'
import { requireStaff } from '@/lib/auth'
import type { Task, TaskStatus, TaskPriority, Profile } from '@/lib/types'

export const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'] as const satisfies readonly TaskStatus[]
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const satisfies readonly TaskPriority[]

export interface TaskWithAssignee extends Task {
  assignee: Pick<Profile, 'id' | 'full_name' | 'email' | 'avatar_url'> | null
}

export interface TaskInput {
  project_id: string
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  assignee_id?: string | null
  due_date?: string | null
  comments?: string | null
}

export type TaskUpdateInput = Partial<TaskInput>

export async function listProjectTasks(projectId: string): Promise<TaskWithAssignee[]> {
  const { supabase } = await requireStaff()

  const { data, error } = await supabase
    .from('tasks')
    .select('*, assignee:profiles(id, full_name, email, avatar_url)')
    .eq('project_id', projectId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as TaskWithAssignee[]
}

export async function createTask(input: TaskInput): Promise<TaskWithAssignee> {
  const { supabase } = await requireStaff()
  
  const title = input.title.trim()
  if (!title) throw new Error('Task title is required')

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: input.project_id,
      title,
      description: input.description || null,
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      assignee_id: input.assignee_id || null,
      due_date: input.due_date || null,
      comments: input.comments || null
    })
    .select('*, assignee:profiles(id, full_name, email, avatar_url)')
    .single()

  if (error) throw new Error(error.message)
  return data as TaskWithAssignee
}

export async function updateTask(id: string, input: TaskUpdateInput): Promise<TaskWithAssignee> {
  const { supabase } = await requireStaff()
  const payload: Record<string, unknown> = {}

  if (input.title !== undefined) {
    const title = input.title.trim()
    if (!title) throw new Error('Task title is required')
    payload.title = title
  }
  if (input.description !== undefined) payload.description = input.description
  if (input.status !== undefined) payload.status = input.status
  if (input.priority !== undefined) payload.priority = input.priority
  if (input.assignee_id !== undefined) payload.assignee_id = input.assignee_id
  if (input.due_date !== undefined) payload.due_date = input.due_date
  if (input.comments !== undefined) payload.comments = input.comments

  if (Object.keys(payload).length === 0) throw new Error('No fields to update')

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select('*, assignee:profiles(id, full_name, email, avatar_url)')
    .single()

  if (error) throw new Error(error.message)
  return data as TaskWithAssignee
}

export async function deleteTask(id: string) {
  const { supabase } = await requireStaff()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getDashboardTasksStats() {
  const { supabase } = await requireStaff()

  const { count: activeCount, error: activeErr } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'done')

  const today = new Date().toISOString().split('T')[0]
  const { count: overdueCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'done')
    .lt('due_date', today)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekStr = nextWeek.toISOString().split('T')[0]
  const { count: dueThisWeekCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'done')
    .gte('due_date', today)
    .lte('due_date', nextWeekStr)

  if (activeErr) throw new Error(activeErr.message)

  return {
    active: activeCount || 0,
    overdue: overdueCount || 0,
    dueThisWeek: dueThisWeekCount || 0
  }
}

'use server'

import { revalidatePath } from 'next/cache'
import { createTask, updateTask, deleteTask, type TaskInput, type TaskUpdateInput } from '@/lib/tasks'

export async function createProjectTaskAction(input: TaskInput) {
  try {
    const task = await createTask(input)
    revalidatePath(`/dashboard/projects/${input.project_id}`)
    return { success: true, task }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateProjectTaskAction(id: string, projectId: string, input: TaskUpdateInput) {
  try {
    const task = await updateTask(id, input)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, task }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteProjectTaskAction(id: string, projectId: string) {
  try {
    await deleteTask(id)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createProject,
  updateProject,
  type ProjectInput,
  type ProjectUpdateInput,
} from '@/lib/projects'
import type { ProjectStage } from '@/lib/types'

const PROJECTS_PATH = '/dashboard/projects'

type ProjectFormField =
  | 'name'
  | 'client_id'
  | 'description'
  | 'stage'
  | 'budget'
  | 'deadline'

export interface ProjectFormValues {
  name: string
  client_id: string
  description: string
  stage: ProjectStage | ''
  budget: string
  deadline: string
}

export interface ProjectFormState {
  errors: Partial<Record<ProjectFormField, string>>
  message?: string
  values: ProjectFormValues
}

function revalidateProjectPaths(projectId?: string) {
  revalidatePath(PROJECTS_PATH)
  if (projectId) {
    revalidatePath(`${PROJECTS_PATH}/${projectId}`)
  }
}

function getFormValue(formData: FormData, key: keyof ProjectFormValues) {
  return String(formData.get(key) ?? '').trim()
}

export async function createProjectFormAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const values: ProjectFormValues = {
    name: getFormValue(formData, 'name'),
    client_id: getFormValue(formData, 'client_id'),
    description: getFormValue(formData, 'description'),
    stage: getFormValue(formData, 'stage') as ProjectStage | '',
    budget: getFormValue(formData, 'budget'),
    deadline: getFormValue(formData, 'deadline'),
  }

  const errors: ProjectFormState['errors'] = {}

  if (!values.name) {
    errors.name = 'Project name is required.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values,
      message: 'Please correct the highlighted fields.',
    }
  }

  let project
  try {
    const input: ProjectInput = {
      name: values.name,
      client_id: values.client_id || null,
      description: values.description || null,
      stage: values.stage || 'planning',
      budget: values.budget ? parseFloat(values.budget) : null,
      deadline: values.deadline || null,
    }

    project = await createProject(input)
    revalidateProjectPaths()
  } catch (error) {
    return {
      errors: {},
      values,
      message: error instanceof Error ? error.message : 'Unable to create project.',
    }
  }

  redirect(`${PROJECTS_PATH}/${project.id}`)
}

export async function updateProjectFormAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const values: ProjectFormValues = {
    name: getFormValue(formData, 'name'),
    client_id: getFormValue(formData, 'client_id'),
    description: getFormValue(formData, 'description'),
    stage: getFormValue(formData, 'stage') as ProjectStage | '',
    budget: getFormValue(formData, 'budget'),
    deadline: getFormValue(formData, 'deadline'),
  }

  const errors: ProjectFormState['errors'] = {}

  if (!values.name) {
    errors.name = 'Project name is required.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values,
      message: 'Please correct the highlighted fields.',
    }
  }

  const projectId = String(formData.get('project_id') || '');
  if (!projectId) {
    return { errors: {}, values, message: 'Missing project ID' }
  }

  try {
    const input: ProjectUpdateInput = {
      name: values.name,
      client_id: values.client_id || null,
      description: values.description || null,
      stage: values.stage || 'planning',
      budget: values.budget ? parseFloat(values.budget) : null,
      deadline: values.deadline || null,
    }

    await updateProject(projectId, input)
    revalidateProjectPaths(projectId)
  } catch (error) {
    return {
      errors: {},
      values,
      message: error instanceof Error ? error.message : 'Unable to update project.',
    }
  }

  redirect(`${PROJECTS_PATH}/${projectId}`)
}

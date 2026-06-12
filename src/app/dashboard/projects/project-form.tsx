'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  createProjectFormAction,
  updateProjectFormAction,
  type ProjectFormState,
} from '@/app/dashboard/projects/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ProjectStage } from '@/lib/types'

type ClientOption = {
  id: string
  name: string
}

type ProjectFormProps = {
  clients: ClientOption[]
  stages: readonly ProjectStage[]
  project?: {
    id: string
    name: string
    client_id: string | null
    description: string | null
    stage: ProjectStage
    budget: number | null
    deadline: string | null
  }
}

function FieldError({
  state,
  field,
}: {
  state: ProjectFormState
  field: keyof ProjectFormState['errors']
}) {
  const message = state.errors[field]

  if (!message) return null

  return <p className='text-sm text-destructive'>{message}</p>
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' disabled={pending} className='w-full sm:w-auto'>
      {pending ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update project' : 'Create project')}
    </Button>
  )
}

function formatStage(stage: string) {
  return stage
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function ProjectForm({ clients, stages, project }: ProjectFormProps) {
  const isEdit = Boolean(project)

  const initialState: ProjectFormState = {
    errors: {},
    values: {
      name: project?.name || '',
      client_id: project?.client_id || '',
      description: project?.description || '',
      stage: project?.stage || 'planning',
      budget: project?.budget?.toString() || '',
      deadline: project?.deadline || '',
    },
  }

  const [state, formAction] = useActionState(
    isEdit ? updateProjectFormAction : createProjectFormAction,
    initialState
  )

  return (
    <form action={formAction} className='space-y-6'>
      {isEdit && <input type="hidden" name="project_id" value={project!.id} />}
      {state.message && <p className='text-sm text-destructive'>{state.message}</p>}

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-1 sm:col-span-2'>
          <Label htmlFor='name'>Project Name</Label>
          <Input id='name' name='name' required defaultValue={state.values.name} />
          <FieldError state={state} field='name' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='client_id'>Client</Label>
          <select
            id='client_id'
            name='client_id'
            defaultValue={state.values.client_id}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
          >
            <option value=''>No client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <FieldError state={state} field='client_id' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='stage'>Status / Stage</Label>
          <select
            id='stage'
            name='stage'
            defaultValue={state.values.stage}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
          >
            {stages.map((s) => (
              <option key={s} value={s}>
                {formatStage(s)}
              </option>
            ))}
          </select>
          <FieldError state={state} field='stage' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='budget'>Budget</Label>
          <Input id='budget' name='budget' type='number' step='0.01' defaultValue={state.values.budget} />
          <FieldError state={state} field='budget' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='deadline'>Due Date</Label>
          <Input id='deadline' name='deadline' type='date' defaultValue={state.values.deadline} />
          <FieldError state={state} field='deadline' />
        </div>

        <div className='space-y-1 sm:col-span-2'>
          <Label htmlFor='description'>Description</Label>
          <textarea
            id='description'
            name='description'
            rows={4}
            defaultValue={state.values.description}
            className='flex w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50'
          />
          <FieldError state={state} field='description' />
        </div>
      </div>

      <div className='flex justify-end'>
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  )
}

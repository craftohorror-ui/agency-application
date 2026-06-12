'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  createLeadFormAction,
  updateLeadFormAction,
  type LeadCreateFormState,
} from '@/app/dashboard/leads/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LeadOwnerOption } from '@/lib/leads'
import type { LeadStage } from '@/lib/types'

const initialLeadCreateFormState: LeadCreateFormState = {
  errors: {},
  values: {
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    notes: '',
    value_estimate: '',
    assigned_to: '',
    stage: 'new_lead',
  },
}

type LeadFormProps = {
  owners: LeadOwnerOption[]
  stageOptions: readonly LeadStage[]
  lead?: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    company?: string | null
    source?: string | null
    notes?: string | null
    owner_id?: string | null
    stage: LeadStage
  }
}

function FieldError({
  state,
  field,
}: {
  state: LeadCreateFormState
  field: keyof LeadCreateFormState['errors']
}) {
  const message = state.errors[field]

  if (!message) return null

  return <p className='text-sm text-destructive'>{message}</p>
}

function SubmitButton({ isEdit }: { isEdit?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' disabled={pending} className='w-full sm:w-auto'>
      {pending ? (isEdit ? 'Updating lead...' : 'Creating lead...') : (isEdit ? 'Update lead' : 'Create lead')}
    </Button>
  )
}

export function LeadForm({ owners, stageOptions, lead }: LeadFormProps) {
  const isEdit = !!lead
  const initialState: LeadCreateFormState = isEdit && lead
    ? {
        errors: {},
        values: {
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company: lead.company || '',
          source: lead.source || '',
          notes: lead.notes || '',
          value_estimate: '',
          assigned_to: lead.owner_id || '',
          stage: lead.stage || 'new_lead',
        },
      }
    : initialLeadCreateFormState

  const [state, formAction] = useActionState(
    isEdit ? updateLeadFormAction : createLeadFormAction,
    initialState
  )

  return (
    <form action={formAction} className='space-y-6'>
      {isEdit && lead && <input type="hidden" name="lead_id" value={lead.id} />}
      {state.message ? <p className='text-sm text-destructive'>{state.message}</p> : null}

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-1 sm:col-span-2'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' name='name' required defaultValue={state.values.name} />
          <FieldError state={state} field='name' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' type='email' defaultValue={state.values.email} />
          <FieldError state={state} field='email' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='phone'>Phone</Label>
          <Input id='phone' name='phone' type='tel' defaultValue={state.values.phone} />
          <FieldError state={state} field='phone' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='company'>Company</Label>
          <Input id='company' name='company' defaultValue={state.values.company} />
          <FieldError state={state} field='company' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='source'>Source</Label>
          <Input id='source' name='source' defaultValue={state.values.source} />
          <FieldError state={state} field='source' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='assigned_to'>Assigned To</Label>
          <select
            id='assigned_to'
            name='assigned_to'
            defaultValue={state.values.assigned_to}
            className='flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1'
          >
            <option value=''>Unassigned</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.full_name || owner.email}
              </option>
            ))}
          </select>
          <FieldError state={state} field='assigned_to' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='stage'>Stage</Label>
          <select
            id='stage'
            name='stage'
            defaultValue={state.values.stage}
            className='flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1'
          >
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage
                  .split('_')
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ')}
              </option>
            ))}
          </select>
          <FieldError state={state} field='stage' />
        </div>

        <div className='space-y-1 sm:col-span-2'>
          <Label htmlFor='value_estimate'>Value Estimate</Label>
          <Input
            id='value_estimate'
            name='value_estimate'
            inputMode='decimal'
            defaultValue={state.values.value_estimate}
          />
          <FieldError state={state} field='value_estimate' />
        </div>

        <div className='space-y-1 sm:col-span-2'>
          <Label htmlFor='notes'>Notes</Label>
          <textarea
            id='notes'
            name='notes'
            rows={5}
            defaultValue={state.values.notes}
            className='flex min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50'
          />
          <FieldError state={state} field='notes' />
        </div>
      </div>

      <div className='flex justify-end'>
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  )
}

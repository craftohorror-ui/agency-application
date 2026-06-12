'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  updateClientFormAction,
  type ClientFormState,
} from '@/app/dashboard/clients/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ClientFormProps = {
  client: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    company?: string | null
    industry?: string | null
    address?: string | null
    website?: string | null
    notes?: string | null
  }
}

function FieldError({
  state,
  field,
}: {
  state: ClientFormState
  field: keyof ClientFormState['errors']
}) {
  const message = state.errors[field]

  if (!message) return null

  return <p className='text-sm text-destructive'>{message}</p>
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' disabled={pending} className='w-full sm:w-auto'>
      {pending ? 'Updating client...' : 'Update client'}
    </Button>
  )
}

export function ClientForm({ client }: ClientFormProps) {
  const initialState: ClientFormState = {
    errors: {},
    values: {
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      industry: client.industry || '',
      address: client.address || '',
      website: client.website || '',
      notes: client.notes || '',
    },
  }

  const [state, formAction] = useActionState(updateClientFormAction, initialState)

  return (
    <form action={formAction} className='space-y-6'>
      <input type="hidden" name="client_id" value={client.id} />
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
          <Label htmlFor='industry'>Industry</Label>
          <Input id='industry' name='industry' defaultValue={state.values.industry} />
          <FieldError state={state} field='industry' />
        </div>

        <div className='space-y-1 sm:col-span-2'>
          <Label htmlFor='website'>Website</Label>
          <Input id='website' name='website' type='url' defaultValue={state.values.website} />
          <FieldError state={state} field='website' />
        </div>

        <div className='space-y-1 sm:col-span-2'>
          <Label htmlFor='address'>Address</Label>
          <textarea
            id='address'
            name='address'
            rows={2}
            defaultValue={state.values.address}
            className='flex w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50'
          />
          <FieldError state={state} field='address' />
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
        <SubmitButton />
      </div>
    </form>
  )
}

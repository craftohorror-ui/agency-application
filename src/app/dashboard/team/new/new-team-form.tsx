'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTeamMemberAction, type TeamFormState } from '../actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating Member...' : 'Create Member'}
    </Button>
  )
}

export function NewTeamForm() {
  const router = useRouter()
  const initialState: TeamFormState = { errors: {} }
  const [state, formAction] = useActionState(createTeamMemberAction, initialState)

  useEffect(() => {
    if (state.success && state.profileId) {
      toast.success('Team member created successfully')
      router.push(`/dashboard/team/${state.profileId}`)
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium">
          {state.message}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
        <Input id="full_name" name="full_name" required placeholder="Jane Doe" />
        {state.errors.full_name && <p className='text-sm text-destructive'>{state.errors.full_name}</p>}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
        {state.errors.email && <p className='text-sm text-destructive'>{state.errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Temporary Password</label>
        <Input id="password" name="password" required placeholder="Must be at least 6 characters" />
        {state.errors.password && <p className='text-sm text-destructive'>{state.errors.password}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">Role</label>
        <select
          id="role"
          name="role"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="member">Member</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  )
}

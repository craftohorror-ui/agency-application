import { requireOwner } from '@/lib/auth'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTeamMemberAction } from '../actions'
import Link from 'next/link'

export default async function NewTeamMemberPage() {
  await requireOwner()

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/team">
          <Button variant="outline">Back</Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Invite Member</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Details</CardTitle>
          <CardDescription>
            Create a new team member. They will be able to log in with the provided password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTeamMemberAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
              <Input id="full_name" name="full_name" required placeholder="Jane Doe" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Temporary Password</label>
              <Input id="password" name="password" required placeholder="Must be at least 6 characters" />
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
              <Button type="submit" className="w-full">Create Member</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

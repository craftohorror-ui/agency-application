import { requireOwner } from '@/lib/auth'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NewTeamForm } from './new-team-form'
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
          <NewTeamForm />
        </CardContent>
      </Card>
    </div>
  )
}

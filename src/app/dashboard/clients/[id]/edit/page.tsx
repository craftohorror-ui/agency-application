import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getClientQuery } from '@/app/dashboard/clients/queries'
import { ClientForm } from '@/app/dashboard/clients/client-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireStaff } from '@/lib/auth'
import { listTeam } from '@/lib/team'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditClientPage({ params }: PageProps) {
  const resolvedParams = await params
  const client = await getClientQuery(resolvedParams.id)

  if (!client) {
    notFound()
  }

  const { profile } = await requireStaff()
  const teamResult = profile.role === 'owner' ? await listTeam() : { members: [] }
  const teamMembers = teamResult.members

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Client</h1>
          <p className='text-sm text-muted-foreground'>
            Update details for {client.name}.
          </p>
        </div>
        <Link
          href={`/dashboard/clients/${client.id}`}
          className='inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted'
        >
          Back to client
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm 
            client={client} 
            teamMembers={teamMembers} 
            currentUserRole={profile.role} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

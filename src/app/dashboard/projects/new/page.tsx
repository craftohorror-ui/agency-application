import Link from 'next/link'
import { listClients } from '@/lib/clients'
import { PROJECT_STAGES } from '@/lib/projects'
import { ProjectForm } from '@/app/dashboard/projects/project-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewProjectPage() {
  const { clients } = await listClients({ limit: 1000 })

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>New Project</h1>
          <p className='text-sm text-muted-foreground'>
            Create a new project.
          </p>
        </div>
        <Link
          href='/dashboard/projects'
          className='inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted'
        >
          Cancel
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm clients={clients} stages={PROJECT_STAGES} />
        </CardContent>
      </Card>
    </div>
  )
}

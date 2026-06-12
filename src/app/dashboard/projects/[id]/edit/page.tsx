import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectQuery } from '@/app/dashboard/projects/queries'
import { listClients } from '@/lib/clients'
import { PROJECT_STAGES } from '@/lib/projects'
import { ProjectForm } from '@/app/dashboard/projects/project-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const resolvedParams = await params
  const [project, { clients }] = await Promise.all([
    getProjectQuery(resolvedParams.id),
    listClients({ limit: 1000 }),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Project</h1>
          <p className='text-sm text-muted-foreground'>
            Update details for {project.name}.
          </p>
        </div>
        <Link
          href={`/dashboard/projects/${project.id}`}
          className='inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted'
        >
          Back to project
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm
            project={project}
            clients={clients}
            stages={PROJECT_STAGES}
          />
        </CardContent>
      </Card>
    </div>
  )
}

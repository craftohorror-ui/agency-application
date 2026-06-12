import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { listPortalProjects } from '@/lib/portal'
import type { ProjectStage } from '@/lib/types'

type SearchParams = {
  search?: string | string[]
  stage?: string | string[]
}

type PortalProjectsPageProps = {
  searchParams?: Promise<SearchParams>
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function formatStage(stage: string) {
  return stage.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function getStageColor(stage: string) {
  switch (stage) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'client_approval':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default async function PortalProjectsPage({ searchParams }: PortalProjectsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const search = getSingleValue(resolvedSearchParams.search)?.trim() ?? ''
  const stage = getSingleValue(resolvedSearchParams.stage) as ProjectStage | undefined

  const { projects, count } = await listPortalProjects(search, stage)
  const hasFilters = Boolean(search || stage)

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Projects</h1>
          <p className='text-sm text-muted-foreground'>
            View your active and past projects.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline'>{count ?? projects.length} total</Badge>
        </div>
      </div>

      <Card>
        <CardHeader className='gap-3'>
          <CardTitle>Project Directory</CardTitle>
          <form className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]'>
            <Input
              type='search'
              name='search'
              defaultValue={search}
              placeholder='Search projects...'
              aria-label='Search projects'
            />
            <select
              name='stage'
              defaultValue={stage ?? ''}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-[180px]'
              aria-label='Filter by stage'
            >
              <option value=''>All Stages</option>
              <option value='planning'>Planning</option>
              <option value='in_progress'>In Progress</option>
              <option value='review'>Review</option>
              <option value='client_approval'>Client Approval</option>
              <option value='completed'>Completed</option>
            </select>
            <div className='flex gap-2'>
              <Button type='submit' className='flex-1 sm:flex-none'>
                Apply
              </Button>
              {hasFilters ? (
                <Link
                  href='/portal/projects'
                  className='inline-flex h-9 flex-1 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted sm:flex-none'
                >
                  Reset
                </Link>
              ) : null}
            </div>
          </form>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className='flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center'>
              <p className='text-base font-medium'>No projects found.</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                {hasFilters
                  ? 'Try adjusting your search or filters.'
                  : 'You have no projects yet.'}
              </p>
            </div>
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {projects.map((project) => (
                <Link key={project.id} href={`/portal/projects/${project.id}`} className="block h-full">
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className={getStageColor(project.stage)}>
                          {formatStage(project.stage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {project.description || 'No description provided.'}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deadline:</span>
                          <span className="font-medium">
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

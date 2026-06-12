import Link from 'next/link'
import { getProjectsQuery } from '@/app/dashboard/projects/queries'
import { PROJECT_STAGES } from '@/lib/projects'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { ProjectStage } from '@/lib/types'

type SearchParams = {
  search?: string | string[]
  stage?: string | string[]
}

type ProjectsPageProps = {
  searchParams?: Promise<SearchParams>
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function formatStage(stage: string) {
  return stage
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const search = getSingleValue(resolvedSearchParams.search)?.trim() ?? ''
  const stage = getSingleValue(resolvedSearchParams.stage) as ProjectStage | undefined

  const { projects, count } = await getProjectsQuery({
    search: search || undefined,
    stage: stage || undefined,
  })

  const hasFilters = Boolean(search || stage)

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Projects</h1>
          <p className='text-sm text-muted-foreground'>
            View and manage your projects.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline'>{count ?? projects.length} total</Badge>
          <Link href='/dashboard/projects/new'>
            <Button>New Project</Button>
          </Link>
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
              {PROJECT_STAGES.map((s) => (
                <option key={s} value={s}>
                  {formatStage(s)}
                </option>
              ))}
            </select>
            <div className='flex gap-2'>
              <Button type='submit' className='flex-1 sm:flex-none'>
                Apply
              </Button>
              {hasFilters ? (
                <Link
                  href='/dashboard/projects'
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
                  ? 'Try adjusting your filters.'
                  : 'Create a new project to get started.'}
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='grid gap-3 md:hidden'>
                {projects.map((project) => (
                  <div key={project.id} className='rounded-lg border p-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <Link href={`/dashboard/projects/${project.id}`} className='truncate font-medium hover:underline'>{project.name}</Link>
                        <p className='text-sm text-muted-foreground'>
                          {project.client?.name || 'No client'}
                        </p>
                      </div>
                      <Badge variant="muted">{formatStage(project.stage)}</Badge>
                    </div>
                    <dl className='mt-4 space-y-2 text-sm'>
                      <div className='flex justify-between gap-3'>
                        <dt className='text-muted-foreground'>Due Date</dt>
                        <dd className='truncate text-right'>{formatDate(project.deadline)}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              <div className='hidden overflow-x-auto md:block'>
                <table className='min-w-full text-sm'>
                  <thead className='border-b text-left text-muted-foreground'>
                    <tr>
                      <th className='py-3 pr-4 font-medium'>Project</th>
                      <th className='py-3 pr-4 font-medium'>Client</th>
                      <th className='py-3 pr-4 font-medium'>Status</th>
                      <th className='py-3 font-medium'>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className='border-b last:border-b-0 hover:bg-muted/50'>
                        <td className='py-4 pr-4'>
                          <Link href={`/dashboard/projects/${project.id}`} className='font-medium hover:underline'>
                            {project.name}
                          </Link>
                        </td>
                        <td className='py-4 pr-4 text-muted-foreground'>
                          {project.client?.name ? (
                            <Link href={`/dashboard/clients/${project.client.id}`} className="hover:underline">
                              {project.client.name}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className='py-4 pr-4 text-muted-foreground'>
                          <Badge variant="muted">{formatStage(project.stage)}</Badge>
                        </td>
                        <td className='py-4 text-muted-foreground'>{formatDate(project.deadline)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

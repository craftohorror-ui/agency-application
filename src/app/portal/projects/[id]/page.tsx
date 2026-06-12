import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getPortalProject } from '@/lib/portal'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatStage(stage: string) {
  return stage.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateStr))
}

export default async function PortalProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const project = await getPortalProject(resolvedParams.id)

  if (!project) {
    notFound()
  }

  const tasks = project.tasks || []
  const completedTasks = tasks.filter(t => t.status === 'done')
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  const deliverables = project.deliverables || []
  const files = project.files || []

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <Link href='/portal/projects'>
              <Button variant='outline' size='sm'>&larr; Back</Button>
            </Link>
            <h1 className='text-2xl font-bold tracking-tight'>{project.name}</h1>
            <Badge variant='outline'>{formatStage(project.stage)}</Badge>
          </div>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h4 className='text-sm font-medium text-muted-foreground'>Description</h4>
                <p className='mt-1 text-sm whitespace-pre-wrap'>{project.description || 'No description provided.'}</p>
              </div>
              <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>Status</h4>
                  <p className='mt-1 text-sm'>{formatStage(project.stage)}</p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>Deadline</h4>
                  <p className='mt-1 text-sm'>{project.deadline ? formatDate(project.deadline) : 'TBD'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Tasks</CardTitle>
              <span className='text-sm text-muted-foreground'>{completedTasks.length} / {tasks.length} completed</span>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Progress value={progressPercentage} className='h-2' />
              
              {tasks.length === 0 ? (
                <div className='text-sm text-muted-foreground text-center py-4'>No tasks defined yet.</div>
              ) : (
                <div className='space-y-3 pt-4'>
                  {tasks.map(task => (
                    <div key={task.id} className='flex items-start justify-between border-b pb-3 last:border-0 last:pb-0'>
                      <div>
                        <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        {task.due_date && (
                          <p className='text-xs text-muted-foreground mt-1'>Due: {formatDate(task.due_date)}</p>
                        )}
                      </div>
                      <Badge variant={task.status === 'done' ? 'muted' : 'outline'}>
                        {formatStage(task.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              {deliverables.length === 0 ? (
                <div className='text-sm text-muted-foreground text-center'>No deliverables yet.</div>
              ) : (
                <div className='space-y-4'>
                  {deliverables.map(deliv => (
                    <div key={deliv.id} className='flex flex-col space-y-2 border-b pb-3 last:border-0 last:pb-0'>
                      <div className='flex items-start justify-between'>
                        <span className='text-sm font-medium'>{deliv.title}</span>
                        <Badge variant={deliv.status === 'approved' ? 'default' : 'outline'} className='text-xs'>
                          {formatStage(deliv.status)}
                        </Badge>
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        Added {formatDate(deliv.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attached Files</CardTitle>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className='text-sm text-muted-foreground text-center'>No files attached.</div>
              ) : (
                <div className='space-y-3'>
                  {files.map(file => (
                    <div key={file.id} className='flex items-center justify-between'>
                      <span className='text-sm truncate mr-2'>{file.name}</span>
                      <Link href={`/portal/files`}>
                        <Button variant='ghost' size='sm'>View</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { FileIcon, MessageCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPortalDashboardMetrics } from '@/lib/portal'

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateStr))
}

export default async function PortalHome() {
  const metrics = await getPortalDashboardMetrics()

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground mt-2'>Welcome back. Here is an overview of your projects and deliverables.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Projects</CardTitle>
            <ClockIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.activeProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completed Projects</CardTitle>
            <CheckCircleIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.completedProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending Deliverables</CardTitle>
            <FileIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.pendingDeliverables.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Recent Messages</CardTitle>
            <MessageCircleIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{metrics.recentMessages.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.recentFiles.length === 0 ? (
              <div className='text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-md'>
                No files uploaded yet.
              </div>
            ) : (
              <div className='space-y-4'>
                {metrics.recentFiles.map((file) => (
                  <div key={file.id} className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <FileIcon className='h-5 w-5 text-primary' />
                      <div>
                        <p className='text-sm font-medium leading-none'>{file.name}</p>
                        <p className='text-xs text-muted-foreground mt-1'>{formatDate(file.created_at)}</p>
                      </div>
                    </div>
                    <Link href={`/portal/files`}>
                      <Button variant='ghost' size='sm'>View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.recentMessages.length === 0 ? (
              <div className='text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-md'>
                No recent messages.
              </div>
            ) : (
              <div className='space-y-4'>
                {metrics.recentMessages.map((msg) => (
                  <div key={msg.id} className='flex items-start gap-3'>
                    <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0'>
                      {msg.sender?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className='flex-1 overflow-hidden'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium'>{msg.sender?.full_name || 'User'}</p>
                        <span className='text-xs text-muted-foreground'>{formatDate(msg.created_at)}</span>
                      </div>
                      <p className='text-sm text-muted-foreground truncate'>{msg.body}</p>
                    </div>
                  </div>
                ))}
                <div className='pt-2'>
                  <Link href='/portal/messages' className='text-sm text-primary hover:underline'>
                    View all messages &rarr;
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.pendingDeliverables.length === 0 ? (
            <div className='text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-md'>
              You have no pending deliverables requiring review.
            </div>
          ) : (
            <div className='space-y-4'>
              {metrics.pendingDeliverables.map((deliv) => (
                <div key={deliv.id} className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4'>
                  <div>
                    <h4 className='font-medium'>{deliv.title}</h4>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Project: {deliv.project?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Badge variant='outline' className='bg-yellow-50 text-yellow-700 border-yellow-200'>Pending Review</Badge>
                    <Link href={`/portal/projects/${deliv.project_id}`}>
                      <Button size='sm'>View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

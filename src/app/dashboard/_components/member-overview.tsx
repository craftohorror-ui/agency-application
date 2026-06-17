import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { requireStaff } from '@/lib/auth'

export async function MemberOverview() {
  const { supabase, user } = await requireStaff()

  // 1. My Assigned Projects
  const { data: myProjects } = await supabase
    .from('projects')
    .select('*, client:clients(name), project_members!inner(profile_id)')
    .eq('project_members.profile_id', user.id)
    .neq('stage', 'completed')
    .order('created_at', { ascending: false })

  const assignedProjects = myProjects || []

  // 2. My Tasks
  const { data: myTasks } = await supabase
    .from('tasks')
    .select('*, project:projects(name)')
    .eq('assignee_id', user.id)
    .neq('status', 'done')
    .order('due_date', { ascending: true })

  const tasks = myTasks || []
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  // Workload Summary logic
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'review')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date) < today
  })

  const dueThisWeekTasks = tasks.filter(t => {
    if (!t.due_date) return false
    const d = new Date(t.due_date)
    return d >= today && d <= nextWeek
  })

  // Upcoming Deadlines (combining project deadlines and task deadlines)
  // Let's just take the next 5 tasks due soonest (that are not overdue)
  const upcomingDeadlines = tasks
    .filter(t => t.due_date && new Date(t.due_date) >= today)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)

  // Recent Messages (Find recent conversations user is part of)
  const { data: myConversations } = await supabase
    .from('conversation_participants')
    .select('conversation_id, conversations(title, type, updated_at)')
    .eq('profile_id', user.id)
    .order('conversation_id', { ascending: false })
    .limit(5)

  // Recent Files (Uploaded by user or in user's projects)
  // To keep it simple, just files uploaded by the user recently
  const { data: recentFiles } = await supabase
    .from('files')
    .select('id, name, display_name, folder, created_at')
    .eq('uploaded_by', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // My Recent Activity
  const { data: myActivity } = await supabase
    .from('activities')
    .select('id, title, occurred_at, type')
    .eq('actor_id', user.id)
    .order('occurred_at', { ascending: false })
    .limit(5)

  const formatStage = (s: string) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const formatStatus = (s: string) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className='space-y-6'>
      {/* Top Metrics Row: My Workload Summary */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{pendingTasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>In Progress Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-blue-600'>{inProgressTasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-orange-600'>Due This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-orange-600'>{dueThisWeekTasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-destructive'>Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-destructive'>{overdueTasks.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* My Assigned Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Assigned Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects assigned.</p>
            ) : (
              <div className="space-y-4">
                {assignedProjects.map(project => (
                  <div key={project.id} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline block truncate text-sm">
                        {project.name}
                      </Link>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="text-xs text-muted-foreground">{(project.client as any)?.name || 'No client'}</span>
                    </div>
                    <Badge variant="muted" className="text-[10px]">{formatStage(project.stage)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Active Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active tasks.</p>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="text-xs text-muted-foreground">Project: {(task.project as any)?.name || 'None'}</span>
                    </div>
                    <Badge variant={task.status === 'in_progress' ? 'default' : 'outline'} className="text-[10px]">{formatStatus(task.status)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map(task => (
                  <div key={task.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="text-xs text-muted-foreground">{(task.project as any)?.name || 'General'}</span>
                    </div>
                    <span className="text-xs text-orange-600 font-medium whitespace-nowrap ml-2">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Files */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Recent Files</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentFiles || recentFiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent files uploaded.</p>
            ) : (
              <div className="space-y-4">
                {recentFiles.map(file => (
                  <div key={file.id} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <Link href={`/dashboard/files`} className="font-medium hover:underline block truncate text-sm">
                        {file.display_name}
                      </Link>
                      <span className="text-xs text-muted-foreground capitalize">{file.folder?.replace('_', ' ')}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {!myConversations || myConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent conversations.</p>
            ) : (
              <div className="space-y-4">
                {myConversations.map(cp => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const conv = cp.conversations as any
                  if (!conv) return null
                  return (
                    <div key={cp.conversation_id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div className="truncate pr-2">
                        <Link href={`/dashboard/messages`} className="font-medium hover:underline block truncate text-sm">
                          {conv.title || 'Chat'}
                        </Link>
                        <span className="text-xs text-muted-foreground capitalize">{conv.type}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {!myActivity || myActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {myActivity.map(activity => (
                  <div key={activity.id} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <p className="font-medium text-sm truncate">{activity.title}</p>
                      <span className="text-xs text-muted-foreground capitalize">{activity.type?.replace('_', ' ')}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{new Date(activity.occurred_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

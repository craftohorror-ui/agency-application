import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { listProjects } from '@/lib/projects'
import { listLeads } from '@/lib/leads'
import { listClients } from '@/lib/clients'
import { listTeam, getTeamMember } from '@/lib/team'

export default async function DashboardPage() {
  const [
    { projects: allProjects, count: totalProjects },
    { leads: recentLeads, count: totalLeads },
    { clients: recentClients, count: totalClients },
    { members: allTeamMembers, count: totalTeamMembers },
  ] = await Promise.all([
    listProjects({ limit: 1000 }),
    listLeads({ limit: 5 }),
    listClients({ limit: 5 }),
    listTeam({ limit: 1000 }),
  ])

  // Process Projects
  const activeProjects = allProjects.filter(p => p.stage !== 'completed')
  const completedProjects = allProjects.filter(p => p.stage === 'completed')
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7Days = new Date(today)
  in7Days.setDate(in7Days.getDate() + 7)

  const overdueProjects = activeProjects.filter(p => {
    if (!p.deadline) return false
    return new Date(p.deadline) < today
  })

  const dueSoonProjects = activeProjects.filter(p => {
    if (!p.deadline) return false
    const d = new Date(p.deadline)
    return d >= today && d <= in7Days
  })

  const recentProjects = allProjects.slice(0, 5)
  const recentlyCompleted = completedProjects.slice(0, 5)

  // Fetch team member details for workload
  const detailedMembers = await Promise.all(
    allTeamMembers.map(m => getTeamMember(m.id))
  )

  const formatStage = (s: string) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-sm text-muted-foreground'>Agency overview and operational metrics.</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{totalLeads || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{totalClients || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{totalProjects || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{activeProjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{totalTeamMembers || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent leads.</p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map(lead => (
                  <div key={lead.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-medium hover:underline block truncate">
                        {lead.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{lead.company || 'No company'}</span>
                    </div>
                    <Badge variant="outline">{formatStage(lead.stage)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent clients.</p>
            ) : (
              <div className="space-y-4">
                {recentClients.map(client => (
                  <div key={client.id} className="flex flex-col border-b pb-2 last:border-0 last:pb-0">
                    <Link href={`/dashboard/clients/${client.id}`} className="font-medium hover:underline block truncate">
                      {client.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{client.company || 'No company'}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent projects.</p>
            ) : (
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline block truncate">
                        {project.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{project.client?.name || 'No client'}</span>
                    </div>
                    <Badge variant="muted">{formatStage(project.stage)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Health</CardTitle>
              <p className="text-sm text-muted-foreground">Attention required on these projects</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-destructive"></span>
                  Overdue ({overdueProjects.length})
                </h4>
                {overdueProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No overdue projects.</p>
                ) : (
                  <div className="space-y-3">
                    {overdueProjects.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-sm border p-2 rounded">
                        <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:underline truncate">
                          {p.name}
                        </Link>
                        <span className="text-xs text-destructive whitespace-nowrap ml-2">
                          {p.deadline ? new Date(p.deadline).toLocaleDateString() : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-orange-500 mb-3 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                  Due Soon ({dueSoonProjects.length})
                </h4>
                {dueSoonProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No projects due in next 7 days.</p>
                ) : (
                  <div className="space-y-3">
                    {dueSoonProjects.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-sm border p-2 rounded">
                        <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:underline truncate">
                          {p.name}
                        </Link>
                        <span className="text-xs text-orange-500 whitespace-nowrap ml-2">
                          {p.deadline ? new Date(p.deadline).toLocaleDateString() : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently Completed</CardTitle>
            </CardHeader>
            <CardContent>
              {recentlyCompleted.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recently completed projects.</p>
              ) : (
                <div className="space-y-3">
                  {recentlyCompleted.map(p => (
                    <div key={p.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                      <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:underline truncate">
                        {p.name}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Workload</CardTitle>
            <p className="text-sm text-muted-foreground">Assigned active projects per member</p>
          </CardHeader>
          <CardContent>
            {detailedMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No team members found.</p>
            ) : (
              <div className="space-y-4">
                {detailedMembers.map(member => {
                  if (!member) return null
                  const projects = Array.isArray(member.project_members) ? member.project_members : []
                  const activeAssigned = projects.filter((pm: { project: { stage: string } | null }) => pm.project && pm.project.stage !== 'completed')
                  
                  return (
                    <div key={member.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <Link href={`/dashboard/team/${member.id}`} className="font-medium hover:underline">
                          {member.full_name}
                        </Link>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{activeAssigned.length}</span>
                        <span className="text-xs text-muted-foreground block">Projects</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

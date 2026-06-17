import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FileText, FileSignature, FolderKanban, ReceiptText } from 'lucide-react'

import { listProjects } from '@/lib/projects'
import { listLeads } from '@/lib/leads'
import { listClients } from '@/lib/clients'
import { listTeam } from '@/lib/team'
import { getDashboardTasksStats } from '@/lib/tasks'
import { requireStaff } from '@/lib/auth'

export async function OwnerOverview() {
  const { supabase } = await requireStaff()

  // Main Dashboard Metrics
  const [
    { projects: allProjects },
    { leads: recentLeads, count: totalLeads },
    { clients: recentClients, count: totalClients },
    { count: totalTeamMembers },
    taskStats,
  ] = await Promise.all([
    listProjects({ limit: 100 }), // fetch a batch to find active
    listLeads({ limit: 5 }),
    listClients({ limit: 5 }),
    listTeam({ limit: 1000 }),
    getDashboardTasksStats(),
  ])

  const activeProjects = allProjects.filter(p => p.stage !== 'completed')
  const recentProjects = allProjects.slice(0, 5)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdueProjects = activeProjects.filter(p => {
    if (!p.deadline) return false
    return new Date(p.deadline) < today
  })

  // Team Workload
  const { data: detailedMembers } = await supabase
    .from('profiles')
    .select('*, project_members(role_in_project, project:projects(stage))')
    .eq('is_suspended', false)

  // Finances
  const { data: invoicesData } = await supabase
    .from('invoices')
    .select('status, total, amount_paid')
    .in('status', ['sent', 'partially_paid', 'overdue'])

  let outstandingCount = 0
  let amountDue = 0
  if (invoicesData) {
    outstandingCount = invoicesData.length
    amountDue = invoicesData.reduce((sum, inv) => sum + Math.max(0, inv.total - inv.amount_paid), 0)
  }

  const { data: recentPayments } = await supabase
    .from('payments')
    .select('id, amount, paid_at, invoice_id, method')
    .order('paid_at', { ascending: false })
    .limit(5)

  // Recent Activity
  const { data: recentActivity } = await supabase
    .from('activities')
    .select('id, title, occurred_at, type')
    .order('occurred_at', { ascending: false })
    .limit(5)

  const formatStage = (s: string) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <div className='space-y-6'>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link href="/dashboard/leads/new">
          <Button size="sm" variant="outline"><Users className="w-4 h-4 mr-2" /> New Lead</Button>
        </Link>
        <Link href="/dashboard/proposals/new">
          <Button size="sm" variant="outline"><FileText className="w-4 h-4 mr-2" /> New Proposal</Button>
        </Link>
        <Link href="/dashboard/contracts">
          <Button size="sm" variant="outline"><FileSignature className="w-4 h-4 mr-2" /> New Contract</Button>
        </Link>
        <Link href="/dashboard/projects/new">
          <Button size="sm" variant="outline"><FolderKanban className="w-4 h-4 mr-2" /> New Project</Button>
        </Link>
        <Link href="/dashboard/invoices/new">
          <Button size="sm" variant="outline"><ReceiptText className="w-4 h-4 mr-2" /> New Invoice</Button>
        </Link>
      </div>

      {/* Top Metrics Row */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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

      {/* Finance & Operational Health Row */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Tasks Due This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-orange-600'>{taskStats.dueThisWeek}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-destructive'>Overdue Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-destructive'>{overdueProjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{outstandingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Amount Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-slate-900'>{formatCurrency(amountDue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Lists Row */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent leads.</p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map(lead => (
                  <div key={lead.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-medium hover:underline block truncate text-sm">
                        {lead.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{lead.company || 'No company'}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{formatStage(lead.stage)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent clients.</p>
            ) : (
              <div className="space-y-4">
                {recentClients.map(client => (
                  <div key={client.id} className="flex flex-col border-b pb-2 last:border-0 last:pb-0">
                    <Link href={`/dashboard/clients/${client.id}`} className="font-medium hover:underline block truncate text-sm">
                      {client.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{client.company || 'No company'}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent projects.</p>
            ) : (
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline block truncate text-sm">
                        {project.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{project.client?.name || 'No client'}</span>
                    </div>
                    <Badge variant="muted" className="text-[10px]">{formatStage(project.stage)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Workload Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team Workload</CardTitle>
          </CardHeader>
          <CardContent>
            {!detailedMembers || detailedMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No team members found.</p>
            ) : (
              <div className="space-y-4">
                {detailedMembers.map(member => {
                  if (!member) return null
                  const projects = Array.isArray(member.project_members) ? member.project_members : []
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const activeAssigned = projects.filter((pm: any) => pm.project && pm.project.stage !== 'completed')
                  
                  return (
                    <div key={member.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <Link href={`/dashboard/team/${member.id}`} className="font-medium hover:underline text-sm">
                          {member.full_name}
                        </Link>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{activeAssigned.length}</span>
                        <span className="text-xs text-muted-foreground block">Active Projects</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentPayments || recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent payments.</p>
            ) : (
              <div className="space-y-4">
                {recentPayments.map(payment => (
                  <div key={payment.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <div className="truncate pr-2">
                      <p className="font-medium text-sm">{formatCurrency(payment.amount)}</p>
                      <span className="text-xs text-muted-foreground block capitalize">{payment.method?.replace('_', ' ') || 'Unknown'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(payment.paid_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Agency Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentActivity || recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map(activity => (
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

import Link from 'next/link'
import { getClientsQuery } from '@/app/dashboard/clients/queries'
import { requireStaff } from '@/lib/auth'
import { listTeam } from '@/lib/team'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type SearchParams = {
  search?: string | string[]
  owner?: string | string[]
}

type ClientsPageProps = {
  searchParams?: Promise<SearchParams>
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const search = getSingleValue(resolvedSearchParams.search)?.trim() ?? ''
  const owner = getSingleValue(resolvedSearchParams.owner) ?? ''

  const { profile } = await requireStaff()
  const teamResult = profile.role === 'owner' ? await listTeam() : { members: [] }
  const teamMembers = teamResult.members

  const { clients, count } = await getClientsQuery({
    search: search || undefined,
    ownerId: owner || undefined,
  })

  const hasFilters = Boolean(search || owner)

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Clients</h1>
          <p className='text-sm text-muted-foreground'>
            View and manage your clients.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline'>{count ?? clients.length} total</Badge>
        </div>
      </div>

      <Card>
        <CardHeader className='gap-3'>
          <CardTitle>Client Directory</CardTitle>
          <form className='grid gap-3 sm:grid-cols-1'>
            <div className="flex flex-col sm:flex-row gap-3 sm:col-span-2">
              <Input
                type='search'
                name='search'
                defaultValue={search}
                placeholder='Search name, email, or company'
                aria-label='Search clients'
                className="flex-1"
              />
              {profile.role === 'owner' && (
                <select
                  name="owner"
                  defaultValue={owner}
                  className="flex h-9 w-full sm:max-w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Clients</option>
                  <option value="unassigned">Unassigned Clients</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>{m.full_name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className='flex gap-2 sm:col-span-2 justify-end'>
              <Button type='submit' className='flex-1 sm:flex-none'>
                Apply
              </Button>
              {hasFilters ? (
                <Link
                  href='/dashboard/clients'
                  className='inline-flex h-9 flex-1 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted sm:flex-none'
                >
                  Reset
                </Link>
              ) : null}
            </div>
          </form>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className='flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center'>
              <p className='text-base font-medium'>No clients found.</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                {hasFilters
                  ? 'Try adjusting the search.'
                  : 'Convert leads to clients to see them here.'}
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='grid gap-3 md:hidden'>
                {clients.map((client) => (
                  <div key={client.id} className='rounded-lg border p-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <Link href={`/dashboard/clients/${client.id}`} className='truncate font-medium hover:underline'>{client.name}</Link>
                        <p className='text-sm text-muted-foreground'>
                          {client.company || 'No company'}
                        </p>
                      </div>
                    </div>
                    <dl className='mt-4 space-y-2 text-sm'>
                      <div className='flex justify-between gap-3'>
                        <dt className='text-muted-foreground'>Email</dt>
                        <dd className='truncate text-right'>{client.email || '—'}</dd>
                      </div>
                      <div className='flex justify-between gap-3'>
                        <dt className='text-muted-foreground'>Created</dt>
                        <dd className='text-right'>{formatDate(client.created_at)}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              <div className='hidden overflow-x-auto md:block'>
                <table className='min-w-full text-sm'>
                  <thead className='border-b text-left text-muted-foreground'>
                    <tr>
                      <th className='py-3 pr-4 font-medium'>Client</th>
                      <th className='py-3 pr-4 font-medium'>Email</th>
                      <th className='py-3 pr-4 font-medium'>Phone</th>
                      <th className='py-3 font-medium'>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className='border-b last:border-b-0 hover:bg-muted/50'>
                        <td className='py-4 pr-4'>
                          <div>
                            <Link href={`/dashboard/clients/${client.id}`} className='font-medium hover:underline'>{client.name}</Link>
                            <p className='text-muted-foreground'>{client.company || 'No company'}</p>
                          </div>
                        </td>
                        <td className='py-4 pr-4 text-muted-foreground'>
                          <Link href={`/dashboard/clients/${client.id}`} className="block">{client.email || '—'}</Link>
                        </td>
                        <td className='py-4 pr-4 text-muted-foreground'>
                          <Link href={`/dashboard/clients/${client.id}`} className="block">{client.phone || '—'}</Link>
                        </td>
                        <td className='py-4 text-muted-foreground'>{formatDate(client.created_at)}</td>
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

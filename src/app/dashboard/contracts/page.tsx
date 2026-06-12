import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { listContracts } from '@/lib/contracts'
import type { ContractStatus } from '@/lib/types'

type SearchParams = {
  search?: string | string[]
  status?: string | string[]
}

export default async function ContractsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolvedParams = (await searchParams) ?? {}
  const search = Array.isArray(resolvedParams.search) ? resolvedParams.search[0] : resolvedParams.search
  const status = Array.isArray(resolvedParams.status) ? resolvedParams.status[0] : resolvedParams.status

  const { contracts } = await listContracts(search, status as ContractStatus)
  const hasFilters = Boolean(search || status)

  function formatStatus(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function getStatusColor(s: string) {
    if (s === 'signed') return 'default'
    if (s === 'pending') return 'muted'
    if (s === 'expired') return 'destructive'
    return 'outline'
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Contracts</h1>
          <p className='text-sm text-muted-foreground'>Manage active and signed client agreements.</p>
        </div>
      </div>

      <Card>
        <CardHeader className='gap-3'>
          <form className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]'>
            <Input
              type='search'
              name='search'
              defaultValue={search ?? ''}
              placeholder='Search contracts...'
            />
            <select
              name='status'
              defaultValue={status ?? ''}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-[150px]'
            >
              <option value=''>All Statuses</option>
              <option value='draft'>Draft</option>
              <option value='pending'>Pending</option>
              <option value='signed'>Signed</option>
              <option value='expired'>Expired</option>
            </select>
            <div className='flex gap-2'>
              <Button type='submit' className='flex-1 sm:flex-none'>Search</Button>
              {hasFilters && (
                <Link
                  href='/dashboard/contracts'
                  className='inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted'
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <div className='grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium'>
              <div className='col-span-4'>Title</div>
              <div className='col-span-3'>Client</div>
              <div className='col-span-2 text-center'>Version</div>
              <div className='col-span-2 text-right'>Status</div>
              <div className='col-span-1 text-right'>Action</div>
            </div>
            {contracts.length === 0 ? (
              <div className='py-8 text-center text-sm text-muted-foreground'>
                No contracts found. Note: Contracts are generated from Proposals.
              </div>
            ) : (
              <div className='divide-y'>
                {contracts.map((contract) => (
                  <div key={contract.id} className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
                    <div className='col-span-4 font-medium truncate pr-2'>{contract.title}</div>
                    <div className='col-span-3 text-muted-foreground truncate pr-2'>
                      {contract.client?.name || 'Unknown'}
                    </div>
                    <div className='col-span-2 text-center text-muted-foreground'>v{contract.version}</div>
                    <div className='col-span-2 text-right'>
                      <Badge variant={getStatusColor(contract.status)}>{formatStatus(contract.status)}</Badge>
                    </div>
                    <div className='col-span-1 text-right'>
                      <Link href={`/dashboard/contracts/${contract.id}`}>
                        <Button variant='ghost' size='sm'>View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

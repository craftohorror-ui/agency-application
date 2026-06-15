import Link from 'next/link'
import { PlusIcon, CopyIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { listProposals } from '@/lib/proposals'
import type { ProposalStatus } from '@/lib/types'
import { duplicateProposalAction } from './actions'

type SearchParams = {
  search?: string | string[]
  status?: string | string[]
}

export default async function ProposalsPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolvedParams = (await searchParams) ?? {}
  const search = Array.isArray(resolvedParams.search) ? resolvedParams.search[0] : resolvedParams.search
  const status = Array.isArray(resolvedParams.status) ? resolvedParams.status[0] : resolvedParams.status

  const { proposals } = await listProposals(search, status as ProposalStatus)
  const hasFilters = Boolean(search || status)

  function formatStatus(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Proposals</h1>
          <p className='text-sm text-muted-foreground'>Manage your sales proposals and estimates.</p>
        </div>
        <Link href='/dashboard/proposals/new'>
          <Button>
            <PlusIcon className='mr-2 h-4 w-4' /> New Proposal
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className='gap-3'>
          <form className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]'>
            <Input
              type='search'
              name='search'
              defaultValue={search ?? ''}
              placeholder='Search proposals...'
            />
            <select
              name='status'
              defaultValue={status ?? ''}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-[150px]'
            >
              <option value=''>All Statuses</option>
              <option value='draft'>Draft</option>
              <option value='sent'>Sent</option>
              <option value='viewed'>Viewed</option>
              <option value='accepted'>Accepted</option>
              <option value='rejected'>Rejected</option>
            </select>
            <div className='flex gap-2'>
              <Button type='submit' className='flex-1 sm:flex-none'>Search</Button>
              {hasFilters && (
                <Link
                  href='/dashboard/proposals'
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
              <div className='col-span-3'>Client / Lead</div>
              <div className='col-span-2 text-right'>Amount</div>
              <div className='col-span-2 text-right'>Status</div>
              <div className='col-span-1 text-right'>Action</div>
            </div>
            {proposals.length === 0 ? (
              <div className='py-8 text-center text-sm text-muted-foreground'>
                No proposals found.
              </div>
            ) : (
              <div className='divide-y'>
                {proposals.map((proposal) => (
                  <div key={proposal.id} className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
                    <div className='col-span-4 font-medium truncate pr-2'>{proposal.title}</div>
                    <div className='col-span-3 text-muted-foreground truncate pr-2'>
                      {proposal.client?.name || proposal.lead?.name || 'Unknown'}
                    </div>
                    <div className='col-span-2 text-right font-medium'>${proposal.amount}</div>
                    <div className='col-span-2 text-right'>
                      <Badge variant='outline'>{formatStatus(proposal.status)}</Badge>
                    </div>
                    <div className='col-span-1 flex justify-end gap-1'>
                      <Link href={`/dashboard/proposals/${proposal.id}`}>
                        <Button variant='ghost' size='sm'>View</Button>
                      </Link>
                      <form action={duplicateProposalAction.bind(null, proposal.id)}>
                        <Button variant='ghost' size='sm' type="submit" title="Duplicate Proposal">
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </form>
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

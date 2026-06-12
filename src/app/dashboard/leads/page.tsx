import Link from 'next/link'
import { getLeadsQuery } from '@/app/dashboard/leads/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KanbanBoard, type KanbanLead } from '@/components/leads/kanban-board'

type SearchParams = {
  search?: string | string[]
}

type LeadsPageProps = {
  searchParams?: Promise<SearchParams>
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const search = getSingleValue(resolvedSearchParams.search)?.trim() ?? ''

  const { leads, count } = await getLeadsQuery({
    search: search || undefined,
  })

  return (
    <div className='space-y-6 flex flex-col h-[calc(100vh-100px)]'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between shrink-0'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Lead Pipeline</h1>
          <p className='text-sm text-muted-foreground'>
            Manage incoming leads across stages. Drag and drop to update.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline'>{count ?? leads.length} total</Badge>
          <Link href='/dashboard/leads/new'>
            <Button>New Lead</Button>
          </Link>
        </div>
      </div>

      <div className='flex items-center justify-between shrink-0'>
        <form className='flex w-full max-w-sm items-center space-x-2'>
          <Input
            type='search'
            name='search'
            defaultValue={search}
            placeholder='Search name, email, or company'
            aria-label='Search leads'
          />
          <Button type='submit' variant="outline">Filter</Button>
          {search && (
            <Link href='/dashboard/leads' className='text-sm text-muted-foreground hover:underline ml-2'>
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className='flex-1 min-h-0'>
        <KanbanBoard initialLeads={leads as unknown as KanbanLead[]} />
      </div>
    </div>
  )
}

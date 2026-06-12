import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { listInvoices } from '@/lib/invoices'
import type { InvoiceStatus } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{ search?: string | string[], status?: string | string[] }>
}

export default async function InvoicesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const search = Array.isArray(resolvedParams.search) ? resolvedParams.search[0] : resolvedParams.search
  const status = Array.isArray(resolvedParams.status) ? resolvedParams.status[0] : resolvedParams.status

  const { invoices } = await listInvoices(search, status as InvoiceStatus)
  const hasFilters = Boolean(search || status)

  function formatStatus(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function getStatusColor(s: string) {
    if (s === 'paid') return 'default'
    if (s === 'sent') return 'muted'
    if (s === 'partially_paid') return 'outline'
    if (s === 'overdue') return 'destructive'
    if (s === 'draft') return 'outline'
    return 'outline'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Invoices</h1>
          <p className='text-sm text-muted-foreground'>Manage your billing and payments.</p>
        </div>
        <Link href='/dashboard/invoices/new'>
          <Button className='w-full sm:w-auto'>
            <PlusIcon className='mr-2 h-4 w-4' />
            Create Invoice
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <form className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <Input
              name='search'
              placeholder='Search invoices or clients...'
              defaultValue={search || ''}
              className='max-w-sm'
            />
            <select
              name='status'
              defaultValue={status || ''}
              className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-[200px]'
            >
              <option value=''>All Statuses</option>
              <option value='draft'>Draft</option>
              <option value='sent'>Sent</option>
              <option value='partially_paid'>Partially Paid</option>
              <option value='paid'>Paid</option>
              <option value='overdue'>Overdue</option>
            </select>
            <Button type='submit' variant='outline'>Filter</Button>
            {hasFilters && (
              <Link href='/dashboard/invoices'>
                <Button variant='ghost'>Clear</Button>
              </Link>
            )}
          </form>
        </CardHeader>
        <CardContent className="p-0">
          <div className='rounded-md border border-t-0'>
            <div className='grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium'>
              <div className='col-span-3'>Number</div>
              <div className='col-span-3'>Client</div>
              <div className='col-span-2 text-right'>Total</div>
              <div className='col-span-2 text-right'>Status</div>
              <div className='col-span-2 text-right'>Action</div>
            </div>
            {invoices.length === 0 ? (
              <div className='py-8 text-center text-sm text-muted-foreground'>
                No invoices found.
              </div>
            ) : (
              <div className='divide-y'>
                {invoices.map((invoice) => (
                  <div key={invoice.id} className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
                    <div className='col-span-3 font-medium font-mono'>{invoice.number}</div>
                    <div className='col-span-3 truncate pr-2'>{invoice.client?.name || 'Unknown Client'}</div>
                    <div className='col-span-2 text-right tabular-nums'>{formatCurrency(invoice.total)}</div>
                    <div className='col-span-2 text-right'>
                      <Badge variant={getStatusColor(invoice.status)}>{formatStatus(invoice.status)}</Badge>
                    </div>
                    <div className='col-span-2 text-right'>
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
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

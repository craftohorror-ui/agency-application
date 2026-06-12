import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { listPortalInvoices } from '@/lib/invoices'

export default async function PortalInvoicesPage() {
  const invoices = await listPortalInvoices()

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

  const totalOutstanding = invoices.reduce((sum, inv) => {
    if (inv.status !== 'draft') {
      return sum + Math.max(0, inv.total - inv.amount_paid)
    }
    return sum
  }, 0)

  return (
    <div className='space-y-6'>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Invoices</h1>
          <p className='text-sm text-muted-foreground'>Review and manage your billing history.</p>
        </div>
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-4 flex items-center gap-4">
            <div>
              <div className="text-sm opacity-80">Outstanding Balance</div>
              <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className='rounded-md border'>
            <div className='grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium'>
              <div className='col-span-3'>Number</div>
              <div className='col-span-3'>Project</div>
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
                    <div className='col-span-3 truncate pr-2'>{invoice.project?.name || '-'}</div>
                    <div className='col-span-2 text-right tabular-nums'>{formatCurrency(invoice.total)}</div>
                    <div className='col-span-2 text-right'>
                      <Badge variant={getStatusColor(invoice.status)}>{formatStatus(invoice.status)}</Badge>
                    </div>
                    <div className='col-span-2 text-right'>
                      <Link href={`/portal/invoices/${invoice.id}`}>
                        <Button variant={invoice.status === 'sent' || invoice.status === 'partially_paid' || invoice.status === 'overdue' ? 'default' : 'outline'} size='sm'>
                          {invoice.status === 'sent' || invoice.status === 'partially_paid' || invoice.status === 'overdue' ? 'Pay Now' : 'View'}
                        </Button>
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

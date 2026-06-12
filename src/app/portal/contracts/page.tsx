import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { listPortalContracts } from '@/lib/contracts'

export default async function PortalContractsPage() {
  const contracts = await listPortalContracts()

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
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Contracts</h1>
        <p className='text-sm text-muted-foreground'>Review and sign your active agreements.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className='rounded-md border'>
            <div className='grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium'>
              <div className='col-span-6'>Title</div>
              <div className='col-span-3 text-right'>Status</div>
              <div className='col-span-3 text-right'>Action</div>
            </div>
            {contracts.length === 0 ? (
              <div className='py-8 text-center text-sm text-muted-foreground'>
                No active contracts found.
              </div>
            ) : (
              <div className='divide-y'>
                {contracts.map((contract) => (
                  <div key={contract.id} className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
                    <div className='col-span-6 font-medium truncate pr-2'>{contract.title}</div>
                    <div className='col-span-3 text-right'>
                      <Badge variant={getStatusColor(contract.status)}>{formatStatus(contract.status)}</Badge>
                    </div>
                    <div className='col-span-3 text-right'>
                      <Link href={`/portal/contracts/${contract.id}`}>
                        <Button variant={contract.status === 'pending' ? 'default' : 'outline'} size='sm'>
                          {contract.status === 'pending' ? 'Review & Sign' : 'View'}
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

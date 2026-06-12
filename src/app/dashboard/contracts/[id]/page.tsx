import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth'
import { getContract, listContractVersions } from '@/lib/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { updateContractStatusAction, updateContractBodyAction } from '../actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ContractDetailPage({ params }: PageProps) {
  await requireStaff()
  const resolvedParams = await params
  const contract = await getContract(resolvedParams.id)

  if (!contract) {
    notFound()
  }

  const versions = await listContractVersions(contract.id)

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
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{contract.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusColor(contract.status)}>{formatStatus(contract.status)}</Badge>
            <span className="text-sm text-muted-foreground">Version {contract.version}</span>
          </div>
        </div>
        <div className='flex gap-2'>
          {contract.status === 'draft' && (
            <form action={updateContractStatusAction.bind(null, contract.id, 'pending')}>
              <Button type="submit">Send for Signature</Button>
            </form>
          )}
          {contract.status === 'pending' && (
            <form action={updateContractStatusAction.bind(null, contract.id, 'draft')}>
              <Button type="submit" variant="outline">Revoke & Revert to Draft</Button>
            </form>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Body</CardTitle>
              <p className="text-sm text-muted-foreground">
                {contract.status === 'draft' 
                  ? 'You can edit the contract body before sending it.' 
                  : 'Contract is locked from editing because it is pending or signed.'}
              </p>
            </CardHeader>
            <CardContent>
              {contract.status === 'draft' ? (
                <form action={updateContractBodyAction.bind(null, contract.id)} className="space-y-4">
                  <Textarea 
                    name="body" 
                    defaultValue={contract.body} 
                    className="min-h-[500px] font-mono text-sm" 
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes & Bump Version</Button>
                  </div>
                </form>
              ) : (
                <div className="rounded-md border bg-muted/20 p-6 whitespace-pre-wrap font-mono text-sm">
                  {contract.body}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signature Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contract.status === 'signed' ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Signed By</div>
                    <div className="font-medium font-serif italic text-lg">{contract.signed_by_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Timestamp</div>
                    <div className="font-medium text-sm">
                      {contract.signed_at ? new Date(contract.signed_at).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Signer IP</div>
                    <div className="font-medium text-sm">{contract.signer_ip || 'N/A'}</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Contract is not yet signed.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <p className="text-sm text-muted-foreground">Automatic snapshots created when the contract is updated.</p>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No historical versions.</p>
              ) : (
                <div className="space-y-4">
                  {versions.map(v => (
                    <div key={v.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                      <div>
                        <span className="font-medium">Version {v.version}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(v.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

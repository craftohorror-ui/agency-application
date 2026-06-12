import { notFound } from 'next/navigation'
import { requireClient } from '@/lib/auth'
import { getPortalContract } from '@/lib/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signContractAction } from '../actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PortalContractDetailPage({ params }: PageProps) {
  await requireClient()
  const resolvedParams = await params
  const contract = await getPortalContract(resolvedParams.id)

  if (!contract) {
    notFound()
  }

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
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{contract.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusColor(contract.status)}>{formatStatus(contract.status)}</Badge>
            <span className="text-sm text-muted-foreground">Version {contract.version}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Terms</CardTitle>
          <p className="text-sm text-muted-foreground">Please review the agreement thoroughly before signing.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/10 p-8 whitespace-pre-wrap font-serif text-[15px] leading-relaxed shadow-inner max-h-[600px] overflow-y-auto">
            {contract.body}
          </div>
        </CardContent>
      </Card>

      {contract.status === 'pending' && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle>Sign Contract</CardTitle>
            <p className="text-sm text-muted-foreground">
              By typing your name below and clicking Sign Contract, you electronically agree to the terms above.
              Your IP address and a timestamp will be recorded.
            </p>
          </CardHeader>
          <CardContent>
            <form action={signContractAction.bind(null, contract.id)} className="space-y-4 max-w-sm">
              <div className="space-y-2">
                <Label htmlFor="signature_name">Full Legal Name</Label>
                <Input 
                  id="signature_name" 
                  name="signature_name" 
                  placeholder="e.g. Jane Doe" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Sign Contract Automatically</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {contract.status === 'signed' && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Digitally Signed
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Signed By</div>
              <div className="font-serif italic font-medium text-lg">{contract.signed_by_name}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Date & Time</div>
              <div className="font-medium">{contract.signed_at ? new Date(contract.signed_at).toLocaleString() : 'N/A'}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">IP Address</div>
              <div className="font-mono">{contract.signer_ip}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

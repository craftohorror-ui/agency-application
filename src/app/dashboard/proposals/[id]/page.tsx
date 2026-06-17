import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EditIcon, TrashIcon, FileTextIcon, FolderIcon, CopyIcon } from 'lucide-react'
import { requireStaff } from '@/lib/auth'
import { getProposal } from '@/lib/proposals'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { deleteProposalAction, convertProposalToContractAction, convertProposalToProjectAction, duplicateProposalAction } from '../actions'
import { ProposalExportModal } from '@/components/proposals/proposal-export-modal'
import { ConvertToInvoiceButton } from '@/components/proposals/convert-to-invoice-button'
import { mapProposalToTemplateData } from '@/lib/templates'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { profile, supabase } = await requireStaff()
  const resolvedParams = await params
  const proposal = await getProposal(resolvedParams.id)

  if (!proposal) {
    notFound()
  }

  // Fetch Agency Context
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', profile.agency_id)
    .single()

  const templateData = mapProposalToTemplateData(
    proposal, 
    agency || {}
  )

  function formatStatus(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{proposal.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{formatStatus(proposal.status)}</Badge>
            <span className="text-sm text-muted-foreground">
              Total Amount: <span className="font-semibold text-foreground">${proposal.amount}</span>
            </span>
          </div>
        </div>
        <div className='flex gap-2 flex-wrap sm:flex-nowrap justify-end'>
          <ProposalExportModal data={templateData} proposalId={proposal.id} initialTemplateId={proposal.template_id} />
          <form action={duplicateProposalAction.bind(null, proposal.id)}>
            <Button variant='outline' type="submit">
              <CopyIcon className='mr-2 h-4 w-4' /> Duplicate
            </Button>
          </form>
          <Link href={`/dashboard/proposals/${proposal.id}/edit`}>
            <Button variant='outline'>
              <EditIcon className='mr-2 h-4 w-4' /> Edit
            </Button>
          </Link>
          <form action={deleteProposalAction.bind(null, proposal.id)}>
            <Button variant='destructive'>
              <TrashIcon className='mr-2 h-4 w-4' /> Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scope & Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Scope of Work</h3>
                <p className="text-sm whitespace-pre-wrap">{proposal.scope || 'No scope defined.'}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Deliverables</h3>
                <p className="text-sm whitespace-pre-wrap">{proposal.deliverables || 'No deliverables defined.'}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p className="text-sm">{proposal.timeline || 'TBD'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Terms</h3>
                  <p className="text-sm">{proposal.terms || 'TBD'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              {proposal.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No line items attached.</p>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  <div className="divide-y">
                    {proposal.items.map(item => (
                      <div key={item.id} className="grid grid-cols-12 px-4 py-2 text-sm items-center">
                        <div className="col-span-6 truncate pr-2">{item.description}</div>
                        <div className="col-span-2 text-right">{item.qty}</div>
                        <div className="col-span-2 text-right">${item.unit_price}</div>
                        <div className="col-span-2 text-right font-medium">${item.qty * item.unit_price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/30 px-4 py-3 text-right font-bold border-t">
                    Total: ${proposal.amount}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Association</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposal.client ? (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Client</div>
                  <Link href={`/dashboard/clients/${proposal.client.id}`} className="font-medium hover:underline">
                    {proposal.client.name} {proposal.client.company && `(${proposal.client.company})`}
                  </Link>
                </div>
              ) : proposal.lead ? (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Lead</div>
                  <Link href={`/dashboard/leads/${proposal.lead.id}`} className="font-medium hover:underline">
                    {proposal.lead.name} {proposal.lead.company && `(${proposal.lead.company})`}
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No association.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflows</CardTitle>
              <p className="text-sm text-muted-foreground">Convert this proposal into actionable items.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <form action={convertProposalToContractAction.bind(null, proposal.id)}>
                <Button 
                  type="submit" 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled={!proposal.client_id}
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Convert to Contract
                </Button>
              </form>
              <form action={convertProposalToProjectAction.bind(null, proposal.id)}>
                <Button 
                  type="submit" 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled={!proposal.client_id}
                >
                  <FolderIcon className="mr-2 h-4 w-4" />
                  Convert to Project
                </Button>
              </form>

              <ConvertToInvoiceButton proposalId={proposal.id} clientId={proposal.client_id} disabled={!proposal.client_id} />

              {!proposal.client_id && (
                <p className="text-xs text-muted-foreground text-center">
                  * Must be linked to a Client to convert.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

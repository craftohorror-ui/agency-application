'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileTextIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { checkExistingInvoiceAction, convertProposalToInvoiceAction } from '@/app/dashboard/proposals/actions'

interface ConvertToInvoiceButtonProps {
  proposalId: string
  clientId: string | null
  disabled?: boolean
}

export function ConvertToInvoiceButton({ proposalId, clientId, disabled }: ConvertToInvoiceButtonProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [existingInvoices, setExistingInvoices] = useState<Array<{ id: string; number: string; status: string; created_at: string }>>([])

  const handleConvertClick = async () => {
    if (!clientId) {
      toast.error('Proposal must be linked to a client to convert to invoice')
      return
    }

    setIsChecking(true)
    try {
      const invoices = await checkExistingInvoiceAction(proposalId, clientId)
      if (invoices && invoices.length > 0) {
        setExistingInvoices(invoices)
        setShowModal(true)
      } else {
        await proceedWithConversion()
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to check existing invoices'
      toast.error(msg)
    } finally {
      setIsChecking(false)
    }
  }

  const proceedWithConversion = async () => {
    setIsConverting(true)
    try {
      await convertProposalToInvoiceAction(proposalId)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to convert to invoice'
      toast.error(msg)
      setIsConverting(false)
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={handleConvertClick}
        disabled={disabled || isChecking || isConverting}
      >
        <FileTextIcon className="w-4 h-4 mr-2" />
        {isChecking ? 'Checking...' : isConverting ? 'Converting...' : 'Convert to Invoice'}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Invoice Detected</DialogTitle>
            <DialogDescription>
              This proposal already has an invoice associated with it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            {existingInvoices.map((inv) => (
              <div key={inv.id} className="p-4 border rounded-md flex justify-between items-center bg-muted/50">
                <div>
                  <p className="font-medium">{inv.number}</p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(inv.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="capitalize text-sm font-medium px-2 py-1 bg-secondary rounded-full">
                  {inv.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowModal(false)} disabled={isConverting}>
              Cancel
            </Button>
            {existingInvoices.length > 0 && (
              <Button variant="outline" onClick={() => router.push(`/dashboard/invoices/${existingInvoices[0].id}`)} disabled={isConverting}>
                Open Existing
              </Button>
            )}
            <Button onClick={proceedWithConversion} disabled={isConverting}>
              {isConverting ? 'Creating...' : 'Create Another Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

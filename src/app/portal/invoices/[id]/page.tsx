import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireClient } from '@/lib/auth'
import { getPortalInvoice } from '@/lib/invoices'
import { listPortalPayments } from '@/lib/payments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PortalInvoiceDetailPage({ params }: PageProps) {
  await requireClient()
  const resolvedParams = await params

  const invoice = await getPortalInvoice(resolvedParams.id)
  if (!invoice) notFound()

  const payments = await listPortalPayments(invoice.id)

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

  const outstandingBalance = invoice.total - invoice.amount_paid

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Invoice {invoice.number}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusColor(invoice.status)}>{formatStatus(invoice.status)}</Badge>
            <span className="text-sm text-muted-foreground">Issued: {new Date(invoice.issue_date).toLocaleDateString()}</span>
            <span className="text-sm text-muted-foreground ml-2">Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant="outline" className="hidden sm:flex" disabled>Download PDF (Coming Soon)</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {invoice.items && invoice.items.length > 0 ? (
                  <div className="divide-y">
                    {invoice.items.map(item => (
                      <div key={item.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                        <div className="col-span-6">{item.description}</div>
                        <div className="col-span-2 text-right tabular-nums">{item.qty}</div>
                        <div className="col-span-2 text-right tabular-nums">{formatCurrency(item.unit_price)}</div>
                        <div className="col-span-2 text-right tabular-nums font-medium">{formatCurrency(item.qty * item.unit_price)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">No line items.</div>
                )}
              </div>

              <div className="mt-6 space-y-2 border-t pt-4 ml-auto w-full max-w-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.tax_rate}%)</span>
                  <span className="tabular-nums">{formatCurrency(invoice.tax_amount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Amount Paid</span>
                  <span className="tabular-nums">-{formatCurrency(invoice.amount_paid)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <span>Balance Due</span>
                  <span className="tabular-nums">{formatCurrency(Math.max(0, outstandingBalance))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-primary/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {outstandingBalance <= 0 ? (
                <div className="text-sm font-medium text-green-600 bg-green-500/10 p-3 rounded-md text-center">
                  Invoice is fully paid.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center space-y-1">
                    <div className="text-sm text-muted-foreground">Amount Due</div>
                    <div className="text-2xl font-bold">{formatCurrency(outstandingBalance)}</div>
                  </div>
                  <Button className="w-full" disabled>Pay Online (Coming Soon)</Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Please refer to the notes section for manual payment instructions (Wire/ACH).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {payments.map(payment => (
                    <div key={payment.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium text-sm">{formatCurrency(payment.amount)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(payment.paid_at).toLocaleDateString()}
                          {payment.method && ` via ${payment.method}`}
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

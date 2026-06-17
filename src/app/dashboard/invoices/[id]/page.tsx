import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireStaff } from '@/lib/auth'
import { getInvoice } from '@/lib/invoices'
import { listPayments } from '@/lib/payments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { recordPaymentAction, deletePaymentAction, updateInvoiceStatusAction, deleteInvoiceAction } from '../actions'
import { InvoiceExportModal } from '@/components/invoices/invoice-export-modal'
import { mapInvoiceToTemplateData } from '@/lib/invoice-template-registry'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  await requireStaff()
  const resolvedParams = await params

  const invoice = await getInvoice(resolvedParams.id)
  if (!invoice) notFound()

  // Fetch Agency Context for fallback
  const { profile, supabase } = await requireStaff()
  const { data: agency } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', profile.agency_id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const branding = { ...(agency || {}), ...((invoice.branding_snapshot as any) || {}) }

  const payments = await listPayments(invoice.id)

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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || 'USD' }).format(amount)
  }

  const templateData = mapInvoiceToTemplateData(invoice, agency)

  const outstandingBalance = invoice.total - invoice.amount_paid

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Invoice {invoice.number}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusColor(invoice.status)}>{formatStatus(invoice.status)}</Badge>
            <span className="text-sm text-muted-foreground">{invoice.client?.name}</span>
          </div>
        </div>
        <div className='flex gap-2 flex-wrap'>
          <InvoiceExportModal 
            invoiceId={invoice.id} 
            initialTemplateId={invoice.template_id || 'modern-business'}
            templateData={templateData}
          />
          <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
            <Button variant="outline">Edit Invoice</Button>
          </Link>
          {invoice.status === 'draft' && (
            <form action={updateInvoiceStatusAction.bind(null, invoice.id, 'sent')}>
              <Button type="submit">Mark as Sent</Button>
            </form>
          )}
          <form action={deleteInvoiceAction.bind(null, invoice.id)}>
            <Button type="submit" variant="destructive">Delete</Button>
          </form>
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

          <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
            <p className="font-semibold">{branding.legal_name || branding.agency_name || branding.name || 'Our Agency'}</p>
            <p>
              {branding.registration_number && `Reg: ${branding.registration_number} • `}
              {branding.tax_id && `Tax ID: ${branding.tax_id}`}
            </p>
            {branding.default_invoice_footer && (
              <p className="mt-2">{branding.default_invoice_footer}</p>
            )}
            {branding.default_legal_disclaimer && (
              <p className="mt-2 text-xs opacity-70 max-w-xl mx-auto">{branding.default_legal_disclaimer}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Payment</CardTitle>
            </CardHeader>
            <CardContent>
              {outstandingBalance <= 0 ? (
                <div className="text-sm font-medium text-green-600 bg-green-500/10 p-3 rounded-md text-center">
                  Invoice is fully paid.
                </div>
              ) : (
                <form action={recordPaymentAction.bind(null, invoice.id)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" min="0.01" max={outstandingBalance} defaultValue={outstandingBalance} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <select
                      id="method"
                      name="method"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference / Notes</Label>
                    <Input id="reference" name="reference" placeholder="e.g. Wire transaction ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paid_at">Date</Label>
                    <Input id="paid_at" name="paid_at" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <Button type="submit" className="w-full">Record Payment</Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments recorded.</p>
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
                        {payment.reference && (
                          <div className="text-xs text-muted-foreground mt-1">Ref: {payment.reference}</div>
                        )}
                      </div>
                      <form action={deletePaymentAction.bind(null, payment.id, invoice.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="h-8 text-destructive px-2">Void</Button>
                      </form>
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

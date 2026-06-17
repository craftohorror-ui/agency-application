'use client'

import { useState, useActionState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createInvoiceAction, updateInvoiceAction, type InvoiceFormState } from './actions'
import type { InvoiceWithRelations, CreateInvoiceItemInput } from '@/lib/invoices'

interface InvoiceFormProps {
  invoice?: InvoiceWithRelations
  clients: { id: string; name: string; company: string | null }[]
  projects: { id: string; name: string }[]
}

export function InvoiceForm({ invoice, clients, projects }: InvoiceFormProps) {
  const isEditing = !!invoice
  const action = isEditing ? updateInvoiceAction.bind(null, invoice.id) : createInvoiceAction
  const [state, formAction, isPending] = useActionState<InvoiceFormState, FormData>(action, {})

  useEffect(() => {
    if (state?.errors?.server) {
      toast.error(state.errors.server)
    }
  }, [state])

  const [items, setItems] = useState<CreateInvoiceItemInput[]>(
    invoice?.items?.map(i => ({ description: i.description, qty: i.qty, unit_price: i.unit_price })) || []
  )
  const [currency, setCurrency] = useState<string>(invoice?.currency || 'USD')
  const [discountType, setDiscountType] = useState<string>(invoice?.discount_type || 'fixed')
  const [discountValue, setDiscountValue] = useState<number>(invoice?.discount_value || 0)
  const [taxType, setTaxType] = useState<string>(invoice?.tax_type || 'none')
  const [taxRate, setTaxRate] = useState<number>(invoice?.tax_rate || 0)

  const [subtotal, setSubtotal] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0)
    
    let newDiscountAmount = 0
    if (discountType === 'percentage') {
      newDiscountAmount = newSubtotal * (discountValue / 100)
    } else {
      newDiscountAmount = discountValue
    }
    
    const subtotalAfterDiscount = Math.max(0, newSubtotal - newDiscountAmount)
    const newTaxAmount = (subtotalAfterDiscount * taxRate) / 100
    
    setSubtotal(newSubtotal)
    setDiscountAmount(newDiscountAmount)
    setTaxAmount(newTaxAmount)
    setTotal(subtotalAfterDiscount + newTaxAmount)
  }, [items, taxRate, discountType, discountValue])

  const addItem = () => {
    setItems([...items, { description: '', qty: 1, unit_price: 0 }])
  }

  const updateItem = (index: number, field: keyof CreateInvoiceItemInput, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount)
  }

  const handleProjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value
    if (!projectId) return

    try {
      const res = await fetch(`/api/projects/${projectId}/items`)
      if (!res.ok) throw new Error('Failed to fetch items')
      const data = await res.json()
      
      if (!data || data.length === 0) {
        toast('No source line items were found for this project.')
        return
      }

      // Check if current items are anything other than empty defaults
      const hasManualItems = items.some(item => item.description.trim() !== '' || item.unit_price > 0 || item.qty > 1)
      
      if (hasManualItems) {
        const confirmed = window.confirm('This invoice already contains line items.\n\nDo you want to replace them with items from the selected project?')
        if (!confirmed) return
      }

      const mappedItems = data.map((item: any) => ({
        description: item.description,
        qty: Number(item.qty),
        unit_price: Number(item.unit_price)
      }))

      setItems(mappedItems)
      toast.success('Line items loaded from project')
    } catch (error) {
      console.error(error)
      toast.error('Failed to auto-populate project items')
    }
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      {state.errors?.server && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {state.errors.server}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client</Label>
              <select
                id="client_id"
                name="client_id"
                defaultValue={invoice?.client_id || ''}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>Select a client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                ))}
              </select>
              {state.errors?.client_id && <p className="text-sm text-destructive">{state.errors.client_id[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_id">Project (Optional)</Label>
              <select
                id="project_id"
                name="project_id"
                defaultValue={invoice?.project_id || ''}
                onChange={handleProjectChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  name="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template_id">Template</Label>
                <select
                  id="template_id"
                  name="template_id"
                  defaultValue={invoice?.template_id || 'modern-business'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="modern-business">Modern Business</option>
                  <option value="executive-invoice">Executive Invoice</option>
                  <option value="consulting-invoice">Consulting Invoice</option>
                  <option value="marketing-invoice">Marketing Agency</option>
                  <option value="saas-invoice">SaaS Invoice</option>
                  <option value="enterprise-invoice">Enterprise Invoice</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  defaultValue={invoice?.issue_date || new Date().toISOString().split('T')[0]}
                  required
                />
                {state.errors?.issue_date && <p className="text-sm text-destructive">{state.errors.issue_date[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  defaultValue={invoice?.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                />
                {state.errors?.due_date && <p className="text-sm text-destructive">{state.errors.due_date[0]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={invoice?.status || 'draft'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-20 space-y-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addItem} className="w-full mt-4">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Item
            </Button>
            {state.errors?.items && <p className="text-sm text-destructive">{state.errors.items}</p>}

            <div className="mt-8 space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    id="discount_type"
                    name="discount_type"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm text-muted-foreground"
                  >
                    <option value="fixed">Discount ($)</option>
                    <option value="percentage">Discount (%)</option>
                  </select>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-20 h-8"
                  />
                </div>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    id="tax_type"
                    name="tax_type"
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm text-muted-foreground"
                  >
                    <option value="none">No Tax</option>
                    <option value="gst">GST</option>
                    <option value="vat">VAT</option>
                    <option value="custom">Custom</option>
                  </select>
                  {taxType !== 'none' && (
                    <>
                      <Label htmlFor="tax_rate" className="text-muted-foreground ml-2">Rate (%)</Label>
                      <Input
                        id="tax_rate"
                        name="tax_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                    </>
                  )}
                  {taxType === 'none' && (
                    <input type="hidden" name="tax_rate" value="0" />
                  )}
                </div>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={invoice?.notes || ''}
            placeholder="Payment instructions, wire transfer details, or thank you notes..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href="/dashboard/invoices">
          <Button type="button" variant="outline">Cancel</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  )
}

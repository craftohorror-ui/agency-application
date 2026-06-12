'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createProposalAction, updateProposalAction, type ProposalFormState } from './actions'
import type { ProposalWithRelations, CreateProposalItemInput } from '@/lib/proposals'

interface ProposalFormProps {
  proposal?: ProposalWithRelations
  clients: { id: string; name: string }[]
  leads: { id: string; name: string }[]
}

const initialState: ProposalFormState = {}

export function ProposalForm({ proposal, clients, leads }: ProposalFormProps) {
  const [items, setItems] = useState<CreateProposalItemInput[]>(
    proposal?.items?.map(i => ({ description: i.description, qty: i.qty, unit_price: i.unit_price })) || []
  )

  const isEditing = !!proposal
  const action = isEditing ? updateProposalAction.bind(null, proposal.id) : createProposalAction
  
  // Need to bind state properly for Next.js 15 useActionState
  const [state, formAction, pending] = useActionState(action, initialState)

  function addItem() {
    setItems([...items, { description: '', qty: 1, unit_price: 0 }])
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof CreateProposalItemInput, value: string | number) {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const total = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0)

  return (
    <form action={formAction} className='space-y-6'>
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      {state?.errors?.server && (
        <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
          {state.errors.server}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input id='title' name='title' defaultValue={proposal?.title} required />
              {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
            </div>
            
            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <select
                id='status'
                name='status'
                defaultValue={proposal?.status || 'draft'}
                className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value='draft'>Draft</option>
                <option value='sent'>Sent</option>
                <option value='viewed'>Viewed</option>
                <option value='accepted'>Accepted</option>
                <option value='rejected'>Rejected</option>
              </select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='client_id'>Client</Label>
              <select
                id='client_id'
                name='client_id'
                defaultValue={proposal?.client_id || ''}
                className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value=''>-- Select Client --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='lead_id'>Or Lead</Label>
              <select
                id='lead_id'
                name='lead_id'
                defaultValue={proposal?.lead_id || ''}
                className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value=''>-- Select Lead --</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
          {state?.errors?.client_or_lead && <p className="text-sm text-destructive">{state.errors.client_or_lead}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scope & Terms</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='scope'>Scope of Work</Label>
            <Textarea id='scope' name='scope' rows={3} defaultValue={proposal?.scope || ''} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='deliverables'>Deliverables</Label>
            <Textarea id='deliverables' name='deliverables' rows={3} defaultValue={proposal?.deliverables || ''} />
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='timeline'>Timeline</Label>
              <Input id='timeline' name='timeline' defaultValue={proposal?.timeline || ''} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='terms'>Payment Terms</Label>
              <Input id='terms' name='terms' defaultValue={proposal?.terms || ''} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
              No line items added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Description" 
                    value={item.description} 
                    onChange={e => updateItem(index, 'description', e.target.value)} 
                    required
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="Qty" 
                    value={item.qty} 
                    onChange={e => updateItem(index, 'qty', parseInt(e.target.value) || 0)} 
                    required
                    className="w-20"
                  />
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="Price" 
                    value={item.unit_price} 
                    onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)} 
                    required
                    className="w-32"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="text-right pt-4 border-t font-bold text-lg">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          )}
          {state?.errors?.items && <p className="text-sm text-destructive">{state.errors.items}</p>}
        </CardContent>
      </Card>

      <div className='flex justify-end gap-4'>
        <Link href={isEditing ? `/dashboard/proposals/${proposal.id}` : '/dashboard/proposals'}>
          <Button variant='outline' type='button'>Cancel</Button>
        </Link>
        <Button type='submit' disabled={pending}>
          {pending ? 'Saving...' : isEditing ? 'Update Proposal' : 'Create Proposal'}
        </Button>
      </div>
    </form>
  )
}

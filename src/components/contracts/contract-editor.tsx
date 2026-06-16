'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateContractBodyAction } from '@/app/dashboard/contracts/actions'

interface ContractEditorProps {
  contractId: string
  initialBody: string
}

export function ContractEditor({ contractId, initialBody }: ContractEditorProps) {
  const [body, setBody] = useState(initialBody)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('body', body)
        const res = await updateContractBodyAction(contractId, formData)
        
        if (res?.error) {
          toast.error(res.error)
          return
        }

        toast.success('Contract saved successfully. Version updated.')
        router.refresh()
      } catch (error: unknown) {
        console.error('Save error:', error)
        toast.error(error instanceof Error ? error.message : 'Unable to save contract changes.')
      }
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <Textarea 
        name="body" 
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-[500px] font-mono text-sm" 
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save Changes & Bump Version'}
        </Button>
      </div>
    </form>
  )
}

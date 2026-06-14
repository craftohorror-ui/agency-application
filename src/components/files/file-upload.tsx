'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadFileAction } from '@/app/dashboard/files/actions'

import { toast } from 'sonner'

export function FileUpload({ 
  projectId, 
  clientId, 
  leadId 
}: { 
  projectId?: string, 
  clientId?: string, 
  leadId?: string 
}) {
  const [isUploading, setIsUploading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file') as File
    const displayName = formData.get('display_name') as string

    if (!displayName || displayName.trim().length === 0) {
      return toast.error('Document Name is required.')
    }
    if (displayName.length > 100) {
      return toast.error('Document Name must be 100 characters or less.')
    }

    if (!file || file.size === 0) return toast.error('Please select a file.')

    const MAX_FILE_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return toast.error('File size exceeds the 50 MB upload limit.')
    }

    const allowedExtensions = ['pdf', 'doc', 'docx', 'xlsx', 'csv', 'png', 'jpg', 'jpeg', 'zip']
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !allowedExtensions.includes(ext)) {
      return toast.error('Unsupported file type. Please upload a valid document or image.')
    }

    setIsUploading(true)
    console.log('[FileUpload] Starting upload process...')
    try {
      console.log('[FileUpload] Calling uploadFileAction(formData)')
      const res = await uploadFileAction(formData)
      console.log('[FileUpload] Action returned successfully.')
      console.log('[FileUpload] typeof res:', typeof res)
      console.log('[FileUpload] Raw return value:', res)
      console.log('[FileUpload] JSON.stringify(res):', JSON.stringify(res))

      if (res && typeof res === 'object' && res.error) {
        console.error('[FileUpload] Server Action returned an error:', res.error)
        toast.error(res.error)
        window.alert(`Server Action Error: ${res.error}`)
      } else if (res && typeof res === 'object' && res.success) {
        toast.success('File uploaded successfully.')
        formRef.current?.reset()
      } else {
        console.error('[FileUpload] Unknown response shape:', res)
        toast.error('Unknown response shape received.')
        window.alert(`Unknown response shape: ${JSON.stringify(res)}`)
      }
    } catch (error: unknown) {
      console.error('[FileUpload] Caught exception during uploadFileAction call:', error)
      console.error('[FileUpload] typeof error:', typeof error)
      console.error('[FileUpload] JSON.stringify(error):', JSON.stringify(error, Object.getOwnPropertyNames(error)))
      
      const msg = error instanceof Error ? error.message : String(error)
      toast.error(`Upload crashed: ${msg}`)
      window.alert(`Upload crashed (Promise Rejected): \n\n${msg}\n\nFull error object: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {projectId && <input type="hidden" name="projectId" value={projectId} />}
          {clientId && <input type="hidden" name="clientId" value={clientId} />}
          {leadId && <input type="hidden" name="leadId" value={leadId} />}
          
          <div className="space-y-2">
            <Label htmlFor="display_name">Document Name</Label>
            <Input 
              id="display_name" 
              name="display_name" 
              type="text" 
              placeholder="e.g. Website Contract - Acme Corp"
              maxLength={100}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input id="file" name="file" type="file" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <select 
              id="folder" 
              name="folder" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="assets"
              required
            >
              <option value="assets">Assets</option>
              <option value="contracts">Contracts</option>
              <option value="invoices">Invoices</option>
              <option value="deliverables">Deliverables</option>
              <option value="client_files">Client Files</option>
            </select>
          </div>

          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

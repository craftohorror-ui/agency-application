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
    if (!file || file.size === 0) return toast.error('Please select a file')

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
    try {
      const res = await uploadFileAction(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('File uploaded successfully')
        formRef.current?.reset()
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.')
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
            >
              <option value="assets">Assets</option>
              <option value="contracts">Contracts</option>
              <option value="invoices">Invoices</option>
              <option value="deliverables">Deliverables</option>
              <option value="client_files">Client Files</option>
            </select>
          </div>

          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

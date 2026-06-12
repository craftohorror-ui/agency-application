'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteFileAction, getDownloadUrlAction } from '@/app/dashboard/files/actions'
import type { FileRecord } from '@/lib/types'

export function FileList({ files }: { files: (FileRecord & { uploader?: { full_name: string } })[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this file?')) return
    setIsDeleting(id)
    const res = await deleteFileAction(id)
    setIsDeleting(null)
    if (res?.error) alert(res.error)
  }

  async function handleDownload(storagePath: string) {
    const res = await getDownloadUrlAction(storagePath)
    if (res?.error) {
      alert(res.error)
    } else if (res?.url) {
      window.open(res.url, '_blank')
    }
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <p className="text-muted-foreground mt-4">No files uploaded yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Folder</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Uploaded By</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium truncate max-w-[200px]" title={file.name}>
                    {file.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize">{file.folder.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {file.size_bytes ? formatBytes(file.size_bytes) : '-'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {file.uploader?.full_name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(file.storage_path)}>
                      Download
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      disabled={isDeleting === file.id}
                      onClick={() => handleDelete(file.id)}
                    >
                      {isDeleting === file.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { deleteFileAction, getDownloadUrlAction } from '@/app/dashboard/files/actions'
import type { FileRecord } from '@/lib/types'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

interface FileListProps {
  files: (FileRecord & { uploader?: { full_name: string } })[]
  counts: Record<string, number>
  totalCount: number
  currentPage: number
  limit: number
}

export function FileList({ files, counts, totalCount, currentPage, limit }: FileListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')

  const currentFolder = searchParams.get('folder') || 'all'
  const currentSort = searchParams.get('sortBy') || 'newest'

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== (searchParams.get('query') || '')) {
        updateFilters({ query: searchQuery })
      }
    }, 300)
    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchParams])

  function updateFilters(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    if (!('page' in updates)) {
      params.delete('page')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this file?')) return
    setIsDeleting(id)
    try {
      const res = await deleteFileAction(id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('File deleted successfully.')
      }
    } catch {
      toast.error('An error occurred during deletion.')
    } finally {
      setIsDeleting(null)
    }
  }

  async function handleDownload(file: FileRecord, isView = false) {
    let viewMode = isView
    
    if (viewMode) {
      const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif']
      const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif']
      
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const mime = file.mime_type || ''
      
      const isMimeAllowed = allowedMimes.includes(mime)
      const isExtAllowed = allowedExts.includes(ext)
      
      if (!isMimeAllowed || !isExtAllowed) {
        toast.info('This file type cannot be previewed. Downloading instead.')
        viewMode = false
      }
    }

    const res = await getDownloadUrlAction(file.id, viewMode)
    if (res?.error) {
      toast.error(res.error)
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

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Uploaded Files</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files..."
                className="pl-8 w-full sm:w-[200px] lg:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={currentSort} onValueChange={(val) => updateFilters({ sortBy: val })}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="size-desc">Largest Size</SelectItem>
                <SelectItem value="size-asc">Smallest Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant={currentFolder === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => updateFilters({ folder: null })}
          >
            All Files ({counts.all || 0})
          </Button>
          <Button 
            variant={currentFolder === 'assets' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => updateFilters({ folder: 'assets' })}
          >
            Assets ({counts.assets || 0})
          </Button>
          <Button 
            variant={currentFolder === 'contracts' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => updateFilters({ folder: 'contracts' })}
          >
            Contracts ({counts.contracts || 0})
          </Button>
          <Button 
            variant={currentFolder === 'invoices' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => updateFilters({ folder: 'invoices' })}
          >
            Invoices ({counts.invoices || 0})
          </Button>
          <Button 
            variant={currentFolder === 'deliverables' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => updateFilters({ folder: 'deliverables' })}
          >
            Deliverables ({counts.deliverables || 0})
          </Button>
          <Button 
            variant={currentFolder === 'client_files' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => updateFilters({ folder: 'client_files' })}
          >
            Client Files ({counts.client_files || 0})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mt-4 text-center">
              {searchQuery || currentFolder !== 'all' 
                ? "No files match your search or folder filter." 
                : "No files uploaded yet.\nUpload your first document to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Document Name</th>
                  <th className="px-4 py-3 font-medium">Folder</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Uploaded By</th>
                  <th className="px-4 py-3 font-medium">Upload Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium max-w-[250px]">
                      <div className="truncate" title={file.display_name}>{file.display_name}</div>
                      {file.display_name !== file.name && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5" title={file.name}>
                          {file.name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="capitalize">{file.folder.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {file.size_bytes ? formatBytes(file.size_bytes) : '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {file.uploader?.full_name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(file.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(file, true)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(file, false)}>
                        Download
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        disabled={isDeleting === file.id}
                        onClick={() => handleDelete(file.id)}
                      >
                        {isDeleting === file.id ? '...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} files
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage <= 1}
                onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage >= totalPages}
                onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

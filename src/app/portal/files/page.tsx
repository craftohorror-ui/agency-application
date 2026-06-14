import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileIcon, DownloadIcon } from 'lucide-react'
import { listPortalFiles } from '@/lib/portal'
import { downloadPortalFileAction } from './actions'

type SearchParams = {
  search?: string | string[]
}

type PortalFilesPageProps = {
  searchParams?: Promise<SearchParams>
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function formatBytes(bytes: number | null) {
  if (bytes === null) return 'Unknown size'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateStr))
}

export default async function PortalFilesPage({ searchParams }: PortalFilesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const search = getSingleValue(resolvedSearchParams.search)?.trim() ?? ''

  const files = await listPortalFiles(search)

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Files & Assets</h1>
          <p className='text-sm text-muted-foreground'>
            Access deliverables, contracts, and uploaded assets.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className='gap-3'>
          <CardTitle>File Directory</CardTitle>
          <form className='flex gap-3'>
            <Input
              type='search'
              name='search'
              defaultValue={search}
              placeholder='Search files by name...'
              className='max-w-sm'
            />
            <Button type='submit'>Search</Button>
          </form>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className='flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center'>
              <p className='text-base font-medium'>No files found.</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                {search ? 'Try adjusting your search query.' : 'You have no files available.'}
              </p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <div className='grid grid-cols-12 border-b bg-muted/50 px-4 py-3 text-sm font-medium'>
                <div className='col-span-6 md:col-span-5'>File Name</div>
                <div className='hidden md:block md:col-span-3'>Type / Size</div>
                <div className='col-span-4 md:col-span-3'>Date Added</div>
                <div className='col-span-2 md:col-span-1 text-right'>Action</div>
              </div>
              <div className='divide-y'>
                {files.map((file) => (
                  <div key={file.id} className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
                    <div className='col-span-6 md:col-span-5 flex items-center gap-3 pr-4'>
                      <FileIcon className='h-5 w-5 shrink-0 text-muted-foreground' />
                      <span className='truncate font-medium' title={file.name}>{file.name}</span>
                    </div>
                    <div className='hidden md:block md:col-span-3 text-muted-foreground truncate pr-4'>
                      {file.mime_type || 'Unknown'} &bull; {formatBytes(file.size_bytes)}
                    </div>
                    <div className='col-span-4 md:col-span-3 text-muted-foreground'>
                      {formatDate(file.created_at)}
                    </div>
                    <div className='col-span-2 md:col-span-1 text-right'>
                      <form action={downloadPortalFileAction.bind(null, file.id)}>
                        <Button variant='ghost' size='icon' type='submit' title='Download or Preview'>
                          <DownloadIcon className='h-4 w-4' />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

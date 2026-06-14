import { listFiles, getFileCounts } from '@/lib/files'
import { FileList } from '@/components/files/file-list'
import { FileUpload } from '@/components/files/file-upload'

export default async function FilesPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  const query = typeof params.query === 'string' ? params.query : undefined
  const folder = typeof params.folder === 'string' ? params.folder : undefined
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy : undefined
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  
  const limit = 25

  const { data: files, count: totalCount } = await listFiles({
    query,
    folder,
    sortBy,
    page,
    limit
  })

  const counts = await getFileCounts()

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Files</h1>
        <p className='text-sm text-muted-foreground'>Manage agency assets and documents.</p>
      </div>

      <div className='grid gap-6 md:grid-cols-[1fr_300px]'>
        <div className='space-y-6'>
          <FileList 
            files={files as unknown as Parameters<typeof FileList>[0]['files']} 
            counts={counts}
            totalCount={totalCount || 0}
            currentPage={page}
            limit={limit}
          />
        </div>
        <div className='space-y-6'>
          <FileUpload />
        </div>
      </div>
    </div>
  )
}

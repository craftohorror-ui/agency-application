import { listFiles } from '@/lib/files'
import { FileList } from '@/components/files/file-list'
import { FileUpload } from '@/components/files/file-upload'

export default async function FilesPage() {
  const files = await listFiles()

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Files</h1>
        <p className='text-sm text-muted-foreground'>Manage agency assets and documents.</p>
      </div>

      <div className='grid gap-6 md:grid-cols-[1fr_300px]'>
        <div className='space-y-6'>
          <FileList files={files as unknown as Parameters<typeof FileList>[0]['files']} />
        </div>
        <div className='space-y-6'>
          <FileUpload />
        </div>
      </div>
    </div>
  )
}

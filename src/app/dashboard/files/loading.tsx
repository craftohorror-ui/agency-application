
export default function FilesLoading() {
  return (
    <div className='space-y-8 animate-pulse'>
      <div>
        <div className='h-9 w-32 bg-muted rounded mb-2'></div>
        <div className='h-5 w-64 bg-muted rounded'></div>
      </div>
      <div className='grid gap-6 md:grid-cols-[1fr_300px]'>
        <div className='h-96 bg-muted rounded'></div>
        <div className='h-80 bg-muted rounded'></div>
      </div>
    </div>
  )
}

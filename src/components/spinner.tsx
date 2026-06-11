import { Loader2 } from 'lucide-react'

export function Spinner() {
  return (
    <div className='flex h-40 items-center justify-center'>
      <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
    </div>
  )
}

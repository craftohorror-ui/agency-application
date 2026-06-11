'use client'

import { Button } from '@/components/ui/button'

export default function PortalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className='flex h-60 flex-col items-center justify-center gap-3'>
      <p className='text-sm text-muted-foreground'>Failed to load this section.</p>
      <Button variant='outline' size='sm' onClick={reset}>
        Retry
      </Button>
    </div>
  )
}

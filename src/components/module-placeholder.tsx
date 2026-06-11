import { Card, CardContent } from '@/components/ui/card'

export function ModulePlaceholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
      <Card>
        <CardContent className='flex h-40 items-center justify-center p-6'>
          <p className='text-sm text-muted-foreground'>
            {title} module ships in {phase}.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

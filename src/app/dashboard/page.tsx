import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold tracking-tight'>Overview</h1>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {['Revenue', 'Active Projects', 'Open Leads', 'Outstanding'].map((label) => (
          <Card key={label}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>-</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className='text-sm text-muted-foreground'>Business modules arrive in Phase 1.</p>
    </div>
  )
}

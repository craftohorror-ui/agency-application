import Link from 'next/link'
import { getLeadOwnersQuery, getLeadStageOptions } from '@/app/dashboard/leads/queries'
import { LeadForm } from '@/app/dashboard/leads/lead-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewLeadPage() {
  const owners = await getLeadOwnersQuery()
  const stageOptions = getLeadStageOptions()

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Create Lead</h1>
          <p className='text-sm text-muted-foreground'>
            Add a new lead to the pipeline using the existing sales workflow.
          </p>
        </div>
        <Link
          href='/dashboard/leads'
          className='inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted'
        >
          Back to leads
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm owners={owners} stageOptions={stageOptions} />
        </CardContent>
      </Card>
    </div>
  )
}

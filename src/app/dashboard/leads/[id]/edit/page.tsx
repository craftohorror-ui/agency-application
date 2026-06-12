import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getLeadQuery,
  getLeadOwnersQuery,
  getLeadStageOptions,
} from '@/app/dashboard/leads/queries'
import { LeadForm } from '@/app/dashboard/leads/lead-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditLeadPage({ params }: PageProps) {
  const resolvedParams = await params
  const lead = await getLeadQuery(resolvedParams.id)

  if (!lead) {
    notFound()
  }

  const owners = await getLeadOwnersQuery()
  const stageOptions = getLeadStageOptions()

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Lead</h1>
          <p className='text-sm text-muted-foreground'>
            Update details for {lead.name}.
          </p>
        </div>
        <Link
          href={`/dashboard/leads/${lead.id}`}
          className='inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted'
        >
          Back to lead
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm owners={owners} stageOptions={stageOptions} lead={lead} />
        </CardContent>
      </Card>
    </div>
  )
}

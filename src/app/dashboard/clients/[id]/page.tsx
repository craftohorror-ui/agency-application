import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getClientQuery } from '@/app/dashboard/clients/queries'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const client = await getClientQuery(resolvedParams.id)

  if (!client) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/clients">
            <Button variant="outline">Back to Clients</Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/clients/${client.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div>{client.email || '-'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div>{client.phone || '-'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Company</div>
              <div>{client.company || '-'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Website</div>
              <div>
                {client.website ? (
                  <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {client.website}
                  </a>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Address</div>
              <div className="whitespace-pre-wrap">{client.address || '-'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Industry</div>
              <div>{client.industry || '-'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Notes</div>
              <div className="whitespace-pre-wrap">{client.notes || '-'}</div>
            </div>
            {client.lead && (
              <div className="mt-4 rounded-md border p-4 bg-muted/50">
                <div className="text-sm font-medium text-muted-foreground mb-2">Original Lead</div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{client.lead.name}</span>
                  <Badge variant="outline">{client.lead.stage}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Created on {new Date(client.lead.created_at).toLocaleDateString()}
                </div>
                <div className="mt-3">
                  <Link href={`/dashboard/leads/${client.lead.id}`}>
                    <Button variant="outline" size="sm">View Lead</Button>
                  </Link>
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-muted-foreground">Client Since</div>
              <div>{new Date(client.created_at).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p>Timeline feature is under construction.</p>
            <p className="text-sm mt-2">Activity history and notes will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

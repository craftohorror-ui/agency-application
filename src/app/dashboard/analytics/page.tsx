import { requireOwner } from '@/lib/auth'
import { ModulePlaceholder } from '@/components/module-placeholder'

export default async function AnalyticsPage() {
  await requireOwner()
  return <ModulePlaceholder title='Analytics' phase='Phase 9' />
}

import { requireOwner } from '@/lib/auth'
import { ModulePlaceholder } from '@/components/module-placeholder'

export default async function AdminPage() {
  await requireOwner()
  return <ModulePlaceholder title='Admin' phase='Phase 10' />
}

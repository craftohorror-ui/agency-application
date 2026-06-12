import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export async function insertAuditLog(
  actorId: string,
  action: string,
  entityType: string,
  entityId: string | null = null,
  metadata: Record<string, unknown> = {}
) {
  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase.from('audit_logs').insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  })

  if (error) {
    console.error('Failed to insert audit log:', error.message)
    // We intentionally don't throw to prevent breaking the main transaction, 
    // but in a strict compliance environment, we might want to throw.
  }
}

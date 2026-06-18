import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

/**
 * Asserts that a resource belongs to the same agency as the requesting user.
 *
 * Call this BEFORE serving any resource fetched via createAdminClient() to prevent
 * cross-tenant IDOR (Insecure Direct Object Reference) attacks.
 *
 * @param resourceAgencyId - The agency_id column value of the fetched resource
 * @param profile - The authenticated user's profile (from requireStaff())
 * @throws {Error} Access denied — if agency IDs do not match
 */
export function assertAgencyAccess(resourceAgencyId: string, profile: Profile): void {
  if (resourceAgencyId !== profile.agency_id) {
    throw new Error('Access denied: resource does not belong to your agency')
  }
}

/**
 * Asserts that the requesting user has access to a specific project.
 *
 * - Owners: pass immediately — they have access to all agency projects.
 * - Members: must be listed in project_members for the given project_id.
 *
 * Validation chain:
 *   1. User is authenticated (enforced upstream by requireStaff())
 *   2. Project is in the same agency (enforced by RLS on the supabase client)
 *   3. Member is assigned to the project via project_members
 *
 * @param supabase  - Authenticated Supabase client (from requireStaff())
 * @param profile   - The authenticated user's profile (from requireStaff())
 * @param projectId - The project UUID to validate access for
 * @throws {Error} Access denied — if member is not assigned to the project
 */
export async function assertProjectAccess(
  supabase: SupabaseClient,
  profile: Profile,
  projectId: string
): Promise<void> {
  // Owners have access to all projects within their agency (enforced by DB RLS)
  if (profile.role === 'owner') return

  // Members must be explicitly assigned via project_members
  const { data: membership, error } = await supabase
    .from('project_members')
    .select('profile_id')
    .eq('project_id', projectId)
    .eq('profile_id', profile.id)
    .maybeSingle()

  if (error) throw new Error('Failed to verify project access')
  if (!membership) throw new Error('Access denied: you are not a member of this project')
}

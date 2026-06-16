import 'server-only'

import { requireStaff } from '@/lib/auth'
import type { Agency } from '@/lib/types'
import { unstable_cache } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// We need a way to cache the branding fetch to prevent N+1 queries during document rendering.
// Since `requireStaff` gets the current agency implicitly, we can cache based on agency_id.
// However, unstable_cache requires a standalone fetch function.
export async function getAgencyBranding(agencyId: string): Promise<Agency> {
  // Using unstable_cache to prevent large DB lookups
  const getCachedBranding = unstable_cache(
    async (id: string) => {
      // Need an admin or anonymous client just to fetch by ID since we don't have request context in cache
      // Wait, we can just use an admin client, or rely on RLS. If we use RLS, we need the user's token.
      // Since branding is tied to the agency and used for document rendering, we can use the admin client.
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const adminSupabase = createAdminClient()
      const { data, error } = await adminSupabase
        .from('agencies')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) throw new Error(error.message)
      if (!data) throw new Error('Agency branding not found.')
      return data as Agency
    },
    ['agency-branding', agencyId],
    {
      tags: [`agency-${agencyId}`],
      revalidate: 3600 // 1 hour
    }
  )

  return getCachedBranding(agencyId)
}

export async function getCurrentAgencySettings(): Promise<Agency> {
  const { profile } = await requireStaff()
  const agencyId = profile.agency_id

  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from('agencies')
    .select('*')
    .eq('id', agencyId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    const err = new Error('Agency profile not found. Please contact support to restore your agency record.')
    throw err
  }

  return data as Agency
}

export type AgencyUpdateInput = Partial<Omit<Agency, 'id' | 'created_at'>>

export async function updateAgencySettings(input: AgencyUpdateInput): Promise<Agency> {
  const { profile } = await requireStaff()
  const agencyId = profile.agency_id

  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from('agencies')
    .update(input)
    .eq('id', agencyId)
    .select('*')
    .maybeSingle()

  if (error) throw new Error(error.message)
  
  if (!data) {
    throw new Error('Agency profile not found. Update failed.')
  }

  // Revalidate cache tag
  const { revalidateTag } = await import('next/cache')
  revalidateTag(`agency-${agencyId}`)

  return data as Agency
}

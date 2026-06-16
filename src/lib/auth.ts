import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

export async function getProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  console.log('[DEBUG AUTH] getProfile() result:', {
    authUserId: user.id,
    authUserEmail: user.email,
    profileIdLoaded: profile?.id,
    profileEmailLoaded: profile?.email,
    profileAgencyIdLoaded: profile?.agency_id
  })

  if (!profile || profile.is_suspended) redirect('/login')
  return { supabase, user, profile }
}

export async function requireStaff() {
  const ctx = await getProfile()
  if (ctx.profile.role === 'client') redirect('/portal')
  return ctx
}

export async function requireOwner() {
  const ctx = await getProfile()
  if (ctx.profile.role !== 'owner') redirect('/dashboard')
  return ctx
}

export async function requireClient() {
  const ctx = await getProfile()
  if (ctx.profile.role !== 'client') redirect('/dashboard')
  return ctx
}

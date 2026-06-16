'use server'

import { requireStaff } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { updateTeamMember, TeamUpdateInput } from '@/lib/team'
import { updateAgencySettings, AgencyUpdateInput } from '@/lib/agencies'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Update Personal Profile
export async function updateProfile(formData: FormData) {
  const { profile } = await requireStaff()
  
  const full_name = formData.get('full_name') as string
  const title = formData.get('title') as string
  const phone = formData.get('phone') as string
  const bio = formData.get('bio') as string

  // We need to support avatar_url somehow. We can either do it via client-side upload and pass URL,
  // or upload here. Usually client-side is better for progress bars, but we can accept `avatar_url` text for now.
  const avatar_url = formData.get('avatar_url') as string | null

  try {
    // We will augment `updateTeamMember` to support `phone` and `bio` and `avatar_url` 
    // but wait, `TeamUpdateInput` doesn't have them yet. Let's update `src/lib/team.ts` in a separate step.
    const input: TeamUpdateInput = {
      full_name,
      title,
      phone,
      bio
    }
    if (avatar_url !== null) {
      input.avatar_url = avatar_url
    }

    await updateTeamMember(profile.id, input)
    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'An error occurred' }
  }
}

// Update Agency
export async function saveAgencySettings(formData: FormData) {
  await requireStaff() // Ensure they are staff

  const keys = [
    'name', 'legal_name', 'registration_number', 'tax_id',
    'website', 'linkedin_url', 'instagram_url', 'facebook_url',
    'logo_url', 'logo_dark_url', 'tagline',
    'primary_color', 'secondary_color', 'accent_color',
    'default_proposal_footer', 'default_contract_footer', 'default_invoice_footer',
    'terms_and_conditions', 'privacy_policy', 'email_signature',
    'timezone', 'default_currency', 'default_legal_disclaimer'
  ]

  const payload: Record<string, unknown> = {}

  for (const key of keys) {
    const val = formData.get(key)
    if (val !== null) {
      payload[key] = val.toString().trim() || null
    }
  }

  // Handle defaults that shouldn't be null
  if (payload.name === null) delete payload.name // can't be null
  if (payload.timezone === null) payload.timezone = 'UTC'
  if (payload.default_currency === null) payload.default_currency = 'USD'

  try {
    await updateAgencySettings(payload as AgencyUpdateInput)
    revalidatePath('/dashboard/settings/agency')
    return { success: true }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'An error occurred' }
  }
}

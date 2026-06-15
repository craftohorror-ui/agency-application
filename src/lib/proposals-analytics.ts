import { createAdminClient } from './supabase/admin'
import { createClient } from './supabase/server'
import { randomBytes, createHash } from 'crypto'

export async function generatePublicLink(proposalId: string, name?: string, expiresInDays: number = 30) {
  const supabase = await createClient()
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  // RLS ensures the user can only insert if they own the proposal's agency
  const { data: proposal } = await supabase
    .from('proposals')
    .select('agency_id')
    .eq('id', proposalId)
    .single()

  if (!proposal) throw new Error('Proposal not found')

  const { data, error } = await supabase
    .from('proposal_public_links')
    .insert({
      proposal_id: proposalId,
      agency_id: proposal.agency_id,
      token,
      name: name || null,
      expires_at: expiresAt.toISOString(),
      is_active: true
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function revokePublicLink(linkId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('proposal_public_links')
    .update({ is_active: false })
    .eq('id', linkId)

  if (error) throw new Error(error.message)
  return true
}

export async function getProposalFromToken(token: string) {
  const admin = createAdminClient()

  // 1. Validate the link using service_role
  const { data: link, error: linkError } = await admin
    .from('proposal_public_links')
    .select('id, proposal_id, is_active, expires_at, agency_id')
    .eq('token', token)
    .single()

  if (linkError || !link) throw new Error('Invalid or revoked link')

  if (!link.is_active) throw new Error('Link has been revoked')
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    throw new Error('Link has expired')
  }

  // 2. Update last accessed
  await admin.from('proposal_public_links').update({ last_accessed_at: new Date().toISOString() }).eq('id', link.id)

  // 3. Fetch ONLY the fields strictly needed for the template.
  const { data: proposal, error: propError } = await admin
    .from('proposals')
    .select(`
      title, scope, deliverables, timeline, terms, amount, template_id,
      items:proposal_items ( id, description, qty, unit_price ),
      client:clients ( name, company )
    `)
    .eq('id', link.proposal_id)
    .single()

  if (propError || !proposal) throw new Error('Proposal not found')

  const { data: agency } = await admin
    .from('agencies')
    .select('name')
    .eq('id', link.agency_id)
    .single()

  return { link, proposal, agencyName: agency?.name }
}

export async function initializeProposalSession(linkId: string, proposalId: string, agencyId: string, ip: string, userAgent: string) {
  const admin = createAdminClient()
  
  // 1. Security Check: Ensure the link is still active and not expired before initializing
  const { data: link, error: linkError } = await admin
    .from('proposal_public_links')
    .select('is_active, expires_at')
    .eq('id', linkId)
    .single()

  if (linkError || !link) throw new Error('Invalid link')
  if (!link.is_active) throw new Error('Cannot initialize session for a revoked link')
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    throw new Error('Cannot initialize session for an expired link')
  }

  // 2. Proceed with Session Creation
  const salt = process.env.ANALYTICS_SALT || 'agencyos-secure-salt'
  const viewerHash = createHash('sha256').update(ip + userAgent + salt).digest('hex')

  let deviceType = 'desktop'
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobi')) deviceType = 'mobile'
  if (ua.includes('ipad') || ua.includes('tablet')) deviceType = 'tablet'

  const { data, error } = await admin
    .from('proposal_sessions')
    .insert({
      link_id: linkId,
      proposal_id: proposalId,
      agency_id: agencyId,
      viewer_ip_hash: viewerHash,
      viewer_user_agent: userAgent,
      device_type: deviceType,
      duration_seconds: 0,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data.id
}

export async function recordHeartbeat(sessionId: string) {
  const admin = createAdminClient()
  
  const { data: session } = await admin
    .from('proposal_sessions')
    .select('last_active_at, duration_seconds')
    .eq('id', sessionId)
    .single()

  if (!session) return false

  const now = new Date()
  const lastActive = new Date(session.last_active_at)
  const diffSeconds = Math.floor((now.getTime() - lastActive.getTime()) / 1000)

  if (diffSeconds >= 8) {
    const increment = Math.min(diffSeconds, 15) // Max 15s granted per ping
    
    await admin
      .from('proposal_sessions')
      .update({
        duration_seconds: session.duration_seconds + increment,
        last_active_at: now.toISOString()
      })
      .eq('id', sessionId)
  }

  return true
}

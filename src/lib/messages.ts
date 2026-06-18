import 'server-only'
import { requireStaff } from '@/lib/auth'

/**
 * Verifies the authenticated user is a participant of the given conversation.
 * Returns true if verified, throws an unauthorized error if not.
 *
 * H-6 FIX: This guard must be called before reading OR writing any conversation data.
 * Satisfies the four-condition check:
 *   1. User is authenticated  (enforced by requireStaff caller)
 *   2. User belongs to conversation  (checked here)
 *   3. Same agency  (enforced by Supabase RLS on conversations table)
 *   4. Has access  (combination of 1-3)
 */
async function assertConversationParticipant(
  supabase: Awaited<ReturnType<typeof requireStaff>>['supabase'],
  conversationId: string,
  userId: string
): Promise<void> {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('profile_id')
    .eq('conversation_id', conversationId)
    .eq('profile_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Access denied: you are not a participant of this conversation')
}

export async function listAgencyConversations() {
  const { supabase, user } = await requireStaff()
  
  const { data, error } = await supabase
    .from('agency_conversations_with_unreads')
    .select('*')
    .eq('participant_id', user.id)
    .order('last_message_created_at', { ascending: false, nullsFirst: false })
    
  if (error) {
    // If the view doesn't exist yet, fallback to conversations table
    if (error.code === '42P01') {
      const { data: convs, error: convError } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants!inner(profile_id)')
        // H-6 FIX: Scope list to only conversations the user is a participant of
        .eq('conversation_participants.profile_id', user.id)
        .order('created_at', { ascending: false })
      if (convError) throw new Error(convError.message)
      return convs.map(c => ({
        ...c,
        participant_id: user.id,
        unread_count: 0,
        last_message_body: null,
        last_message_created_at: c.created_at,
        participants: (c.participants as { profile_id: string }[]).map(p => p.profile_id)
      }))
    }
    throw new Error(error.message)
  }
  
  return data
}

export async function getAgencyConversationMessages(conversationId: string) {
  const { supabase, user } = await requireStaff()

  // H-6 FIX: Verify the user is a participant before returning any messages.
  await assertConversationParticipant(supabase, conversationId, user.id)
  
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles(id, full_name, avatar_url, role)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function getOrCreatePrivateChat(memberId: string) {
  const { supabase, user, profile } = await requireStaff()

  // H-6 FIX: Validate that the target member exists within the same agency.
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('id, agency_id')
    .eq('id', memberId)
    .eq('agency_id', profile.agency_id)
    .maybeSingle()

  if (!targetProfile) {
    throw new Error('Access denied: target member not found in your agency')
  }

  // Find if private chat already exists between these two specific users
  const { data: existingConvs, error: existingError } = await supabase
    .from('conversations')
    .select('id, type, participants:conversation_participants!inner(profile_id)')
    .eq('type', 'private')
    // Only conversations the current user is a participant of
    .eq('conversation_participants.profile_id', user.id)
  
  if (existingError) {
    throw new Error(existingError.message || JSON.stringify(existingError))
  }

  // Find a conversation that also includes the target member
  const existingChat = existingConvs?.find(c => {
    const pIds = (c.participants as { profile_id: string }[]).map(p => p.profile_id)
    return pIds.includes(user.id) && pIds.includes(memberId) && pIds.length === 2
  })

  if (existingChat) {
    return existingChat.id
  }

  const newConversationId = crypto.randomUUID()

  const { error: createError } = await supabase
    .from('conversations')
    .insert({
      id: newConversationId,
      type: 'private',
      title: 'Private Chat',
      is_default: false
    })

  if (createError) {
    throw new Error(createError.message || JSON.stringify(createError))
  }

  // Add both participants
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: newConversationId, profile_id: user.id },
      { conversation_id: newConversationId, profile_id: memberId }
    ])

  if (partError) {
    throw new Error(partError.message || JSON.stringify(partError))
  }

  return newConversationId
}

export async function addMemberToDefaultGroup(profileId: string, agencyId: string) {
  const { supabase } = await requireStaff()

  // Find default group scoped to the agency
  const { data: group } = await supabase
    .from('conversations')
    .select('id')
    .eq('agency_id', agencyId)
    .eq('is_default', true)
    .single()

  if (group) {
    await supabase
      .from('conversation_participants')
      .insert({ conversation_id: group.id, profile_id: profileId })
      // Ignore if already joined
  }
}

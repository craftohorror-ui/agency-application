import 'server-only'
import { requireStaff } from '@/lib/auth'

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
        .select('*, participants:conversation_participants(profile:profiles(id, full_name, avatar_url, role))')
        .order('created_at', { ascending: false })
      if (convError) throw new Error(convError.message)
      return convs.map(c => ({
        ...c,
        participant_id: user.id,
        unread_count: 0,
        last_message_body: null,
        last_message_created_at: c.created_at,
        participants: c.participants.map((p: { profile: unknown }) => p.profile)
      }))
    }
    throw new Error(error.message)
  }
  
  return data
}

export async function getAgencyConversationMessages(conversationId: string) {
  const { supabase } = await requireStaff()
  
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles(id, full_name, avatar_url, role)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function getOrCreatePrivateChat(memberId: string) {
  const { supabase, user } = await requireStaff()

  // Find if private chat already exists
  const { data: existingConvs, error: existingError } = await supabase
    .from('conversations')
    .select('id, type, participants:conversation_participants!inner(profile_id)')
    .eq('type', 'private')
  
  if (existingError) throw new Error(existingError.message)

  // We filter in memory since Supabase JS filtering on nested inner joins is complex for exactly these two IDs
  const existingChat = existingConvs.find(c => {
    const pIds = c.participants.map((p: { profile_id: string }) => p.profile_id)
    return pIds.includes(user.id) && pIds.includes(memberId) && pIds.length === 2
  })

  if (existingChat) {
    return existingChat.id
  }

  // Create new private chat
  const { data: profile } = await supabase.from('profiles').select('agency_id').eq('id', user.id).single()
  if (!profile) throw new Error('Profile not found')

  const { data: newConv, error: createError } = await supabase
    .from('conversations')
    .insert({
      type: 'private',
      title: 'Private Chat',
      is_default: false
    })
    .select('id')
    .single()

  if (createError) throw new Error(createError.message)

  // Add participants
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: newConv.id, profile_id: user.id },
      { conversation_id: newConv.id, profile_id: memberId }
    ])

  if (partError) throw new Error(partError.message)

  return newConv.id
}

export async function addMemberToDefaultGroup(profileId: string, agencyId: string) {
  // We need service role for this, as the user themselves might not have permission to join groups, 
  // though the trigger or backend handles it. But we'll just run it as the logged-in owner who is adding them.
  const { supabase } = await requireStaff()

  // Find default group
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

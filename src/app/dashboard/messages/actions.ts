'use server'

import { requireStaff } from '@/lib/auth'

export async function sendAgencyMessageAction(conversationId: string, body: string) {
  const { supabase, profile } = await requireStaff()

  if (!body.trim()) {
    throw new Error('Message body is required')
  }

  console.log('[sendAgencyMessageAction] ATTEMPTING INSERT', { conversation_id: conversationId, sender_id: profile.id, body: body.trim() })

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: profile.id,
      body: body.trim()
    })
    .select()
    .single()

  console.log('[sendAgencyMessageAction] INSERT RESULT', { data, error })

  if (error) {
    console.error('SEND MESSAGE ERROR:', error)
    return { error: error.message || JSON.stringify(error) }
  }
  return { success: true, data }
}

import { getOrCreatePrivateChat } from '@/lib/messages'

export async function startPrivateChatAction(memberId: string) {
  try {
    const conversationId = await getOrCreatePrivateChat(memberId)
    return { success: true, conversationId }
  } catch (err) {
    const error = err as Error
    console.error('START PRIVATE CHAT ACTION ERROR:', error)
    return { error: error.message || JSON.stringify(error) }
  }
}

export async function getAgencyMembersAction() {
  const { supabase, profile } = await requireStaff()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role')
    .eq('agency_id', profile.agency_id)
    .neq('id', profile.id)
    .order('full_name')
    
  if (error) throw new Error(error.message)
  return data
}

export async function toggleReactionAction(messageId: string, emoji: string) {
  const { supabase, profile } = await requireStaff()
  
  // Try to delete existing reaction
  const { data: existing, error: deleteError } = await supabase
    .from('message_reactions')
    .delete()
    .eq('message_id', messageId)
    .eq('user_id', profile.id)
    .eq('emoji', emoji)
    .select()

  if (deleteError) {
    return { error: deleteError.message }
  }

  // If nothing was deleted, it means it didn't exist, so we insert
  if (!existing || existing.length === 0) {
    const { error: insertError } = await supabase
      .from('message_reactions')
      .insert({
        agency_id: profile.agency_id,
        message_id: messageId,
        user_id: profile.id,
        emoji: emoji
      })
      
    if (insertError) {
      return { error: insertError.message }
    }
  }

  return { success: true }
}

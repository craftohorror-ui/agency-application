'use server'

import { requireStaff } from '@/lib/auth'

export async function sendAgencyMessageAction(conversationId: string, body: string, filePath?: string, duration?: number, replyToMessageId?: string) {
  const { supabase, profile } = await requireStaff()

  if (!body.trim()) {
    throw new Error('Message body is required')
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: profile.id,
      body: body.trim(),
      ...(filePath ? { file_path: filePath } : {}),
      ...(duration !== undefined ? { duration } : {}),
      ...(replyToMessageId ? { reply_to_message_id: replyToMessageId } : {})
    })
    .select()
    .single()

  if (error) {
    console.error('SEND MESSAGE ERROR:', error)
    return { error: error.message || JSON.stringify(error) }
  }
  return { success: true, data }
}

export async function editAgencyMessageAction(messageId: string, newBody: string) {
  const { supabase, profile } = await requireStaff()

  if (!newBody.trim()) throw new Error('Message body is required')

  // Enforce 15-minute window and ownership
  const { data: msg } = await supabase.from('messages').select('created_at, sender_id').eq('id', messageId).single()
  if (!msg) throw new Error('Message not found')
  if (msg.sender_id !== profile.id) throw new Error('Unauthorized')
  
  const createdTime = new Date(msg.created_at).getTime()
  if (Date.now() - createdTime > 15 * 60 * 1000) throw new Error('Edit time window expired (15 minutes)')

  const { error } = await supabase
    .from('messages')
    .update({ body: newBody.trim(), edited_at: new Date().toISOString() })
    .eq('id', messageId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteAgencyMessageAction(messageId: string) {
  const { supabase, profile } = await requireStaff()

  // Enforce 30-minute window and ownership
  const { data: msg } = await supabase.from('messages').select('created_at, sender_id').eq('id', messageId).single()
  if (!msg) throw new Error('Message not found')
  if (msg.sender_id !== profile.id) throw new Error('Unauthorized')
  
  const createdTime = new Date(msg.created_at).getTime()
  if (Date.now() - createdTime > 30 * 60 * 1000) throw new Error('Delete time window expired (30 minutes)')

  const { error } = await supabase
    .from('messages')
    .update({ is_deleted: true, deleted_at: new Date().toISOString(), body: '', file_path: null, duration: 0 })
    .eq('id', messageId)

  if (error) return { error: error.message }
  return { success: true }
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

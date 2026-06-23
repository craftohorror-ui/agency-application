'use server'

import { requireStaff } from '@/lib/auth'
import { getOrCreatePrivateChat } from '@/lib/messages'

/**
 * H-6 FIX: Validates the authenticated user is a participant of the conversation
 * before any message operation (send, edit, delete, react).
 */
async function assertMessageParticipant(
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

export async function sendAgencyMessageAction(conversationId: string, body: string, filePath?: string, duration?: number, replyToMessageId?: string, mentionedUserIds?: string[]) {
  const { supabase, profile } = await requireStaff()

  if (!body.trim()) {
    throw new Error('Message body is required')
  }

  // H-6 FIX: Verify user is a participant before inserting a message.
  await assertMessageParticipant(supabase, conversationId, profile.id)

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

  // Trigger notifications
  try {
    const { createMessageNotification } = await import('@/lib/notifications')
    const notifiedUsers = new Set<string>()

    // 1. Mentions
    if (mentionedUserIds && mentionedUserIds.length > 0) {
      for (const userId of mentionedUserIds) {
        if (userId === profile.id) continue
        await createMessageNotification({
          supabase, agencyId: profile.agency_id, actorId: profile.id, userId, conversationId, messageId: data.id,
          type: 'mention', title: 'New Mention', body: `${profile.full_name || 'Someone'} mentioned you`
        })
        notifiedUsers.add(userId)
      }
    }

    // 2. Reply
    if (replyToMessageId) {
      const { data: originalMsg } = await supabase.from('messages').select('sender_id').eq('id', replyToMessageId).single()
      if (originalMsg && originalMsg.sender_id !== profile.id && !notifiedUsers.has(originalMsg.sender_id)) {
        await createMessageNotification({
          supabase, agencyId: profile.agency_id, actorId: profile.id, userId: originalMsg.sender_id, conversationId, messageId: data.id,
          type: 'reply', title: 'New Reply', body: `${profile.full_name || 'Someone'} replied to your message`
        })
        notifiedUsers.add(originalMsg.sender_id)
      }
    }

    // 3. Private Message
    const { data: conv } = await supabase.from('conversations').select('type').eq('id', conversationId).single()
    if (conv?.type === 'private') {
      const { data: participants } = await supabase.from('conversation_participants').select('profile_id').eq('conversation_id', conversationId)
      if (participants) {
        for (const p of participants) {
          if (p.profile_id !== profile.id && !notifiedUsers.has(p.profile_id)) {
            await createMessageNotification({
              supabase, agencyId: profile.agency_id, actorId: profile.id, userId: p.profile_id, conversationId, messageId: data.id,
              type: 'message', title: 'New Message', body: `${profile.full_name || 'Someone'} sent you a message`
            })
            notifiedUsers.add(p.profile_id)
          }
        }
      }
    }
  } catch (e) {
    console.error('Failed to process notifications:', e)
  }

  return { success: true, data }
}

export async function editAgencyMessageAction(messageId: string, newBody: string) {
  const { supabase, profile } = await requireStaff()

  if (!newBody.trim()) throw new Error('Message body is required')

  // Enforce 15-minute window and ownership
  const { data: msg } = await supabase.from('messages').select('created_at, sender_id, conversation_id').eq('id', messageId).single()
  if (!msg) throw new Error('Message not found')
  if (msg.sender_id !== profile.id) throw new Error('Unauthorized')

  // H-6 FIX: Also verify participant membership for the conversation this message belongs to
  await assertMessageParticipant(supabase, msg.conversation_id, profile.id)
  
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
  const { data: msg } = await supabase.from('messages').select('created_at, sender_id, conversation_id').eq('id', messageId).single()
  if (!msg) throw new Error('Message not found')
  if (msg.sender_id !== profile.id) throw new Error('Unauthorized')

  // H-6 FIX: Verify participant membership
  await assertMessageParticipant(supabase, msg.conversation_id, profile.id)
  
  const createdTime = new Date(msg.created_at).getTime()
  if (Date.now() - createdTime > 30 * 60 * 1000) throw new Error('Delete time window expired (30 minutes)')

  const { error } = await supabase
    .from('messages')
    .update({ is_deleted: true, deleted_at: new Date().toISOString(), body: '', file_path: null, duration: 0 })
    .eq('id', messageId)

  if (error) return { error: error.message }
  return { success: true }
}

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
    .in('role', ['owner', 'member'])
    .order('full_name')
    
  if (error) throw new Error(error.message)
  return data
}

export async function toggleReactionAction(messageId: string, emoji: string) {
  const { supabase, profile } = await requireStaff()
  
  // H-6 FIX: Verify user is a participant in the conversation this message belongs to
  const { data: msgData } = await supabase
    .from('messages')
    .select('conversation_id, sender_id')
    .eq('id', messageId)
    .single()
  
  if (!msgData) throw new Error('Message not found')
  await assertMessageParticipant(supabase, msgData.conversation_id, profile.id)
  
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

    try {
      if (msgData.sender_id !== profile.id) {
        const { createMessageNotification } = await import('@/lib/notifications')
        await createMessageNotification({
          supabase, agencyId: profile.agency_id, actorId: profile.id, userId: msgData.sender_id, conversationId: msgData.conversation_id || '', messageId,
          type: 'reaction', title: 'New Reaction', body: `${profile.full_name || 'Someone'} reacted ${emoji} to your message`
        })
      }
    } catch (e) {
      console.error('Failed to process reaction notification:', e)
    }
  }

  return { success: true }
}

export async function repairDefaultTeamChatAction() {
  const { supabase, profile } = await requireStaff()
  
  if (profile.role !== 'owner') {
    return { error: 'Only owners can repair team chats' }
  }

  // 1. Check if default chat exists
  const { data: existingChat } = await supabase
    .from('conversations')
    .select('id')
    .eq('agency_id', profile.agency_id)
    .eq('is_default', true)
    .limit(1)
    .maybeSingle()

  let convId = existingChat?.id

  // 2. Create if missing
  if (!convId) {
    const { data: agency } = await supabase
      .from('agencies')
      .select('name')
      .eq('id', profile.agency_id)
      .single()

    const { data: newChat, error: createError } = await supabase
      .from('conversations')
      .insert({
        agency_id: profile.agency_id,
        type: 'group',
        title: `${agency?.name || 'Agency'} Team`,
        is_default: true
      })
      .select('id')
      .single()

    if (createError) {
      console.error('Failed to create default chat:', createError)
      return { error: createError.message }
    }
    
    convId = newChat.id
  }

  // 3. Add all agency profiles as participants
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('agency_id', profile.agency_id)

  if (profiles && profiles.length > 0) {
    const participants = profiles.map(p => ({
      agency_id: profile.agency_id,
      conversation_id: convId,
      profile_id: p.id
    }))

    // ON CONFLICT DO NOTHING is native to Supabase JS if using upsert, but insert handles it via postgres error if we ignore it, or we can just upsert.
    const { error: partError } = await supabase
      .from('conversation_participants')
      .upsert(participants, { onConflict: 'conversation_id,profile_id', ignoreDuplicates: true })

    if (partError) {
      console.error('Failed to add participants:', partError)
      return { error: partError.message }
    }
  }

  return { success: true, conversationId: convId }
}

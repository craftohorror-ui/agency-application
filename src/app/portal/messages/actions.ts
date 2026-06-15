'use server'

import { requireClient } from '@/lib/auth'

export async function sendPortalMessageAction(conversationId: string, body: string, filePath?: string, duration?: number, replyToMessageId?: string, mentionedUserIds?: string[]) {
  const { supabase, profile } = await requireClient()
  
  if (!body.trim()) return

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

export async function editPortalMessageAction(messageId: string, newBody: string) {
  const { supabase, user } = await requireClient()

  if (!newBody.trim()) throw new Error('Message body is required')

  // Enforce 15-minute window and ownership
  const { data: msg } = await supabase.from('messages').select('created_at, sender_id').eq('id', messageId).single()
  if (!msg) throw new Error('Message not found')
  if (msg.sender_id !== user.id) throw new Error('Unauthorized')
  
  const createdTime = new Date(msg.created_at).getTime()
  if (Date.now() - createdTime > 15 * 60 * 1000) throw new Error('Edit time window expired (15 minutes)')

  const { error } = await supabase
    .from('messages')
    .update({ body: newBody.trim(), edited_at: new Date().toISOString() })
    .eq('id', messageId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function deletePortalMessageAction(messageId: string) {
  const { supabase, user } = await requireClient()

  // Enforce 30-minute window and ownership
  const { data: msg } = await supabase.from('messages').select('created_at, sender_id').eq('id', messageId).single()
  if (!msg) throw new Error('Message not found')
  if (msg.sender_id !== user.id) throw new Error('Unauthorized')
  
  const createdTime = new Date(msg.created_at).getTime()
  if (Date.now() - createdTime > 30 * 60 * 1000) throw new Error('Delete time window expired (30 minutes)')

  const { error } = await supabase
    .from('messages')
    .update({ is_deleted: true, deleted_at: new Date().toISOString(), body: '', file_path: null, duration: 0 })
    .eq('id', messageId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function togglePortalReactionAction(messageId: string, emoji: string) {
  const { supabase, profile } = await requireClient()
  
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
      const { data: msg } = await supabase.from('messages').select('sender_id, conversation_id').eq('id', messageId).single()
      if (msg && msg.sender_id !== profile.id) {
        const { createMessageNotification } = await import('@/lib/notifications')
        await createMessageNotification({
          supabase, agencyId: profile.agency_id, actorId: profile.id, userId: msg.sender_id, conversationId: msg.conversation_id || '', messageId,
          type: 'reaction', title: 'New Reaction', body: `${profile.full_name || 'Someone'} reacted ${emoji} to your message`
        })
      }
    } catch (e) {
      console.error('Failed to process reaction notification:', e)
    }
  }

  return { success: true }
}

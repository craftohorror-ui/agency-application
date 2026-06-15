import { SupabaseClient } from '@supabase/supabase-js'

interface CreateNotificationParams {
  supabase: SupabaseClient
  agencyId: string
  actorId: string
  userId: string
  conversationId: string
  messageId: string
  type: 'message' | 'reply' | 'reaction' | 'mention'
  title: string
  body: string
}

export async function createMessageNotification({
  supabase,
  agencyId,
  actorId,
  userId,
  conversationId,
  messageId,
  type,
  title,
  body
}: CreateNotificationParams) {
  if (actorId === userId) return // Prevent self-notifications

  try {
    // Check if notification already exists for this event (especially reactions) to prevent spam
    if (type === 'reaction') {
      const { data: existing } = await supabase
        .from('message_notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('message_id', messageId)
        .eq('type', 'reaction')
        .single()
        
      if (existing) return // Already notified for a reaction on this message by someone
    }

    await supabase.from('message_notifications').insert({
      agency_id: agencyId,
      user_id: userId,
      actor_id: actorId,
      conversation_id: conversationId,
      message_id: messageId,
      type,
      title,
      body,
      is_read: false
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
    // Non-blocking, so we swallow the error
  }
}

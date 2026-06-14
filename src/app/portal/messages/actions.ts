'use server'

import { requireClient } from '@/lib/auth'

export async function sendPortalMessageAction(conversationId: string, body: string) {
  const { supabase, user } = await requireClient()
  
  if (!body.trim()) return

  console.log('[sendPortalMessageAction] ATTEMPTING INSERT', { conversation_id: conversationId, sender_id: user.id, body: body.trim() })

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: body.trim()
    })
    .select()
    .single()

  console.log('[sendPortalMessageAction] INSERT RESULT', { data, error })

  if (error) {
    console.error('SEND MESSAGE ERROR:', error)
    return { error: error.message || JSON.stringify(error) }
  }
  return { success: true, data }
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
  }

  return { success: true }
}

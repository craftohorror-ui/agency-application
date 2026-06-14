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
      body: body.trim(),
      topic: 'chat',
      extension: 'text'
    })
    .select()
    .single()

  console.log('[sendPortalMessageAction] INSERT RESULT', { data, error })

  if (error) throw new Error(error.message || JSON.stringify(error))
  return data
}

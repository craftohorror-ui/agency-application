'use server'

import { requireClient } from '@/lib/auth'

export async function sendPortalMessageAction(conversationId: string, body: string) {
  const { supabase, user } = await requireClient()
  
  if (!body.trim()) return

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: body.trim(),
    topic: 'chat',
    extension: 'text'
  })

  if (error) {
    throw new Error(error.message)
  }
}

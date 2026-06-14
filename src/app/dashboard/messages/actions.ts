'use server'

import { requireStaff } from '@/lib/auth'

export async function sendAgencyMessageAction(conversationId: string, body: string) {
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
      topic: 'chat',
      extension: 'text'
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

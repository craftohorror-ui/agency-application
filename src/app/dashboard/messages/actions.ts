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

import { getOrCreatePrivateChat } from '@/lib/messages'

export async function startPrivateChatAction(memberId: string) {
  const conversationId = await getOrCreatePrivateChat(memberId)
  return conversationId
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

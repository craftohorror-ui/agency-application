import 'server-only'
import { requireStaff } from '@/lib/auth'

export async function listAgencyConversations() {
  const { supabase } = await requireStaff()
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*, participants:conversation_participants(profile:profiles(id, full_name, avatar_url, role))')
    .order('created_at', { ascending: false })
    
  if (error) throw new Error(error.message)
  return data
}

export async function getAgencyConversationMessages(conversationId: string) {
  const { supabase } = await requireStaff()
  
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles(id, full_name, avatar_url, role)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

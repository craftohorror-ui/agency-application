import { requireStaff } from '@/lib/auth'
import { listAgencyConversations, getAgencyConversationMessages } from '@/lib/messages'
import { ChatInterface, ChatMessage } from '@/components/portal/chat-interface'

export default async function MessagesPage({ searchParams }: { searchParams: { conversationId?: string } }) {
  const { user } = await requireStaff()
  
  const conversations = await listAgencyConversations()
  const initialConversationId = searchParams.conversationId || (conversations.length > 0 ? conversations[0].id : null)
  
  let initialMessages: ChatMessage[] = []
  if (initialConversationId) {
    initialMessages = await getAgencyConversationMessages(initialConversationId)
  }

  return (
    <div className='h-[calc(100vh-theme(spacing.16))] -m-8 flex flex-col'>
      <ChatInterface 
        conversations={conversations} 
        initialMessages={initialMessages} 
        currentUserId={user.id}
        actionRoute="agency"
        initialConversationId={initialConversationId}
      />
    </div>
  )
}

import { requireStaff } from '@/lib/auth'
import { listAgencyConversations, getAgencyConversationMessages } from '@/lib/messages'
import { ChatInterface, ChatMessage } from '@/components/portal/chat-interface'

export default async function MessagesPage() {
  const { user } = await requireStaff()
  
  const conversations = await listAgencyConversations()
  
  let initialMessages: ChatMessage[] = []
  if (conversations.length > 0) {
    initialMessages = await getAgencyConversationMessages(conversations[0].id)
  }

  return (
    <div className='h-[calc(100vh-theme(spacing.16))] -m-8 flex flex-col'>
      <ChatInterface 
        conversations={conversations} 
        initialMessages={initialMessages} 
        currentUserId={user.id}
        actionRoute="agency"
      />
    </div>
  )
}

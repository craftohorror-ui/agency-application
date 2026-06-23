import { requireStaff } from '@/lib/auth'
import { listAgencyConversations, getAgencyConversationMessages } from '@/lib/messages'
import { ChatInterface, ChatMessage } from '@/components/portal/chat-interface'
import { repairDefaultTeamChatAction } from './actions'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MessagesPage(props: PageProps) {
  const { user, profile } = await requireStaff()
  const searchParams = await props.searchParams
  
  let conversations = await listAgencyConversations()
  
  // Auto-repair if default team chat is missing
  if (profile.role === 'owner' && !conversations.some(c => c.is_default)) {
    const repairResult = await repairDefaultTeamChatAction()
    if (repairResult.success) {
      conversations = await listAgencyConversations()
    }
  }

  const conversationIdParam = typeof searchParams.conversationId === 'string' ? searchParams.conversationId : null
  const initialConversationId = conversationIdParam || (conversations.length > 0 ? conversations[0].id : null)
  
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

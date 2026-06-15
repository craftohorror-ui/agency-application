import { requireClient } from '@/lib/auth'
import { listPortalConversations, getConversationMessages, getOrCreateGeneralSupportConversation } from '@/lib/portal'
import { ChatInterface } from '@/components/portal/chat-interface'
import type { Message } from '@/lib/types'

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PortalMessagesPage(props: PageProps) {
  const { user } = await requireClient()
  const searchParams = await props.searchParams
  
  // Enforce support conversation exists
  await getOrCreateGeneralSupportConversation()

  // Now list all conversations
  const conversations = await listPortalConversations()
  const conversationIdParam = typeof searchParams.conversationId === 'string' ? searchParams.conversationId : null
  const initialConversationId = conversationIdParam || (conversations.length > 0 ? conversations[0].id : null)
  
  let initialMessages: (Message & { sender: { id: string, full_name: string, avatar_url: string | null, role: string } })[] = []
  if (initialConversationId) {
    initialMessages = await getConversationMessages(initialConversationId)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Messages</h1>
        <p className='text-sm text-muted-foreground'>
          Communicate directly with your agency team.
        </p>
      </div>

      <ChatInterface 
        conversations={conversations} 
        initialMessages={initialMessages} 
        currentUserId={user.id} 
        initialConversationId={initialConversationId}
      />
    </div>
  )
}

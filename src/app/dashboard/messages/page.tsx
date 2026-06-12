import { requireStaff } from '@/lib/auth'
import { listAgencyConversations, getAgencyConversationMessages } from '@/lib/messages'
import { ChatInterface } from '@/components/portal/chat-interface'
import type { Message } from '@/lib/types'

export default async function MessagesPage() {
  const { user } = await requireStaff()
  
  const conversations = await listAgencyConversations()
  
  let initialMessages: (Message & { sender: { id: string, full_name: string, avatar_url: string | null, role: string } })[] = []
  if (conversations.length > 0) {
    initialMessages = await getAgencyConversationMessages(conversations[0].id)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Messages</h1>
        <p className='text-sm text-muted-foreground'>
          Communicate with clients and team members.
        </p>
      </div>

      <ChatInterface 
        conversations={conversations} 
        initialMessages={initialMessages} 
        currentUserId={user.id}
        actionRoute="agency"
      />
    </div>
  )
}

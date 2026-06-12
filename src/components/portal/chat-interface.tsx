'use client'

import { useEffect, useState, useRef } from 'react'
import { SendIcon, Loader2Icon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { sendPortalMessageAction } from '@/app/portal/messages/actions'
import { sendAgencyMessageAction } from '@/app/dashboard/messages/actions'

type Participant = {
  profile: {
    id: string
    full_name: string
    avatar_url: string | null
    role: string
  }
}

type Conversation = {
  id: string
  title: string
  participants: Participant[]
}

type Message = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
  sender: {
    id: string
    full_name: string
    avatar_url: string | null
    role: string
  }
}

interface ChatInterfaceProps {
  conversations: Conversation[]
  initialMessages: Message[]
  currentUserId: string
  actionRoute?: 'portal' | 'agency'
}

export function ChatInterface({ conversations, initialMessages, currentUserId, actionRoute = 'portal' }: ChatInterfaceProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  )
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!activeConversationId) return

    const channel = supabase
      .channel(`messages:${activeConversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversationId}` },
        async (payload) => {
          // Fetch sender info for the new message
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, role')
            .eq('id', payload.new.sender_id)
            .single()

          const newMessage: Message = {
            id: payload.new.id,
            conversation_id: payload.new.conversation_id,
            sender_id: payload.new.sender_id,
            body: payload.new.body,
            created_at: payload.new.created_at,
            sender: sender || { id: payload.new.sender_id, full_name: 'Unknown', avatar_url: null, role: 'member' }
          }
          
          setMessages(prev => {
            // Avoid duplicates if we just sent it
            if (prev.find(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeConversationId, supabase])

  // Refetch initial messages if conversation changes
  useEffect(() => {
    if (!activeConversationId) return

    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(id, full_name, avatar_url, role)')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data as Message[])
      }
    }

    // Only refetch if we switched to a new conversation that isn't the initial one
    if (initialMessages.length > 0 && initialMessages[0].conversation_id !== activeConversationId) {
      fetchMessages()
    } else if (initialMessages.length === 0 || initialMessages[0].conversation_id === activeConversationId) {
      setMessages(initialMessages)
    }

  }, [activeConversationId, initialMessages, supabase])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim() || !activeConversationId || isSending) return

    const body = inputValue
    setInputValue('')
    setIsSending(true)

    try {
      // Optimistic update
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: activeConversationId,
        sender_id: currentUserId,
        body: body,
        created_at: new Date().toISOString(),
        sender: { id: currentUserId, full_name: 'Me', avatar_url: null, role: 'client' }
      }
      setMessages(prev => [...prev, optimisticMessage])

      if (actionRoute === 'agency') {
        await sendAgencyMessageAction(activeConversationId, body)
      } else {
        await sendPortalMessageAction(activeConversationId, body)
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      // Ideally show a toast
    } finally {
      setIsSending(false)
    }
  }

  function formatTime(dateStr: string) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(dateStr))
  }

  if (conversations.length === 0) {
    return (
      <Card className="flex h-[600px] items-center justify-center text-muted-foreground">
        No conversations found.
      </Card>
    )
  }

  return (
    <div className="grid h-[600px] grid-cols-1 md:grid-cols-[250px_1fr] overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Sidebar: Conversation List */}
      <div className="hidden border-r md:block bg-muted/20">
        <div className="p-4 border-b">
          <h2 className="font-semibold tracking-tight">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-[calc(600px-57px)]">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${activeConversationId === conv.id ? 'bg-muted/60 font-medium' : ''}`}
            >
              <div className="truncate text-sm">{conv.title}</div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {conv.participants.length} participants
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b bg-card z-10 shadow-sm">
          <h2 className="font-semibold tracking-tight">{activeConversation?.title || 'Chat'}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex gap-2">
            {activeConversation?.participants.map(p => (
              <span key={p.profile.id}>{p.profile.full_name}</span>
            ))}
          </div>
        </div>

        {/* Message Feed */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No messages yet. Send a message to start the conversation.
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUserId
              const showAvatar = i === 0 || messages[i-1].sender_id !== msg.sender_id

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2 max-w-full`}>
                  {!isMe && (
                    <div className="w-8 shrink-0">
                      {showAvatar && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {msg.sender?.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {!isMe && showAvatar && (
                      <span className="text-xs text-muted-foreground mb-1 ml-1">{msg.sender?.full_name}</span>
                    )}
                    
                    <div 
                      className={`px-4 py-2 rounded-2xl text-sm break-words ${
                        isMe 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted rounded-tl-sm'
                      }`}
                    >
                      {msg.body}
                    </div>
                    
                    <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t z-10">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim() || isSending}>
              {isSending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

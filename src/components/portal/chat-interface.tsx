'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { SendIcon, Loader2Icon, SearchIcon, ArrowLeftIcon, PlusIcon, UserIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { sendPortalMessageAction } from '@/app/portal/messages/actions'
import { sendAgencyMessageAction } from '@/app/dashboard/messages/actions'
export interface ChatConversation {
  id: string
  title: string
  type: string
  is_default?: boolean
  unread_count?: number
  last_message_body?: string | null
  last_message_created_at?: string | null
  participants?: Array<{ profile_id: string; full_name: string; avatar_url: string | null; role: string }>
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
  sender?: {
    id: string
    full_name: string
    avatar_url: string | null
    role: string
  }
}

interface ChatInterfaceProps {
  conversations: ChatConversation[]
  initialMessages: ChatMessage[]
  currentUserId: string
  actionRoute?: 'portal' | 'agency'
}

export function ChatInterface({ conversations, initialMessages, currentUserId, actionRoute = 'portal' }: ChatInterfaceProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  )
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  // Handle mobile view transitions
  useEffect(() => {
    if (activeConversationId) {
      setMobileView('chat')
    }
  }, [activeConversationId])

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
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, role')
            .eq('id', payload.new.sender_id)
            .single()

          const newMessage = {
            id: payload.new.id,
            conversation_id: payload.new.conversation_id,
            sender_id: payload.new.sender_id,
            body: payload.new.body,
            created_at: payload.new.created_at,
            sender: sender || { id: payload.new.sender_id, full_name: 'Unknown', avatar_url: null, role: 'member' }
          }
          
          setMessages(prev => {
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
        setMessages(data)
      }
    }

    if (initialMessages.length > 0 && initialMessages[0].conversation_id !== activeConversationId) {
      fetchMessages()
    } else if (initialMessages.length === 0 || (initialMessages.length > 0 && initialMessages[0].conversation_id === activeConversationId)) {
      setMessages(initialMessages)
    } else {
      fetchMessages()
    }

    // Mark as read immediately on open
    async function markRead() {
      const msgs = messages.length > 0 ? messages : initialMessages
      if (msgs.length > 0) {
        const latestId = msgs[msgs.length - 1].id
        await supabase
          .from('conversation_participants')
          .update({ last_read_message_id: latestId })
          .eq('conversation_id', activeConversationId)
          .eq('profile_id', currentUserId)
      }
    }
    if (activeConversationId) {
      markRead()
    }

  }, [activeConversationId, initialMessages, supabase, currentUserId, messages, messages.length]) // only trigger when length changes to avoid loops

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim() || !activeConversationId || isSending) return

    const body = inputValue
    setInputValue('')
    setIsSending(true)

    try {
      const optimisticMessage = {
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

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations
    const lowerQ = searchQuery.toLowerCase()
    return conversations.filter(c => {
      if (typeof c.title === 'string' && c.title.toLowerCase().includes(lowerQ)) return true
      const parts = (c.participants || []) as Array<{ full_name?: string }>
      return parts.some(p => p.full_name?.toLowerCase().includes(lowerQ))
    })
  }, [conversations, searchQuery])

  const groups = filteredConversations.filter(c => c.type === 'group' || c.is_default)
  const dms = filteredConversations.filter(c => c.type === 'private')

  function getConversationName(c: ChatConversation) {
    if (c.type === 'group' || c.is_default) return c.title
    const parts = c.participants || []
    const other = parts.find(p => p.profile_id !== currentUserId)
    return other ? other.full_name : 'Direct Message'
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border rounded-xl bg-background shadow-sm h-full p-8">
        <UserIcon className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="text-xl font-medium text-foreground mb-2">Team Messaging</h3>
        <p className="text-center max-w-sm">Collaborate with your team in real time. Start a conversation or select a chat to begin messaging.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden border-t md:border md:rounded-xl bg-background shadow-sm relative">
      
      {/* Sidebar: Conversation List */}
      <div className={`w-full md:w-[320px] flex-shrink-0 flex flex-col border-r bg-muted/10 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b bg-background">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search chats..."
              className="pl-9 bg-muted/50"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {groups.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Groups</h3>
              {groups.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 ${activeConversationId === conv.id ? 'bg-muted/80' : ''}`}
                >
                  <div className="h-10 w-10 shrink-0 rounded-md bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {conv.title.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline">
                      <div className="truncate font-medium text-sm text-foreground">{conv.title}</div>
                      {conv.last_message_created_at && (
                        <div className="text-[10px] text-muted-foreground">{formatTime(conv.last_message_created_at)}</div>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground mt-0.5">
                      {conv.last_message_body || 'No messages yet'}
                    </div>
                  </div>
                  {!!conv.unread_count && conv.unread_count > 0 && (
                    <Badge variant="default" className="rounded-full px-1.5 min-w-[20px] justify-center text-[10px]">
                      {conv.unread_count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          {dms.length > 0 && (
            <div className="py-2 border-t">
              <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center">
                Direct Messages
                {actionRoute === 'agency' && (
                  <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" title="New Message">
                    <PlusIcon className="h-3 w-3" />
                  </Button>
                )}
              </h3>
              {dms.map(conv => {
                const parts = conv.participants || []
                const other = parts.find(p => p.profile_id !== currentUserId)
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 ${activeConversationId === conv.id ? 'bg-muted/80' : ''}`}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-sm overflow-hidden relative">
                      {other?.avatar_url ? (
                        <img src={other.avatar_url} alt={other.full_name} className="w-full h-full object-cover" />
                      ) : (
                        other?.full_name?.charAt(0) || 'U'
                      )}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline">
                        <div className="truncate font-medium text-sm text-foreground">{other?.full_name || 'User'}</div>
                        {conv.last_message_created_at && (
                          <div className="text-[10px] text-muted-foreground">{formatTime(conv.last_message_created_at)}</div>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted-foreground mt-0.5">
                        {conv.last_message_body || 'No messages yet'}
                      </div>
                    </div>
                    {!!conv.unread_count && conv.unread_count > 0 && (
                      <Badge variant="default" className="rounded-full px-1.5 min-w-[20px] justify-center text-[10px]">
                        {conv.unread_count}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-background relative ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        {activeConversation && (
          <div className="px-4 py-3 border-b bg-background/95 backdrop-blur z-10 flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden -ml-2 h-8 w-8" onClick={() => setMobileView('list')}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            
            <div className={`h-10 w-10 shrink-0 flex items-center justify-center font-bold text-sm overflow-hidden ${activeConversation.type === 'group' || activeConversation.is_default ? 'rounded-md bg-primary/10 text-primary' : 'rounded-full bg-secondary text-secondary-foreground'}`}>
               {getConversationName(activeConversation).charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm truncate">{getConversationName(activeConversation)}</h2>
              <div className="text-xs text-muted-foreground truncate">
                {activeConversation.type === 'group' || activeConversation.is_default 
                  ? `${activeConversation.participants?.length || 0} members`
                  : 'Online'}
              </div>
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-slate-900/20">
          <div ref={scrollRef} className="absolute inset-0 p-4 space-y-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">💬</div>
                <p>No messages yet.</p>
                <p className="text-xs opacity-70">Say hello to start the conversation.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender_id === currentUserId
                const showAvatar = i === 0 || messages[i-1].sender_id !== msg.sender_id
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2 max-w-full group`}>
                    {!isMe && (
                      <div className="w-8 shrink-0 flex items-end">
                        {showAvatar && (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                            {msg.sender?.avatar_url ? (
                              <img src={msg.sender.avatar_url} alt={msg.sender.full_name} className="w-full h-full object-cover" />
                            ) : (
                              msg.sender?.full_name?.charAt(0) || 'U'
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      {!isMe && showAvatar && (
                        <span className="text-[11px] font-medium text-muted-foreground mb-1 ml-1">{msg.sender?.full_name}</span>
                      )}
                      
                      <div 
                        className={`px-4 py-2.5 text-[15px] leading-relaxed break-words shadow-sm ${
                          isMe 
                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                            : 'bg-card border text-card-foreground rounded-2xl rounded-tl-sm'
                        }`}
                      >
                        {msg.body}
                      </div>
                      
                      <div className={`flex items-center gap-1 mt-1 mx-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-background border-t z-10">
          <form onSubmit={handleSend} className="flex gap-2 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="w-full rounded-full pl-4 pr-12 bg-muted/50 border-muted-foreground/20 focus-visible:ring-1"
                disabled={isSending || !activeConversationId}
                autoComplete="off"
              />
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-10 w-10 shrink-0 rounded-full shadow-sm transition-all"
              disabled={!inputValue.trim() || isSending || !activeConversationId}
            >
              {isSending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4 ml-0.5" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

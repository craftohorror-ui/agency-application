'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { SendIcon, Loader2Icon, SearchIcon, ArrowLeftIcon, PlusIcon, MessageSquareIcon, SmileIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { sendPortalMessageAction, togglePortalReactionAction } from '@/app/portal/messages/actions'
import { sendAgencyMessageAction, getAgencyMembersAction, toggleReactionAction } from '@/app/dashboard/messages/actions'

export interface Reaction {
  id: string
  message_id: string
  user_id: string
  emoji: string
}

export interface ChatConversation {
  id: string
  title: string
  type: string
  is_default?: boolean
  unread_count?: number
  last_message_body?: string | null
  last_message_created_at?: string | null
  participants?: Array<{ profile_id: string; full_name: string; avatar_url: string | null; role: string; presence_status?: string; last_seen?: string }>
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

export function ChatInterface({ conversations: initialConversations, initialMessages, currentUserId, actionRoute = 'portal' }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations.length > 0 ? initialConversations[0].id : null
  )
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [activePicker, setActivePicker] = useState<string | null>(null)
  const EMOJIS = ['👍', '❤️', '😂', '🔥', '🎉', '👀', '😎']
  
  // Step 2 & 3 State
  const [readStates, setReadStates] = useState<Record<string, string>>({}) // profile_id -> message_id
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  // Step 4 State (Private Chats)
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
  const [agencyMembers, setAgencyMembers] = useState<Array<{ id: string; full_name: string; avatar_url: string | null; role: string }>>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const readDebounceTimer = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  // Mobile View Transitions
  useEffect(() => {
    if (activeConversationId) setMobileView('chat')
  }, [activeConversationId])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, readStates])

  // ==========================================
  // STEP 3: ONLINE PRESENCE
  // ==========================================
  useEffect(() => {
    const room = supabase.channel('agency_presence', {
      config: { presence: { key: currentUserId } }
    })

    room.on('presence', { event: 'sync' }, () => {
      const state = room.presenceState()
      const onlineIds = new Set<string>()
      Object.keys(state).forEach(key => onlineIds.add(key))
      setOnlineUsers(onlineIds)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await room.track({ online_at: new Date().toISOString() })
      }
    })

    supabase.from('profiles').update({ 
      presence_status: 'online', 
      last_seen: new Date().toISOString() 
    }).eq('id', currentUserId).then()

    const handleUnload = () => {
      supabase.from('profiles').update({ 
        presence_status: 'offline', 
        last_seen: new Date().toISOString() 
      }).eq('id', currentUserId).then()
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      supabase.from('profiles').update({ presence_status: 'offline', last_seen: new Date().toISOString() }).eq('id', currentUserId).then()
      supabase.removeChannel(room)
    }
  }, [supabase, currentUserId])

  // ==========================================
  // STEP 0.5 & 1: GLOBAL MESSAGES LISTENER
  // ==========================================
  useEffect(() => {
    const channel = supabase
      .channel('global_messages_listener')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
          const newMsg = payload.new

          const { data: sender } = await supabase.from('profiles').select('id, full_name, avatar_url, role').eq('id', newMsg.sender_id).single()

          const messageObj: ChatMessage = {
            id: newMsg.id, conversation_id: newMsg.conversation_id, sender_id: newMsg.sender_id, body: newMsg.body, created_at: newMsg.created_at,
            sender: sender || { id: newMsg.sender_id, full_name: 'Unknown', avatar_url: null, role: 'member' }
          }

          setConversations(prev => {
            const exists = prev.find(c => c.id === newMsg.conversation_id)
            if (!exists) {
              // We should probably fetch the new conversation so it appears in the sidebar!
              // For now we will rely on a hard refresh or realtime conv listener, 
              // but to prevent breaking the map loop we just return prev.
              return prev
            }
            return prev.map(c => {
              if (c.id === newMsg.conversation_id) {
                const isActive = c.id === activeConversationId
                const isMine = newMsg.sender_id === currentUserId
                return {
                  ...c,
                  last_message_body: newMsg.body,
                  last_message_created_at: newMsg.created_at,
                  unread_count: (!isActive && !isMine) ? (c.unread_count || 0) + 1 : (c.unread_count || 0)
                }
              }
              return c
            })
          })

          if (newMsg.conversation_id === activeConversationId) {
            setMessages(prev => {
              const duplicate = prev.find(m => m.id === newMsg.id)
              if (duplicate) return prev
              const isOptimisticDuplicate = prev.some(m => m.sender_id === currentUserId && m.body === newMsg.body && new Date(newMsg.created_at).getTime() - new Date(m.created_at).getTime() < 5000)
              if (isOptimisticDuplicate) return prev.map(m => (m.sender_id === currentUserId && m.body === newMsg.body) ? messageObj : m)
              return [...prev, messageObj]
            })
          }
        }
      ).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeConversationId, currentUserId, supabase])


  // ==========================================
  // STEP 2.5: REACTION LISTENER
  // ==========================================
  useEffect(() => {
    const channel = supabase
      .channel('reactions_listener')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message_reactions' }, (payload) => {
        setReactions(prev => {
          if (prev.find(r => r.id === payload.new.id)) return prev
          return [...prev, payload.new as Reaction]
        })
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'message_reactions' }, (payload) => {
        setReactions(prev => prev.filter(r => r.id !== payload.old.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])


  // ==========================================
  // STEP 2: ACTIVE CONVERSATION DATA (Messages & Read States)
  // ==========================================
  useEffect(() => {
    if (!activeConversationId) return

    async function fetchMessages() {
      const { data } = await supabase.from('messages').select('*, sender:profiles(id, full_name, avatar_url, role)').eq('conversation_id', activeConversationId).order('created_at', { ascending: true })
      if (data) {
        setMessages(data)
        const messageIds = data.map((m: ChatMessage) => m.id)
        if (messageIds.length > 0) {
          const { data: reactionData } = await supabase.from('message_reactions').select('*').in('message_id', messageIds)
          if (reactionData) setReactions(reactionData as Reaction[])
        } else {
          setReactions([])
        }
      }
    }

    if (initialMessages.length > 0 && initialMessages[0].conversation_id !== activeConversationId) {
      fetchMessages()
    } else if (initialMessages.length === 0 || (initialMessages.length > 0 && initialMessages[0].conversation_id === activeConversationId)) {
      setMessages(initialMessages)
      if (initialMessages.length > 0) {
        const messageIds = initialMessages.map(m => m.id)
        supabase.from('message_reactions').select('*').in('message_id', messageIds).then(({ data }) => {
          if (data) setReactions(data as Reaction[])
        })
      } else {
        setReactions([])
      }
    } else {
      fetchMessages()
    }

    async function fetchReadStates() {
      const { data } = await supabase.from('conversation_participants').select('profile_id, last_read_message_id').eq('conversation_id', activeConversationId)
      if (data) {
        const states: Record<string, string> = {}
        data.forEach(d => { if (d.last_read_message_id) states[d.profile_id] = d.last_read_message_id })
        setReadStates(states)
      }
    }
    fetchReadStates()

    const partChannel = supabase.channel(`participants_${activeConversationId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversation_participants', filter: `conversation_id=eq.${activeConversationId}` }, (payload) => {
        const newRecord = payload.new
        if (newRecord.last_read_message_id) {
          setReadStates(prev => ({ ...prev, [newRecord.profile_id]: newRecord.last_read_message_id }))
        }
      }).subscribe()

    return () => { supabase.removeChannel(partChannel) }
  }, [activeConversationId, supabase, initialMessages])


  // Debounced Read Receipt Writer
  useEffect(() => {
    if (!activeConversationId || messages.length === 0) return

    function triggerMarkRead() {
      const latestId = messages[messages.length - 1].id
      
      if (readDebounceTimer.current) clearTimeout(readDebounceTimer.current)
      
      readDebounceTimer.current = setTimeout(async () => {
        await supabase.from('conversation_participants').update({ last_read_message_id: latestId }).eq('conversation_id', activeConversationId).eq('profile_id', currentUserId)
      }, 1500)
    }

    triggerMarkRead()
    setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, unread_count: 0 } : c))

  }, [activeConversationId, messages, currentUserId, supabase])


  // ==========================================
  // STEP 4: PRIVATE CONVERSATION HELPERS
  // ==========================================
  async function handleOpenNewChat() {
    setIsNewChatModalOpen(true)
    setIsLoadingMembers(true)
    try {
      if (actionRoute === 'agency') {
        const members = await getAgencyMembersAction()
        setAgencyMembers(members)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingMembers(false)
    }
  }

  async function handleStartPrivateChat(memberId: string) {
    try {
      if (actionRoute === 'agency') {
        const { startPrivateChatAction } = await import('@/app/dashboard/messages/actions')
        const result = await startPrivateChatAction(memberId)
        
        if (result && result.error) {
          alert(`Private Chat Failed: ${result.error}`)
          return
        }

        const convId = result.conversationId!
        
        const exists = conversations.find(c => c.id === convId)
        if (!exists) {
          const { data } = await supabase.from('agency_conversations_with_unreads').select('*').eq('id', convId).eq('participant_id', currentUserId).single()
          if (data) {
             setConversations(prev => [data, ...prev])
          }
        }
        
        setActiveConversationId(convId)
        setIsNewChatModalOpen(false)
      }
    } catch (e) {
      const error = e as Error
      console.error(error)
      alert(`Private Chat Error: ${error.message || error}`)
    }
  }

  async function handleToggleReaction(messageId: string, emoji: string) {
    const exists = reactions.find(r => r.message_id === messageId && r.user_id === currentUserId && r.emoji === emoji)
    if (exists) {
      setReactions(prev => prev.filter(r => r.id !== exists.id))
    } else {
      setReactions(prev => [...prev, { id: crypto.randomUUID(), message_id: messageId, user_id: currentUserId, emoji }])
    }
    try {
      let result
      if (actionRoute === 'agency') {
        result = await toggleReactionAction(messageId, emoji)
      } else {
        result = await togglePortalReactionAction(messageId, emoji)
      }
      if (result && result.error) throw new Error(result.error)
    } catch (err) {
      console.error('Failed to toggle reaction', err)
    }
  }


  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!inputValue.trim() || !activeConversationId || isSending) return

    const body = inputValue.trim()
    setInputValue('')
    setIsSending(true)

    try {
      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: activeConversationId, sender_id: currentUserId, body: body, created_at: new Date().toISOString(),
        sender: { id: currentUserId, full_name: 'Me', avatar_url: null, role: 'client' }
      }
      setMessages(prev => [...prev, optimisticMessage])
      setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, last_message_body: body, last_message_created_at: optimisticMessage.created_at } : c))

      let result
      if (actionRoute === 'agency') {
        result = await sendAgencyMessageAction(activeConversationId, body)
      } else {
        result = await sendPortalMessageAction(activeConversationId, body)
      }
      
      if (result && result.error) {
        throw new Error(result.error)
      }
    } catch (err) {
      const error = err as Error
      console.error('Failed to send message:', error)
      alert(`Message sending failed: ${error.message || error}`)
      // Revert optimistic update so the user knows it failed
      setMessages(prev => prev.filter(m => m.body !== body || m.sender_id !== currentUserId))
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function formatTime(dateStr: string) {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(dateStr))
  }

  const sortedAndFilteredConversations = useMemo(() => {
    let result = [...conversations]
    result.sort((a, b) => {
      const timeA = a.last_message_created_at ? new Date(a.last_message_created_at).getTime() : 0
      const timeB = b.last_message_created_at ? new Date(b.last_message_created_at).getTime() : 0
      return timeB - timeA
    })
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase()
      result = result.filter(c => {
        if (typeof c.title === 'string' && c.title.toLowerCase().includes(lowerQ)) return true
        const parts = (c.participants || []) as Array<{ full_name?: string }>
        return parts.some(p => p.full_name?.toLowerCase().includes(lowerQ))
      })
    }
    return result
  }, [conversations, searchQuery])

  const groups = sortedAndFilteredConversations.filter(c => c.type === 'group' || c.is_default)
  const dms = sortedAndFilteredConversations.filter(c => c.type === 'private')

  function getConversationName(c: ChatConversation) {
    if (c.type === 'group' || c.is_default) return c.title
    const parts = c.participants || []
    const other = parts.find(p => p.profile_id !== currentUserId)
    return other ? other.full_name : 'Direct Message'
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden border-t md:border md:rounded-xl bg-background shadow-sm relative">
      
      {/* Sidebar: Conversation List */}
      <div className={`w-full md:w-[320px] flex-shrink-0 flex flex-col border-r bg-muted/10 ${mobileView === 'chat' && activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b bg-background">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search chats..." className="pl-9 bg-muted/50" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {groups.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Groups</h3>
              {groups.map(conv => (
                <button
                  key={conv.id} onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 ${activeConversationId === conv.id ? 'bg-muted/80' : ''}`}
                >
                  <div className="h-10 w-10 shrink-0 rounded-md bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {conv.title.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline">
                      <div className="truncate font-medium text-sm text-foreground">{conv.title}</div>
                      {conv.last_message_created_at && <div className="text-[10px] text-muted-foreground">{formatTime(conv.last_message_created_at)}</div>}
                    </div>
                    <div className="truncate text-xs text-muted-foreground mt-0.5">{conv.last_message_body || 'No messages yet'}</div>
                  </div>
                  {!!conv.unread_count && conv.unread_count > 0 && (
                    <Badge variant="default" className="rounded-full px-1.5 min-w-[20px] justify-center text-[10px]">{conv.unread_count}</Badge>
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
                  <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" title="New Message" onClick={handleOpenNewChat}>
                    <PlusIcon className="h-3 w-3" />
                  </Button>
                )}
              </h3>
              {dms.map(conv => {
                const parts = conv.participants || []
                const other = parts.find(p => p.profile_id !== currentUserId)
                const isOnline = other ? onlineUsers.has(other.profile_id) : false

                return (
                  <button
                    key={conv.id} onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 ${activeConversationId === conv.id ? 'bg-muted/80' : ''}`}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-sm overflow-hidden relative">
                      {other?.avatar_url ? (
                        <img src={other.avatar_url} alt={other?.full_name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        other?.full_name?.charAt(0) || 'U'
                      )}
                      
                      {/* Presence Indicator */}
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-background rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline">
                        <div className="truncate font-medium text-sm text-foreground">{other?.full_name || 'User'}</div>
                        {conv.last_message_created_at && <div className="text-[10px] text-muted-foreground">{formatTime(conv.last_message_created_at)}</div>}
                      </div>
                      <div className="truncate text-xs text-muted-foreground mt-0.5">{conv.last_message_body || 'No messages yet'}</div>
                    </div>
                    {!!conv.unread_count && conv.unread_count > 0 && (
                      <Badge variant="default" className="rounded-full px-1.5 min-w-[20px] justify-center text-[10px]">{conv.unread_count}</Badge>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {dms.length === 0 && actionRoute === 'agency' && (
             <div className="p-4 text-center">
               <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleOpenNewChat}>
                 <PlusIcon className="h-3 w-3 mr-1" /> Start Private Chat
               </Button>
             </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-background relative ${mobileView === 'list' && activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {/* Placeholder if no chat selected */}
        {!activeConversationId && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
            <MessageSquareIcon className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-foreground mb-2">Team Messaging</h3>
            <p className="text-center max-w-sm">Collaborate with your team in real time. Select a chat from the sidebar or start a new private conversation.</p>
            {actionRoute === 'agency' && (
              <Button className="mt-4" onClick={handleOpenNewChat}>
                <PlusIcon className="h-4 w-4 mr-2" /> Start Conversation
              </Button>
            )}
          </div>
        )}

        {activeConversation && (
          <>
            <div className="px-4 py-3 border-b bg-background/95 backdrop-blur z-10 flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden -ml-2 h-8 w-8" onClick={() => setMobileView('list')}>
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              
              <div className={`h-10 w-10 shrink-0 flex items-center justify-center font-bold text-sm overflow-hidden ${activeConversation.type === 'group' || activeConversation.is_default ? 'rounded-md bg-primary/10 text-primary' : 'rounded-full bg-secondary text-secondary-foreground'}`}>
                 {getConversationName(activeConversation).charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm truncate">{getConversationName(activeConversation)}</h2>
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                  {activeConversation.type === 'group' || activeConversation.is_default 
                    ? `${activeConversation.participants?.length || 0} members`
                    : (
                      <>
                        <span className={`w-1.5 h-1.5 rounded-full ${onlineUsers.has(activeConversation.participants?.find(p => p.profile_id !== currentUserId)?.profile_id || '') ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                        {onlineUsers.has(activeConversation.participants?.find(p => p.profile_id !== currentUserId)?.profile_id || '') ? 'Online' : 'Offline'}
                      </>
                    )}
                </div>
              </div>
            </div>

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
                    
                    const readersOfThisMessage = Object.entries(readStates)
                      .filter(([pid, mid]) => mid === msg.id && pid !== currentUserId)
                      .map(([pid]) => {
                        const participant = activeConversation?.participants?.find(p => p.profile_id === pid)
                        return participant?.full_name?.split(' ')[0] || 'Someone'
                      })
                    
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
                          
                          <div className="relative group flex items-center gap-2">
                            {isMe && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center relative">
                                <button onClick={() => setActivePicker(activePicker === msg.id ? null : msg.id)} className="p-1.5 bg-background border shadow-sm rounded-full hover:bg-muted text-muted-foreground">
                                  <SmileIcon className="h-3.5 w-3.5" />
                                </button>
                                {activePicker === msg.id && (
                                  <div className="absolute top-8 right-0 bg-background border shadow-md rounded-full p-1 flex gap-1 z-20">
                                    {EMOJIS.map(emoji => (
                                      <button key={emoji} onClick={() => { handleToggleReaction(msg.id, emoji); setActivePicker(null); }} className="hover:bg-muted rounded-full p-1.5 text-sm hover:scale-110 transition-transform">{emoji}</button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className={`px-4 py-2.5 text-[15px] leading-relaxed break-words shadow-sm whitespace-pre-wrap ${
                                isMe 
                                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                                  : 'bg-card border text-card-foreground rounded-2xl rounded-tl-sm'
                              }`}
                            >
                              {msg.body}
                            </div>

                            {!isMe && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center relative">
                                <button onClick={() => setActivePicker(activePicker === msg.id ? null : msg.id)} className="p-1.5 bg-background border shadow-sm rounded-full hover:bg-muted text-muted-foreground">
                                  <SmileIcon className="h-3.5 w-3.5" />
                                </button>
                                {activePicker === msg.id && (
                                  <div className="absolute top-8 left-0 bg-background border shadow-md rounded-full p-1 flex gap-1 z-20">
                                    {EMOJIS.map(emoji => (
                                      <button key={emoji} onClick={() => { handleToggleReaction(msg.id, emoji); setActivePicker(null); }} className="hover:bg-muted rounded-full p-1.5 text-sm hover:scale-110 transition-transform">{emoji}</button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {reactions.filter(r => r.message_id === msg.id).length > 0 && (
                            <div className={`flex gap-1 mt-1 mx-1 flex-wrap ${isMe ? 'justify-end' : 'justify-start'}`}>
                              {Object.entries(reactions.filter(r => r.message_id === msg.id).reduce((acc, r) => {
                                acc[r.emoji] = (acc[r.emoji] || 0) + 1
                                return acc
                              }, {} as Record<string, number>)).map(([emoji, count]) => {
                                const hasReacted = reactions.some(r => r.message_id === msg.id && r.emoji === emoji && r.user_id === currentUserId)
                                return (
                                  <button 
                                    key={emoji}
                                    onClick={() => handleToggleReaction(msg.id, emoji)}
                                    className={`px-1.5 py-0.5 text-[11px] rounded-full border flex items-center gap-1 transition-colors ${hasReacted ? 'border-primary text-primary bg-primary/10' : 'bg-background/80 text-muted-foreground hover:bg-muted'}`}
                                  >
                                    <span>{emoji}</span>
                                    <span>{count}</span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                          
                          <div className={`flex flex-col items-end gap-0.5 mt-1 mx-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-muted-foreground">
                              {formatTime(msg.created_at)}
                            </span>
                            
                            {isMe && readersOfThisMessage.length > 0 && (
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1 opacity-80">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-[12px] w-[12px] text-blue-500">
                                  <path d="M18 6 7 17l-5-5" />
                                  <path d="m22 10-7.5 7.5L13 16" />
                                </svg>
                                {activeConversation?.type === 'group' || activeConversation?.is_default 
                                   ? `Seen by ${readersOfThisMessage.join(', ')}` 
                                   : 'Seen'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="p-3 bg-background border-t z-10">
              <form onSubmit={handleSend} className="flex gap-2 items-end max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Shift+Enter for new line)"
                    className="w-full rounded-2xl px-4 py-3 bg-muted/50 border-muted-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[44px] max-h-[150px] resize-none leading-relaxed text-sm"
                    disabled={isSending || !activeConversationId}
                    rows={Math.min(5, Math.max(1, inputValue.split('\n').length))}
                  />
                </div>
                <Button 
                  type="submit" size="icon" 
                  className="h-[44px] w-[44px] shrink-0 rounded-full shadow-sm transition-all"
                  disabled={!inputValue.trim() || isSending || !activeConversationId}
                >
                  {isSending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4 ml-0.5" />}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* New Chat Modal */}
      <Dialog open={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Private Message</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto pr-2 mt-4 space-y-2">
            {isLoadingMembers ? (
              <div className="flex justify-center p-8 text-muted-foreground">
                <Loader2Icon className="h-6 w-6 animate-spin" />
              </div>
            ) : agencyMembers.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground p-4">No team members found.</p>
            ) : (
              agencyMembers.map(member => {
                const isOnline = onlineUsers.has(member.id)
                return (
                  <button
                    key={member.id}
                    onClick={() => handleStartPrivateChat(member.id)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors text-left"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-sm overflow-hidden relative">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        member.full_name?.charAt(0) || 'U'
                      )}
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-background rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.full_name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{member.role}</div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

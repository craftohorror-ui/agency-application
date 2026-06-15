'use client'

import { useEffect, useState } from 'react'
import { BellIcon, CheckCircle2Icon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

interface Notification {
  id: string
  conversation_id: string
  type: string
  title: string
  body: string
  is_read: boolean
  created_at: string
}

export function NotificationBell({ currentUserId }: { currentUserId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const basePath = pathname.startsWith('/portal') ? '/portal' : '/dashboard'

  useEffect(() => {
    // Initial fetch
    supabase
      .from('message_notifications')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) {
          setNotifications(data)
          setUnreadCount(data.filter(n => !n.is_read).length)
        }
      })

    // Realtime subscription
    const channel = supabase
      .channel('notifications_bell')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'message_notifications',
        filter: `user_id=eq.${currentUserId}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newNotif = payload.new as Notification
          setNotifications(prev => {
            const next = [newNotif, ...prev].slice(0, 50)
            setUnreadCount(next.filter(n => !n.is_read).length)
            return next
          })
        } else if (payload.eventType === 'UPDATE') {
          const updatedNotif = payload.new as Notification
          setNotifications(prev => {
            const next = prev.map(n => n.id === updatedNotif.id ? updatedNotif : n)
            setUnreadCount(next.filter(n => !n.is_read).length)
            return next
          })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId, supabase])

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    await supabase.from('message_notifications').update({ is_read: true }).eq('id', id)
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
    await supabase.from('message_notifications').update({ is_read: true }).eq('user_id', currentUserId).eq('is_read', false)
  }

  const handleClick = (n: Notification) => {
    if (!n.is_read) markAsRead(n.id)
    router.push(`${basePath}/messages?conversationId=${n.conversation_id}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full px-1 text-[10px] flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden rounded-xl">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground" onClick={markAllAsRead}>
              <CheckCircle2Icon className="h-3.5 w-3.5 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[350px] overflow-y-auto flex flex-col">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No notifications yet.</div>
          ) : (
            notifications.map(n => (
              <button 
                key={n.id} 
                onClick={() => handleClick(n)}
                className={`flex flex-col items-start gap-1 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors text-left ${!n.is_read ? 'bg-primary/5' : ''}`}
              >
                <div className="flex justify-between w-full items-baseline gap-2">
                  <span className={`text-sm font-medium ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(n.created_at))}</span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-2">{n.body}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

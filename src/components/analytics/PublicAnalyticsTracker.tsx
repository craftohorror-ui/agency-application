'use client'

import { useEffect, useRef } from 'react'

interface PublicAnalyticsTrackerProps {
  linkId: string
  proposalId: string
  agencyId: string
  token: string
}

export function PublicAnalyticsTracker({ linkId, proposalId, agencyId, token }: PublicAnalyticsTrackerProps) {
  const sessionIdRef = useRef<string | null>(null)
  const isIdleRef = useRef<boolean>(false)
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout

    const initSession = async () => {
      try {
        const res = await fetch('/api/proposals/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'initialize',
            linkId,
            proposalId,
            agencyId,
            token
          })
        })
        const data = await res.json()
        if (data.sessionId) {
          sessionIdRef.current = data.sessionId
          startHeartbeat()
        }
      } catch (err) {
        console.error('Analytics init failed:', err)
      }
    }

    const startHeartbeat = () => {
      heartbeatInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && !isIdleRef.current && sessionIdRef.current) {
          fetch('/api/proposals/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'heartbeat',
              sessionId: sessionIdRef.current
            }),
            keepalive: true
          }).catch(() => {})
        }
      }, 10000)
    }

    // Activity tracking to determine idle state
    const resetIdle = () => {
      isIdleRef.current = false
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      idleTimeoutRef.current = setTimeout(() => {
        isIdleRef.current = true
      }, 30000) // 30s of no mouse/scroll/keyboard = idle
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }))
    resetIdle()

    // Initialize the session immediately
    initSession()

    // Teardown beacon
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionIdRef.current) {
        navigator.sendBeacon(
          '/api/proposals/analytics',
          JSON.stringify({ action: 'heartbeat', sessionId: sessionIdRef.current })
        )
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(heartbeatInterval)
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      events.forEach(e => window.removeEventListener(e, resetIdle))
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [linkId, proposalId, agencyId, token])

  return null // This component does not render anything
}

import { NextResponse } from 'next/server'
import { initializeProposalSession, recordHeartbeat } from '@/lib/proposals-analytics'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, token, proposalId, agencyId, sessionId } = body

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 })
    }

    // Initialize a new session
    if (action === 'initialize') {
      if (!token || !proposalId || !agencyId) {
        return NextResponse.json({ error: 'Missing required initialization fields' }, { status: 400 })
      }

      // Extract IP and UserAgent for anonymized hashing
      const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
      const userAgent = request.headers.get('user-agent') || 'Unknown'

      // We look up the link ID based on the token
      // Wait, we need linkId. We can fetch getProposalFromToken to get link.id
      // But we can just have the frontend pass it.
      // Actually, initializeProposalSession takes linkId, proposalId, agencyId.
      // Let's modify initializeProposalSession to take the linkId from the frontend,
      // or we can just fetch it securely here. But the frontend already has it from the page load.
      // So the frontend can pass linkId. Let's assume frontend passes linkId.
      const { linkId } = body
      if (!linkId) return NextResponse.json({ error: 'Missing linkId' }, { status: 400 })

      const newSessionId = await initializeProposalSession(linkId, proposalId, agencyId, ip, userAgent)
      
      return NextResponse.json({ sessionId: newSessionId })
    }

    // Record a heartbeat for an active session
    if (action === 'heartbeat') {
      if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
      }

      const success = await recordHeartbeat(sessionId)
      if (!success) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error: unknown) {
    console.error('Analytics API Error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

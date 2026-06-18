import { requireStaff } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  try {
    // Auth guard — avatars are private; only authenticated staff can access
    const { supabase, profile } = await requireStaff()

    const params = await props.params
    const path = params.path.join('/')
    const targetUserId = params.path[0]

    if (!targetUserId) {
      return new NextResponse('Not found', { status: 404 })
    }

    // V-1 IDOR FIX: Validate that the target user's avatar belongs to the same agency
    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('agency_id')
      .eq('id', targetUserId)
      .maybeSingle()

    if (!targetProfile || targetProfile.agency_id !== profile.agency_id) {
      return new NextResponse('Not found', { status: 404 })
    }
    
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase.storage.from('avatars').download(path)
    
    if (error || !data) {
      return new NextResponse('Not found', { status: 404 })
    }

    const buffer = await data.arrayBuffer()
    const contentType = data.type || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        // private: browser-only cache. Not cached by CDNs or shared proxies.
        'Cache-Control': 'private, max-age=3600'
      }
    })
  } catch (err) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

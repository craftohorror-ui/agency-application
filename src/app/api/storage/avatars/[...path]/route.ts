import { requireStaff } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  try {
    // Auth guard — avatars are private; only authenticated staff can access
    await requireStaff()

    const params = await props.params
    const path = params.path.join('/')
    
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

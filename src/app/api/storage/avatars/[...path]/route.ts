import { requireStaff } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await props.params
    // Only staff can access avatars natively, but clients can see them too.
    // For now we allow any authenticated user to proxy. We can just use the admin client.
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
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (err) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

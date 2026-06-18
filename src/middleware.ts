import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = { name: string; value: string; options: CookieOptions }

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet: CookieToSet[]) => {
          cookiesToSet.forEach(({ name, value }: CookieToSet) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const path = req.nextUrl.pathname
  const isProtected = path.startsWith('/dashboard') || path.startsWith('/portal')

  if (!user && isProtected) {
    const url = new URL('/login', req.url)
    url.searchParams.set('next', path)
    const redirectRes = NextResponse.redirect(url)
    res.cookies.getAll().forEach(cookie => {
      redirectRes.cookies.set(cookie.name, cookie.value)
    })
    return redirectRes
  }
  if (user && (path === '/login' || path === '/signup')) {
    const redirectRes = NextResponse.redirect(new URL('/', req.url))
    res.cookies.getAll().forEach(cookie => {
      redirectRes.cookies.set(cookie.name, cookie.value)
    })
    return redirectRes
  }

  // Strict Middleware Protection for Owner-only routes
  if (user && path.startsWith('/dashboard')) {
    const ownerOnlyPaths = [
      '/dashboard/admin',
      '/dashboard/team',
      '/dashboard/analytics'
    ]
    
    const isOwnerRoute = ownerOnlyPaths.some(p => path === p || path.startsWith(`${p}/`))
    
    if (isOwnerRoute) {
      // Fetch user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      if (profile?.role !== 'owner') {
        // Members receive 403 Forbidden or redirect. We'll return 403.
        return new NextResponse('403 Forbidden', { status: 403 })
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/portal/:path*',
    '/print-contract/:path*',
    '/print-invoice/:path*',
    '/login',
    '/signup'
  ],
}

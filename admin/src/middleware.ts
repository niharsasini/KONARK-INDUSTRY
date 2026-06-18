import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // These paths are always public - never redirect
  const publicPaths = [
    '/admin-login',
    '/_next',
    '/favicon.ico',
    '/api',
  ]

  // Check if current path is public
  const isPublic = publicPaths.some(path =>
    pathname.startsWith(path)
  )

  // If public path, always allow through
  if (isPublic) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const adminAuth = request.cookies.get('admin_auth')

  // If no auth cookie and trying to access protected route
  if (!adminAuth || adminAuth.value !== 'true') {
    const loginUrl = new URL('/admin-login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Has valid cookie - allow through
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).+)',
  ],
}

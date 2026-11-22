import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './src/lib/auth'

export async function proxy(request: NextRequest) {
  if (/^\/all-equipment\/?$/.test(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/all-equipment/:path*',
    '/customer/:path*',
    '/owner/:path*',
    '/admin/:path*',
  ],
}
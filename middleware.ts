import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For now, let's handle authentication at component level
  // This middleware can be enhanced later with proper NextAuth integration
  
  if (pathname.startsWith("/api/tts") ||
      pathname.startsWith("/api/user") ||
      pathname.startsWith("/api/history")) {
    // API routes will handle their own authentication
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/tts/:path*",
    "/api/user/:path*",
    "/api/history/:path*"
  ]
}
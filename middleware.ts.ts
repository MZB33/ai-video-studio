import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory storage for tracking rate limits
const rateLimitMap = new Map<string, number[]>();

export function middleware(request: NextRequest) {
  // Target API endpoints exclusively to keep system light
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 Minute window 
  const maxRequests = 45;     // Upgraded from 30 to give clients comfortable leeway

  // Retrieve existing client log logs
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Prune any outdated timestamps outside active time frame window
  const activeTimestamps = timestamps.filter(timeItem => now - timeItem < windowMs);
  
  if (activeTimestamps.length >= maxRequests) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many text-to-speech requests. Please wait a minute before generating audio again.' 
      }),
      { 
        status: 429, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Register current hit timestamp
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  
  return NextResponse.next();
}

// Next.js standard config matcher assignment 
export const config = {
  matcher: '/api/:path*',
};
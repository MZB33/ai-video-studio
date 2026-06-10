import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple rate limiting (in-memory)
const rateLimit = new Map<string, number[]>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30; // 30 requests per minute
  
  const timestamps = rateLimit.get(ip) || [];
  const recent = timestamps.filter(t => now - t < windowMs);
  
  if (recent.length >= maxRequests) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  recent.push(now);
  rateLimit.set(ip, recent);
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*', // Apply to all API routes
};
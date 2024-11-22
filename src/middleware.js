// middleware.js (or middleware.ts for TypeScript)

import { NextResponse } from 'next/server';

export function middleware(request) {
  // Create a response object with cache-control headers
  const response = NextResponse.next();

  // Set the cache-control headers to disable caching
  response.headers.set('Cache-Control', 'no-store');

  console.log("cache false")

  return response;
}

// Apply the middleware globally to all routes
export const config = {
  matcher: ['/', '/api/:path*', '/pages/:path*'],  // This applies to all pages and API routes
};

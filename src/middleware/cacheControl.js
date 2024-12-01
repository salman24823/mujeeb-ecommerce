import { NextResponse } from 'next/server';

export function middleware(request) {
  // Prevent caching

  console.log("middleware start")

  const response = NextResponse.next();

  // Cache control headers to force fresh data fetch
  response.headers.set('Cache-Control', 'no-store, must-revalidate');

  // Optionally, log the request for debugging purposes
  console.log('Middleware: Forcing fresh data fetch');



  return response;
}

export const config = {
  matcher: '/(.*)',  // Apply to all routes
};
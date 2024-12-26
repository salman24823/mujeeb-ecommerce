import { NextResponse } from 'next/server';

export function middleware(req) {

    console.log("middleware starts")

  const url = req.nextUrl;

  // Example 1: Add timestamp query parameter for all routes
  url.searchParams.set('timestamp', Date.now());

  // Example 2: Modify Cache-Control headers for API routes
  if (url.pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  console.log("middleware end")

  // Pass-through for other routes
  return NextResponse.rewrite(url);
}

// Apply middleware to all routes
export const config = {
  matcher: '/:path*', // Runs for all routes
};

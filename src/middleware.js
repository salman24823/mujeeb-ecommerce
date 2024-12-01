// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Custom Cache Control Middleware
export function middleware(request) {
  console.log("Cache control middleware start");

  // Cache control headers to force fresh data fetch
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, must-revalidate');

  console.log('Middleware: Forcing fresh data fetch');

  // Apply authentication middleware (withAuth) after cache control
  return withAuth({
    pages: {
      signIn: '/',  // Customize the login page if the user is not authenticated
      error: '/',   // Customize the error page
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure you set this in your environment variables
  })(request, response);  // Pass both request and response to `withAuth`
}

export const config = {
  matcher: "/((?!_next|static|favicon.ico|^/$|^/signup).*)", // Exclude home page and signup page from auth
};

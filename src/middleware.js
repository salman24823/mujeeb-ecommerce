// middleware.js (or middleware.ts)
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/',  // Customize the login page if the user is not authenticated
    error: '/',   // Customize the error page
  },
  // This ensures the middleware applies to all paths in the app
  secret: process.env.NEXTAUTH_SECRET, // Make sure you set a secret for better security (optional but recommended)
});

export const config = {
  matcher: [
    // Protect all pages except for the home page '/'
    "/((?!_next|static|favicon.ico|^/$).*)",  // Exclude home page
  ],
};

// authOptions.js

import database from "@/config/connectDB";
import User from "@/models/userModel";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await database(); // Connect to the database

          // Check if user exists by email
          const user = await User.findOne({ email });

          if (!user) {
            // User not found, return null
            return null;
          }

          // Plaintext password comparison (no hashing in this case)
          if (user.password === password) {
            // If passwords match, return user
            return user;
          } else {
            // Passwords don't match, return null
            return null;
          }

        } catch (error) {
          console.error("Error during authentication:", error);
          return null; // In case of error, return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT session strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Custom sign-in page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; 
      session.user.username = token.username;
      session.user.email = token.email;
      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST };

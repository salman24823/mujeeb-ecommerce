import database from "@/app/config/connectDB";
import User from "@/models/userModel";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
import adminModel from "@/models/adminModel";

export const authOptions = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials;

        try {
          await database(); // Connect to the database

          let user;

          if (username === "admin") {
            user = await adminModel.findOne({ username });
          } else {
            user = await User.findOne({ username });
          
            // If user exists and is NOT an admin, check if the status is activated
            // if (user && user.status !== "activated") {
            //   return null; // User is not activated
            // }
          }

          if (!user) {
            return null; // User not found
          }

          // Compare hashed password with provided password
          // const isMatch = await bcrypt.compare(password, user.password);

          // compare passwords directly for simplicity
          const isMatch = password === user.password;
          
          if (!isMatch) {
            return null; // Invalid password
          }

          return user; // Authentication successful

        } catch (error) {
          console.error("Error during authentication:", error);
          return null; // Return null on error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
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
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.status = token.status;
      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST };
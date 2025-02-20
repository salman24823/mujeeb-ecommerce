import database from "@/config/connectDB";
import User from "@/models/userModel";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import adminModel from "@/models/adminModel";

export const authOptions = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await database(); // Connect to the database

          let user;

          if(email == "admin@gmail.com"){
            user = await adminModel.findOne({email})
          }else {
            user = await User.findOne({ email });
          }

          if (!user) {
            return null; // User not found
          }

          // Compare hashed password with provided password
          const isMatch = await bcrypt.compare(password, user.password);

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

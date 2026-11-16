import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
} from "@/lib/user-store";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Platform Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await findUserByEmail(credentials.email);
        if (!user || user.scope !== "platform") {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          scope: "platform",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.scope = "platform";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).scope = "platform";
      }
      return session;
    },
  },
  pages: {
    signIn: "/platform/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
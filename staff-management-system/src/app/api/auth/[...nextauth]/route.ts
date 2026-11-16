import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import {
  findUserByEmail,
  findUserByEmailAndTenant,
  findTenantBySlug,
} from "@/lib/user-store";

const DEMO_AUTH_EMAIL = process.env.DEMO_AUTH_EMAIL || "admin@workbench.com";
const DEMO_AUTH_PASSWORD = process.env.DEMO_AUTH_PASSWORD || "admin123";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const AUTH_MODE = process.env.AUTH_MODE || "single";

const isMultiAuth = AUTH_MODE === "multi";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantSlug: { label: "Tenant Slug", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        if (!IS_PRODUCTION && credentials.email === DEMO_AUTH_EMAIL && credentials.password === DEMO_AUTH_PASSWORD) {
          return { id: "demo-user", email: DEMO_AUTH_EMAIL, scope: "tenant" };
        }

        if (isMultiAuth && credentials.tenantSlug) {
          const tenant = await findTenantBySlug(credentials.tenantSlug);
          if (!tenant) throw new Error("Tenant not found");
          if (!tenant.active) throw new Error("Tenant pending activation");

          const user = await findUserByEmailAndTenant(credentials.email, credentials.tenantSlug);
          if (!user) throw new Error("No user found with this email for this tenant");

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) throw new Error("Incorrect password");

          return {
            id: String(user.id),
            email: user.email,
            name: user?.name,
            scope: user.scope || "tenant",
            tenantId: user.tenantId ?? undefined,
            tenantSlug: user.tenantSlug ?? undefined,
          };
        }

        let user;
        try {
          user = await findUserByEmail(credentials.email);
        } catch {
          throw new Error(`Database is not configured. Use demo login: ${DEMO_AUTH_EMAIL} / ${DEMO_AUTH_PASSWORD}`);
        }

        if (!user) throw new Error("No user found with this email");

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: String(user.id),
          email: user.email,
          name: user?.name,
          scope: user.scope || "tenant",
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 28800 },
  jwt: { maxAge: 28800 },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: isMultiAuth ? "/tenant/login" : "/login" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user?.name;
        token.scope = user.scope || "tenant";
        token.tenantId = user.tenantId ?? null;
        token.tenantSlug = user.tenantSlug ?? null;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token?.name;
        session.user.scope = token.scope || "tenant";
        session.user.tenantId = token.tenantId ?? null;
        session.user.tenantSlug = token.tenantSlug ?? null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

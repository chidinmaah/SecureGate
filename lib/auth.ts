import { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validations";
import { createSession, validateSession, touchSession } from "@/lib/session";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as unknown as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        if (!user.emailVerified) {
          throw new Error("unverified");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          userAgent: req?.headers?.["user-agent"] ?? "Unknown",
          ipAddress: req?.headers?.["x-forwarded-for"] ?? "Unknown",
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.emailVerified && session.user) {
        session.user.emailVerified = token.emailVerified;
      }
      session.sessionId = token.sessionId;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.emailVerified = user.emailVerified;
        token.sessionId = await createSession(
          user.id,
          user.userAgent ?? "Unknown",
          user.ipAddress ?? "Unknown"
        );
      }

      if (token.sessionId) {
        const valid = await validateSession(token.sessionId);
        if (!valid) {
          return {};
        }
        touchSession(token.sessionId);
      }

      return token;
    },
  },
};

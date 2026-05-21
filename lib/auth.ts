import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validations";

export const authOptions: NextAuthOptions = {
  // @ts-ignore - PrismaAdapter type conflict with newer peer deps sometimes happens
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
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
        session.user.emailVerified = token.emailVerified as Date;
      }
      (session as any).sessionId = token.sessionId;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.emailVerified = user.emailVerified;
        // Create a session record on new sign-in
        const session = await db.userSession.create({
          data: {
            userId: user.id,
            userAgent: (user as any).userAgent ?? "Unknown",
            ipAddress: (user as any).ipAddress ?? "Unknown",
          },
        });
        token.sessionId = session.id;
      }

      // On every token refresh, check if session is still valid
      if (token.sessionId) {
        const session = await db.userSession.findUnique({
          where: { id: token.sessionId as string },
        });
        if (!session || session.isRevoked) {
          // If the session was revoked, force sign-out
          return {} as any;
        }
        // Touch lastActiveAt (fire-and-forget)
        db.userSession.update({
          where: { id: session.id },
          data: { lastActiveAt: new Date() },
        }).catch(() => {});
      }

      return token;
    },
  },
};

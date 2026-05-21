import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getPrisma } from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";
        const turnstileToken = credentials?.turnstileToken ?? "";

        if (!email || !password || !turnstileToken) {
          return null;
        }

        const turnstileResult = await verifyTurnstileToken(turnstileToken, {
          action: "admin_login",
        });

        if (!turnstileResult.success) {
          return null;
        }

        const user = await getPrisma().user.findUnique({ where: { email } });

        if (!user || user.role !== "ADMIN") {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "관리자",
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
};

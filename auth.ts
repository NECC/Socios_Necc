import NextAuth, { type DefaultSession } from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "login@socios.necc.pt",
    }),
  ],

  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          name: user.name,
          role: user.role,
          memberNumber: user.memberNumber,
          studentNumber: user.studentNumber,
        },
      };
    },
  },
});

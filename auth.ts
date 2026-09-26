import NextAuth, { type DefaultSession } from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
declare module "next-auth" {
  interface Session {
    user: {
      memberNumber?: string;
      email?: string;
      name: string;
      studentNumber?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "login@socios.necc.pt",
    }),
  ],
});

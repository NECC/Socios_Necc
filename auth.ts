import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Resend as ResendClient } from "resend";

const resend = new ResendClient(process.env.AUTH_RESEND_KEY);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "login@socios.necc.pt",

      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: "NECC <login@socios.necc.pt>",
          to: identifier,
          subject: "Acesso à área de sócios — NECC",
          text: `Para acederes à tua área de sócio, utiliza o seguinte link:

${url}

Se não solicitaste este acesso, ignora este email.`,
        });
      },
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
  pages: {
    signIn: "/",
  },
});

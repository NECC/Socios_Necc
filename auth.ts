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

          html: `
            <!DOCTYPE html>
            <html lang="pt">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Acesso à área de sócios</title>
              </head>

              <body style="
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                font-family: Arial, Helvetica, sans-serif;
                color: #ffffff;
              ">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="background-color: #f9f9f9; padding: 40px 20px;"
                >
                  <tr>
                    <td align="center">

                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                          max-width: 480px;
                          background-color: #202A3D;
                          border-radius: 16px;
                          overflow: hidden;
                        "
                      >

                        <!-- Header -->
                        <tr>
                          <td
                            align="center"
                            style="
                              padding: 32px 30px 24px;
                              background: linear-gradient(
                                135deg,
                                #5C8DFF,
                                #6B5BF9
                              );
                            "
                          >
                            <div style="
                              font-size: 30px;
                              font-weight: 700;
                              letter-spacing: 1px;
                              color: #ffffff;
                            ">
                              NECC
                            </div>

                            <div style="
                              margin-top: 6px;
                              font-size: 13px;
                              color: rgba(255,255,255,0.85);
                            ">
                              Núcleo de Estudantes de Ciências da Computação
                            </div>
                          </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                          <td style="padding: 36px 30px;">

                            <h1 style="
                              margin: 0 0 16px;
                              font-size: 24px;
                              line-height: 1.3;
                              font-weight: 600;
                              color: #ffffff;
                            ">
                              Bem-vindo!
                            </h1>

                            <p style="
                              margin: 0 0 12px;
                              font-size: 15px;
                              line-height: 1.7;
                              color: #92B4D4;
                            ">
                              Recebemos um pedido de acesso à tua área de sócio.
                            </p>

                            <p style="
                              margin: 0 0 28px;
                              font-size: 15px;
                              line-height: 1.7;
                              color: #92B4D4;
                            ">
                              Clica no botão abaixo para entrar na plataforma.
                            </p>

                            <!-- Button -->
                            <table
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                            >
                              <tr>
                                <td align="center">

                                  <a
                                    href="${url}"
                                    style="
                                      display: inline-block;
                                      padding: 14px 28px;
                                      background-color: #3B9EFF;
                                      color: #ffffff;
                                      text-decoration: none;
                                      font-size: 15px;
                                      font-weight: 600;
                                      border-radius: 10px;
                                    "
                                  >
                                    Entrar na minha conta
                                  </a>

                                </td>
                              </tr>
                            </table>

                            <p style="
                              margin: 28px 0 0;
                              font-size: 12px;
                              line-height: 1.6;
                              color: #92B4D4;
                              opacity: 0.7;
                            ">
                              Se não foste tu que pediste este acesso, podes
                              ignorar este email.
                            </p>

                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td
                            align="center"
                            style="
                              padding: 20px 30px;
                              border-top: 1px solid rgba(255,255,255,0.08);
                            "
                          >
                            <p style="
                              margin: 0;
                              font-size: 12px;
                              color: #92B4D4;
                            ">
                              © NECC · Universidade do Minho
                            </p>
                          </td>
                        </tr>

                      </table>

                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
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
});


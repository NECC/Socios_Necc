import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sócios NECC",
    template: "%s | Sócios NECC",
  },
  description:
    "Plataforma de gestão e acesso à área de sócios do Núcleo de Estudantes de Ciências da Computação da Universidade do Minho.",
  applicationName: "Sócios NECC",
  authors: [
    {
      name: "NECC",
      url: "https://necc.pt",
    },
  ],
  icons: {
    icon: "/logo.png",
  },
  creator: "NECC",
  publisher: "NECC",
  keywords: [
    "NECC",
    "Ciências da Computação",
    "Universidade do Minho",
    "Sócios",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}

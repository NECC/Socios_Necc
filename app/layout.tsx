import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogr",
  description: "A fullstack blog starter built with Next.js and Prisma.",
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

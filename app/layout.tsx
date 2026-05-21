import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const interTight = Inter_Tight({ 
  subsets: ["latin"],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: "SecureGate | Production-Ready Auth",
  description: "Secure, standalone authentication system for developers.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={interTight.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

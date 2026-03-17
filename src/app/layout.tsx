import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: "Crush Test",
    template: "%s | Crush Test",
  },
  description:
    "Create anonymous crush tests, collect responses, and manage campaigns with an admin dashboard.",
  applicationName: "Crush Test",
  keywords: [
    "crush test",
    "anonymous personality test",
    "compatibility test",
    "next.js app",
  ],
  openGraph: {
    title: "Crush Test",
    description:
      "Create anonymous crush tests, collect responses, and manage campaigns.",
    siteName: "Crush Test",
    type: "website",
    url: env.SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Crush Test",
    description:
      "Create anonymous crush tests, collect responses, and manage campaigns.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

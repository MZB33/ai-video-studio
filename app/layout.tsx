import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PublicAppMonitor from "@/components/shared/PublicAppMonitor";
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
  title: "AI Video Studio",
  description: "Transform your stories into cinematic masterpieces",
  openGraph: {
    title: "AI Video Studio",
    description: "Create stunning videos with AI",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Video Studio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://your-domain.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PublicAppMonitor />
        {children}
      </body>
    </html>
  );
}

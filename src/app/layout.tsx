import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
  metadataBase: new URL("https://tft1trick.com"),
  title: {
    default: "tft1trick",
    template: "%s | tft1trick",
  },
  description: "TFT one-trick insights, comps, and climb journey by tft1trick.",
  icons: {
    icon: "/tft1trick-logo.png",
    shortcut: "/tft1trick-logo.png",
    apple: "/tft1trick-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-zinc-100">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 md:px-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

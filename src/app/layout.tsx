import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
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
    default: "TFT1Trick | The Teamfight Tactics one-trick playbook",
    template: "%s | TFT1Trick",
  },
  description: "TFT one-trick insights, patch approaches, and climb journey by TFT1Trick.",
  icons: {
    icon: "/tft1trick-monogram-squared.png",
    shortcut: "/tft1trick-monogram-squared.png",
    apple: "/tft1trick-monogram-squared.png",
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
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}

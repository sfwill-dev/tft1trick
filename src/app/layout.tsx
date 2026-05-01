import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { toSafeJsonLd } from "@/lib/seo";
import "./globals.css";

const DEFAULT_DESCRIPTION =
  "TFT one-trick insights, patch approaches, and climb journey by TFT1Trick.";
const DEFAULT_OG_IMAGE = "/tft1trick-monogram-squared.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TFT1Trick | The Teamfight Tactics one-trick playbook",
    template: "%s | TFT1Trick",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "TFT1Trick | The Teamfight Tactics one-trick playbook",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 1200,
        alt: "TFT1Trick monogram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TFT1Trick | The Teamfight Tactics one-trick playbook",
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
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
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-zinc-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toSafeJsonLd(websiteJsonLd) }}
        />
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

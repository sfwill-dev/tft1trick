import type { Metadata } from "next";
import Link from "next/link";
import { GuideList } from "@/components/GuideList";
import { SITE_URL } from "@/lib/constants";
import { getRecentGuides } from "@/lib/guides";
import { getGuideEntries } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Guides",
  description: "Latest TFT one-trick guides and breakdowns by TFT1Trick.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    url: `${SITE_URL}/guides`,
  },
};

export default async function GuidesPage() {
  const guideEntries = await getGuideEntries().catch((error) => {
    console.error("Failed to load guide entries", error);
    return [];
  });

  const recentGuides = getRecentGuides(guideEntries, 5);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Guides</h1>
        <p className="text-sm text-zinc-300">Latest TFT one-trick guides and breakdowns.</p>
      </header>

      {recentGuides.length === 0 ? (
        <p className="text-sm text-zinc-300">No guides available yet.</p>
      ) : (
        <GuideList guides={recentGuides} />
      )}

      <div>
        <Link
          href="/guides/all"
          className="inline-flex items-center text-sm font-medium text-zinc-300 underline decoration-zinc-500 underline-offset-4 transition hover:text-zinc-50 hover:decoration-amber-300"
        >
          All guides →
        </Link>
      </div>
    </section>
  );
}

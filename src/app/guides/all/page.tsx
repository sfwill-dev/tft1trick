import type { Metadata } from "next";
import { GuideList } from "@/components/GuideList";
import { SITE_URL } from "@/lib/constants";
import { sortGuidesByDateDescending } from "@/lib/guides";
import { getGuideEntries } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "All Guides",
  description: "Full archive of TFT one-trick guides by TFT1Trick.",
  alternates: {
    canonical: "/guides/all",
  },
  openGraph: {
    url: `${SITE_URL}/guides/all`,
  },
};

export default async function AllGuidesPage() {
  const guideEntries = await getGuideEntries().catch((error) => {
    console.error("Failed to load guide entries", error);
    return [];
  });

  const allGuides = sortGuidesByDateDescending(guideEntries);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">All guides</h1>
      </header>

      {allGuides.length === 0 ? (
        <p className="text-sm text-zinc-300">No guides available yet.</p>
      ) : (
        <GuideList guides={allGuides} />
      )}
    </section>
  );
}

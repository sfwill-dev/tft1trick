import type { Metadata } from "next";
import Link from "next/link";
import { formatGuideDate } from "@/lib/format";
import { sortGuidesByDateDescending } from "@/lib/guides";
import { getGuideEntries } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "All Guides",
  description: "Full archive of TFT one-trick guides by TFT1Trick.",
  alternates: {
    canonical: "/guides/all",
  },
  openGraph: {
    url: "https://tft1trick.com/guides/all",
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
        <ul className="space-y-5">
          {allGuides.map((guide) => (
            <li key={guide.slug}>
              <article className="space-y-1">
                <time className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                  {formatGuideDate(guide.frontmatter.date)}
                </time>
                <div>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group text-zinc-200 transition hover:text-zinc-50 text-lg"
                  >
                    {guide.frontmatter.title}
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

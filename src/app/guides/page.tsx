import Link from "next/link";
import { getRecentGuides } from "@/lib/guides";
import { getGuideEntries } from "@/lib/mdx";

function formatGuideDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

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
        <ul className="space-y-5">
          {recentGuides.map((guide) => (
            <li key={guide.slug}>
              <article className="space-y-1">
                <time className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                  {formatGuideDate(guide.frontmatter.date)}
                </time>
                <div>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group text-zinc-200 transition hover:text-zinc-50"
                  >
                    <span className="text-lg font-medium underline decoration-zinc-500 underline-offset-4 group-hover:decoration-amber-300">
                      {guide.frontmatter.title}
                    </span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
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

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { BoardTab, BoardTabs } from "@/components/BoardTabs";
import { getGuideBySlug, sortGuidesByDateDescending } from "@/lib/guides";
import { getGuideEntries } from "@/lib/mdx";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatGuideDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function generateStaticParams() {
  const entries = await getGuideEntries().catch((error) => {
    console.error("Failed to read guide entries while generating static params", error);
    return [];
  });

  return entries.map((entry) => ({ slug: entry.slug }));
}

export default async function GuidePage({ params }: GuidePageProps) {
  const routeParams = await params;

  const entries = await getGuideEntries().catch((error) => {
    console.error("Failed to load guide entries", error);
    return [];
  });

  const sortedEntries = sortGuidesByDateDescending(entries);
  const entry = getGuideBySlug(sortedEntries, routeParams.slug);

  if (!entry) {
    notFound();
  }

  return (
    <article className="space-y-0">
      <header className="space-y-2 pb-6">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
          {formatGuideDate(entry.frontmatter.date)}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          {entry.frontmatter.title}
        </h1>
      </header>

      <div className="mdx-content space-y-4 text-base leading-7 text-zinc-200 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-50 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        <MDXRemote source={entry.content} components={{ BoardTabs, BoardTab }} />
      </div>
    </article>
  );
}

import { MDXRemote } from "next-mdx-remote/rsc";
import type { CompMdxEntry } from "@/lib/mdx";

type CompSectionProps = {
  entry: CompMdxEntry | null;
};

function formatPublishedDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function CompSection({ entry }: CompSectionProps) {
  if (!entry) {
    return (
      <section className="py-1">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
          No comp content available
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          We couldn&apos;t find a comp entry for this patch. Add a patch file in
          <code className="ml-1 text-zinc-100 underline underline-offset-2">content/comps</code>
          to render guidance.
        </p>
      </section>
    );
  }

  return (
    <article className="space-y-0">
      <header className="space-y-2 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-300">
          Set {entry.frontmatter.set} • Patch {entry.frontmatter.patch}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {entry.frontmatter.title}
        </h2>
        <p className="text-xs text-zinc-400">
          Published {formatPublishedDate(entry.frontmatter.publishedAt)}
        </p>
      </header>

      <div className="space-y-4 border-t border-zinc-200/20 pt-6 text-sm leading-7 text-zinc-200 [&_a]:font-medium [&_a]:text-amber-300 [&_a]:underline [&_a]:decoration-amber-400/60 [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:hover:text-amber-200 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-50 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        <MDXRemote source={entry.content} />
      </div>
    </article>
  );
}

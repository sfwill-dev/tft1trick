import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { PatchMdxEntry } from "@/lib/mdx";

type PatchSectionProps = {
  entry: PatchMdxEntry | null;
  latestPatch?: string | null;
};

function formatUpdatedAtDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function PatchSection({ entry, latestPatch = null }: PatchSectionProps) {
  if (!entry) {
    return (
      <section className="py-1">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
          No patch content available
        </h2>
        <p className="mt-2 text-base leading-6 text-zinc-300">
          We couldn&apos;t find a patch entry for this patch. Add a patch file in
          <code className="ml-1 text-zinc-100 underline underline-offset-2">content/patches</code>
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
        <p className="text-xs text-zinc-400">
          Updated {formatUpdatedAtDate(entry.frontmatter.updatedAt)}
        </p>

        {latestPatch && entry.frontmatter.patch !== latestPatch ? (
          <p className="max-w-2xl mt-8 rounded-md border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-sm leading-5 text-amber-100">
            ⚠️ This is an archived patch post. For the current patch, see{" "}
            <Link href={`/patches/${latestPatch}`}>patch {latestPatch}</Link>.
          </p>
        ) : null}
      </header>

      <div className="mdx-content space-y-4 text-base leading-7 text-zinc-200 mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-50 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        <MDXRemote source={entry.content} />
      </div>
    </article>
  );
}

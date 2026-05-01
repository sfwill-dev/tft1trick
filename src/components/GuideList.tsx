import Link from "next/link";
import type { GuideMdxEntry } from "@/lib/mdx";
import { formatGuideDate } from "@/lib/format";

type GuideListProps = {
  guides: GuideMdxEntry[];
};

export function GuideList({ guides }: Readonly<GuideListProps>) {
  return (
    <ul className="space-y-5">
      {guides.map((guide) => (
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
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { BoardTab, BoardTabs } from "@/components/BoardTabs";
import { formatGuideDate } from "@/lib/format";
import { getGuideBySlug, sortGuidesByDateDescending } from "@/lib/guides";
import { getGuideEntries } from "@/lib/mdx";

const SITE_URL = "https://tft1trick.com";
const GUIDE_DESCRIPTION_FALLBACK_SUFFIX = " — TFT one-trick guide by TFT1Trick.";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const entries = await getGuideEntries().catch((error) => {
    console.error("Failed to read guide entries while generating static params", error);
    return [];
  });

  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const routeParams = await params;
  const guidePath = `/guides/${routeParams.slug}`;
  const guideUrl = `${SITE_URL}${guidePath}`;

  const entries = await getGuideEntries().catch((error) => {
    console.error("Failed to load guide entries for metadata", error);
    return [];
  });
  const sortedEntries = sortGuidesByDateDescending(entries);
  const entry = getGuideBySlug(sortedEntries, routeParams.slug);

  if (!entry) {
    return {
      title: "Guide not found",
      description: "Requested TFT guide could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    entry.excerpt.length > 0
      ? entry.excerpt
      : `${entry.frontmatter.title}${GUIDE_DESCRIPTION_FALLBACK_SUFFIX}`;

  return {
    title: entry.frontmatter.title,
    description,
    alternates: {
      canonical: guidePath,
    },
    openGraph: {
      type: "article",
      url: guideUrl,
      title: entry.frontmatter.title,
      description,
      publishedTime: `${entry.frontmatter.date}T00:00:00.000Z`,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.frontmatter.title,
      description,
    },
  };
}

export default async function GuidePage({ params }: Readonly<GuidePageProps>) {
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

  const guideUrl = `${SITE_URL}/guides/${entry.slug}`;
  const articleDescription =
    entry.excerpt.length > 0
      ? entry.excerpt
      : `${entry.frontmatter.title}${GUIDE_DESCRIPTION_FALLBACK_SUFFIX}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.frontmatter.title,
    description: articleDescription,
    datePublished: `${entry.frontmatter.date}T00:00:00.000Z`,
    dateModified: `${entry.frontmatter.date}T00:00:00.000Z`,
    inLanguage: "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": guideUrl,
    },
    author: {
      "@type": "Person",
      name: "TFT1Trick",
    },
    publisher: {
      "@type": "Organization",
      name: "TFT1Trick",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
    </>
  );
}

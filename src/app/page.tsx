import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getLatestGuide } from "@/lib/guides";
import { getGuideEntries, getHomePageSource } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Home",
  description:
    "TFT1Trick - The TFT one-trick playbook: patch-by-patch guides, ranked climb insights, and practical TFT fundamentals.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://tft1trick.com/",
  },
};

export default async function Home() {
  const homePageSource = await getHomePageSource();

  let latestGuide = null;

  try {
    const guideEntries = await getGuideEntries();
    latestGuide = getLatestGuide(guideEntries);
  } catch (error) {
    console.error("Failed to load guide entries for Home CTA label", error);
  }

  return (
    <section className="space-y-0">
      <header className="pb-10 pt-2">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 header-logo">
          <div className="flex h-[180px] w-[180px] shrink-0 items-center justify-center rounded-full bg-white border-3 border-black">
            <Image
              alt="TFT1Trick avatar"
              height={150}
              priority
              src="/tft1trick-avatar.png"
              width={150}
              className="pb-4"
            />
          </div>

          <div className="space-y-5 text-center sm:text-left">
            <h1 className="mx-auto max-w-3xl text-2xl font-semibold tracking-tight text-zinc-50 sm:mx-0 sm:text-3xl">
              The TFT one-trick playbook
            </h1>

            {latestGuide ? (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Latest guide</p>
                <Link
                  className="inline-flex items-center text-lg font-semibold tracking-tight text-amber-300! no-underline! hover:underline! decoration-zinc-500 underline-offset-4 transition hover:text-amber-200 hover:decoration-amber-300 sm:text-xl"
                  href={`/guides/${latestGuide.slug}`}
                >
                  {latestGuide.frontmatter.title} →
                </Link>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-base font-medium text-white transition hover:bg-red-500"
                href="https://www.youtube.com/@TFT1Trick/?sub_confirmation=1"
                rel="noopener noreferrer"
                target="_blank"
              >
                Subscribe to YouTube
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="border-t border-zinc-200/20 py-10">
        <div className="mdx-content mt-4 space-y-4 text-base leading-7 text-zinc-200 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          <MDXRemote source={homePageSource} />
        </div>
      </div>
    </section>
  );
}

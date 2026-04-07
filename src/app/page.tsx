import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCompEntries, getHomeSectionSource } from "@/lib/mdx";
import { getAvailablePatchesFromEntries, getLatestPatch } from "@/lib/patches";

export default async function Home() {
  const [philosophySource, storySource] = await Promise.all([
    getHomeSectionSource("philosophy"),
    getHomeSectionSource("story"),
  ]);

  let latestPatch: string | null = null;

  try {
    const compEntries = await getCompEntries();
    latestPatch = getLatestPatch(getAvailablePatchesFromEntries(compEntries));
  } catch (error) {
    console.error("Failed to load comp entries for Home CTA label", error);
  }

  return (
    <section className="space-y-0">
      <header className="pb-10 pt-2">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-[180px] w-[180px] shrink-0 items-center justify-center rounded-full bg-white">
            <Image
              alt="tft1trick logo"
              height={160}
              priority
              src="/tft1trick-logo.png"
              width={160}
              className="pb-3"
            />
          </div>

          <div className="space-y-5 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
              TFT one-trick playbook
            </p>
            <h1 className="mx-auto max-w-3xl text-2xl font-semibold tracking-tight text-zinc-50 sm:mx-0 sm:text-3xl">
              Consistent TFT climbs through focused one-trick execution.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-300 sm:mx-0">
              Practical patch notes, comp guidance, and mindset frameworks to help you play cleaner,
              lose less HP early, and convert more top 4s.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link
                className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-amber-400"
                href="/comps"
              >
                Comps to one-trick on patch {latestPatch ?? "latest"}
              </Link>

              <Link
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                href="https://www.youtube.com/@TFT1Trick"
                rel="noreferrer"
                target="_blank"
              >
                Visit YouTube channel
              </Link>
            </div>
          </div>
        </div>
      </header>

      <article className="border-t border-zinc-200/20 py-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">One-trick philosophy</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-200 [&_a]:font-medium [&_a]:text-amber-300 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          <MDXRemote source={philosophySource} />
        </div>
      </article>

      <article className="border-t border-zinc-200/20 py-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Emerald to Masters journey
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-200 [&_a]:font-medium [&_a]:text-amber-300 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          <MDXRemote source={storySource} />
        </div>
      </article>
    </section>
  );
}

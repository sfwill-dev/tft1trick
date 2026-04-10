import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCompEntries, getHomePageSource } from "@/lib/mdx";
import { getAvailablePatchesFromEntries, getLatestPatch } from "@/lib/patches";

export default async function Home() {
  const homePageSource = await getHomePageSource();

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

            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link
                className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-base font-medium text-zinc-950 transition hover:bg-amber-400"
                href={`/comps/patch/${latestPatch ?? "latest"}`}
              >
                Comps to one-trick on patch {latestPatch ?? "latest"}
              </Link>

              <Link
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-base font-medium text-white transition hover:bg-red-500"
                href="https://www.youtube.com/@TFT1Trick/?sub_confirmation=1"
                rel="noreferrer"
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

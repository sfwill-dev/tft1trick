import { redirect } from "next/navigation";
import { PatchSection } from "@/components/PatchSection";
import { PatchSelector } from "@/components/PatchSelector";
import { getPatchEntries } from "@/lib/mdx";
import {
  getAvailablePatchesFromEntries,
  getLatestPatch,
  resolveSelectedPatch,
} from "@/lib/patches";

type PatchPageProps = {
  params: Promise<{
    patch: string;
  }>;
};

export default async function PatchPage({ params }: PatchPageProps) {
  const routeParams = await params;
  const requestedPatch = routeParams.patch;

  const patchLoad = await getPatchEntries()
    .then((entries) => ({ entries, hadLoadError: false }))
    .catch((error) => {
      console.error("Failed to read patch entries", error);
      return { entries: [], hadLoadError: true };
    });

  const patchEntries = patchLoad.entries;
  const hadLoadError = patchLoad.hadLoadError;

  const availablePatches = getAvailablePatchesFromEntries(patchEntries);
  const latestPatch = getLatestPatch(availablePatches);
  const selectedPatch = resolveSelectedPatch(requestedPatch, availablePatches);

  if (selectedPatch && requestedPatch !== selectedPatch) {
    redirect(`/patches/${selectedPatch}`);
  }

  const selectedEntry =
    patchEntries
      .filter((entry) => entry.frontmatter.patch === selectedPatch)
      .sort((a, b) => b.frontmatter.updatedAt.localeCompare(a.frontmatter.updatedAt))[0] ?? null;

  return (
    <section className="space-y-0">
      <header className="space-y-3 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          One-trick approach for the patch
        </h1>

        {hadLoadError ? (
          <p className="border-l-2 border-red-300 pl-3 text-xs text-red-200">
            Could not load patch files from content. Verify your MDX files in
            <code className="ml-1 text-zinc-100 underline underline-offset-2">content/patches</code>
            .
          </p>
        ) : null}
      </header>

      <section className="pb-4">
        <PatchSelector patches={availablePatches} selectedPatch={selectedPatch} />
      </section>

      <section className="pb-8">
        <PatchSection entry={selectedEntry} latestPatch={latestPatch} />
      </section>
    </section>
  );
}

import { redirect } from "next/navigation";
import { CompSection } from "@/components/CompSection";
import { PatchSelector } from "@/components/PatchSelector";
import { getCompEntries } from "@/lib/mdx";
import {
  getAvailablePatchesFromEntries,
  getLatestPatch,
  resolveSelectedPatch,
} from "@/lib/patches";

type CompsPatchPageProps = {
  params: Promise<{
    patch: string;
  }>;
};

export default async function CompsPatchPage({ params }: CompsPatchPageProps) {
  const routeParams = await params;
  const requestedPatch = routeParams.patch;

  const compLoad = await getCompEntries()
    .then((entries) => ({ entries, hadLoadError: false }))
    .catch((error) => {
      console.error("Failed to read comp entries", error);
      return { entries: [], hadLoadError: true };
    });

  const compEntries = compLoad.entries;
  const hadLoadError = compLoad.hadLoadError;

  const availablePatches = getAvailablePatchesFromEntries(compEntries);
  const latestPatch = getLatestPatch(availablePatches);
  const selectedPatch = resolveSelectedPatch(requestedPatch, availablePatches);

  if (selectedPatch && requestedPatch !== selectedPatch) {
    redirect(`/comps/patch/${selectedPatch}`);
  }

  const selectedEntry =
    compEntries
      .filter((entry) => entry.frontmatter.patch === selectedPatch)
      .sort((a, b) => b.frontmatter.updatedAt.localeCompare(a.frontmatter.updatedAt))[0] ?? null;

  return (
    <section className="space-y-0">
      <header className="space-y-3 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Comps to one-trick</h1>
        <p className="max-w-2xl text-sm leading-7 text-zinc-300">
          Patch-by-patch comp guidance with practical notes
        </p>

        {hadLoadError ? (
          <p className="border-l-2 border-red-300 pl-3 text-xs text-red-200">
            Could not load patch files from content. Verify your MDX files in
            <code className="ml-1 text-zinc-100 underline underline-offset-2">content/comps</code>.
          </p>
        ) : null}
      </header>

      <section className="pb-4">
        <PatchSelector patches={availablePatches} selectedPatch={selectedPatch} />
      </section>

      <section className="pb-8">
        <CompSection entry={selectedEntry} latestPatch={latestPatch} />
      </section>
    </section>
  );
}

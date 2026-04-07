import { CompSection } from "@/components/CompSection";
import { PatchSelector } from "@/components/PatchSelector";
import { getCompEntries } from "@/lib/mdx";
import { getAvailablePatchesFromEntries, resolveSelectedPatch } from "@/lib/patches";

type CompsPageProps = {
  searchParams?: Promise<{
    patch?: string;
  }>;
};

export default async function CompsPage({ searchParams }: CompsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const compLoad = await getCompEntries()
    .then((entries) => ({ entries, hadLoadError: false }))
    .catch((error) => {
      console.error("Failed to read comp entries", error);
      return { entries: [], hadLoadError: true };
    });

  const compEntries = compLoad.entries;
  const hadLoadError = compLoad.hadLoadError;

  const availablePatches = getAvailablePatchesFromEntries(compEntries);
  const requestedPatch = params?.patch;
  const selectedPatch = resolveSelectedPatch(requestedPatch, availablePatches);
  const requestedPatchUnavailable = Boolean(requestedPatch) && requestedPatch !== selectedPatch;

  const selectedEntry =
    compEntries
      .filter((entry) => entry.frontmatter.patch === selectedPatch)
      .sort((a, b) => b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt))[0] ??
    null;

  return (
    <section className="space-y-0">
      <header className="space-y-3 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Comps to one-trick</h1>
        <p className="max-w-2xl text-sm leading-7 text-zinc-300">
          Patch-by-patch comp guidance with practical notes you can run in real ladder games.
        </p>

        {requestedPatchUnavailable ? (
          <p className="border-l-2 border-amber-300 pl-3 text-xs text-amber-200">
            Patch {requestedPatch} is not available yet. Showing patch {selectedPatch ?? "latest"}.
          </p>
        ) : null}

        {hadLoadError ? (
          <p className="border-l-2 border-red-300 pl-3 text-xs text-red-200">
            Could not load patch files from content. Verify your MDX files in
            <code className="ml-1 text-zinc-100 underline underline-offset-2">content/comps</code>.
          </p>
        ) : null}
      </header>

      <section className="border-t border-zinc-200/20 py-8">
        <PatchSelector patches={availablePatches} selectedPatch={selectedPatch} />
      </section>

      <section className="border-t border-zinc-200/20 py-8">
        <CompSection entry={selectedEntry} />
      </section>
    </section>
  );
}

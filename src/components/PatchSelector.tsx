"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";

type PatchSelectorProps = {
  patches: string[];
  selectedPatch: string | null;
};

export function PatchSelector({ patches, selectedPatch }: PatchSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasPatches = patches.length > 0;
  const currentPatch = selectedPatch ?? patches[0] ?? "";

  const handlePatchChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextPatch = event.target.value;
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextPatch) {
      nextParams.set("patch", nextPatch);
    } else {
      nextParams.delete("patch");
    }

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <label
        className="block text-xs font-medium uppercase tracking-[0.14em] text-zinc-300"
        htmlFor="patch"
      >
        Patch
      </label>

      <select
        className="w-full rounded-md border border-zinc-300/30 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!hasPatches}
        id="patch"
        name="patch"
        onChange={handlePatchChange}
        value={currentPatch}
      >
        {!hasPatches ? (
          <option value="">No patches available</option>
        ) : (
          patches.map((patch) => (
            <option key={patch} value={patch}>
              Patch {patch}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

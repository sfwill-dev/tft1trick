export function isPatchFormat(value: string): boolean {
  return /^\d+\.\d+$/.test(value);
}

function patchToParts(patch: string): [number, number] {
  const [major, minor] = patch.split(".").map(Number);
  return [major, minor];
}

export function comparePatchesDescending(a: string, b: string): number {
  const [aMajor, aMinor] = patchToParts(a);
  const [bMajor, bMinor] = patchToParts(b);

  if (aMajor !== bMajor) {
    return bMajor - aMajor;
  }

  return bMinor - aMinor;
}

export function sortPatchesDescending(patches: string[]): string[] {
  return [...patches].sort(comparePatchesDescending);
}

export function getLatestPatch(patches: string[]): string | null {
  if (patches.length === 0) {
    return null;
  }

  return sortPatchesDescending(patches)[0] ?? null;
}

export function resolveSelectedPatch(
  selectedPatch: string | null | undefined,
  availablePatches: string[],
): string | null {
  if (selectedPatch && availablePatches.includes(selectedPatch)) {
    return selectedPatch;
  }

  return getLatestPatch(availablePatches);
}

export function getAvailablePatchesFromEntries(
  entries: Array<{ frontmatter: { patch: string } }>,
): string[] {
  const uniquePatches = Array.from(new Set(entries.map((entry) => entry.frontmatter.patch)));
  return sortPatchesDescending(uniquePatches);
}

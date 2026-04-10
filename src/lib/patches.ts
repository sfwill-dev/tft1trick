const PATCH_FORMAT_REGEX = /^(\d+)\.(\d+)([a-z])?$/;

export function isPatchFormat(value: string): boolean {
  return PATCH_FORMAT_REGEX.test(value);
}

function patchToParts(patch: string): [number, number, number] {
  const match = patch.match(PATCH_FORMAT_REGEX);

  if (!match) {
    return [0, 0, -1];
  }

  const [, majorRaw, minorRaw, suffixRaw] = match;
  const suffixRank = suffixRaw ? suffixRaw.charCodeAt(0) - 96 : 0;

  return [Number(majorRaw), Number(minorRaw), suffixRank];
}

export function comparePatchesDescending(a: string, b: string): number {
  const [aMajor, aMinor, aSuffix] = patchToParts(a);
  const [bMajor, bMinor, bSuffix] = patchToParts(b);

  if (aMajor !== bMajor) {
    return bMajor - aMajor;
  }

  if (aMinor !== bMinor) {
    return bMinor - aMinor;
  }

  return bSuffix - aSuffix;
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

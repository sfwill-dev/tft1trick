import {
  getAvailablePatchesFromEntries,
  getLatestPatch,
  resolveSelectedPatch,
  sortPatchesDescending,
} from "@/lib/patches";

describe("patches utilities", () => {
  it("sorts patches in descending order", () => {
    expect(sortPatchesDescending(["16.7", "16.10", "15.24", "16.8"])).toEqual([
      "16.10",
      "16.8",
      "16.7",
      "15.24",
    ]);
  });

  it("returns latest patch", () => {
    expect(getLatestPatch(["16.7", "16.9", "16.8"])).toBe("16.9");
  });

  it("resolves selected patch with fallback to latest", () => {
    const available = ["16.8", "16.7"];

    expect(resolveSelectedPatch("16.7", available)).toBe("16.7");
    expect(resolveSelectedPatch("16.1", available)).toBe("16.8");
    expect(resolveSelectedPatch(undefined, available)).toBe("16.8");
  });

  it("builds unique sorted patch list from entries", () => {
    const entries = [
      { frontmatter: { patch: "16.7" } },
      { frontmatter: { patch: "16.8" } },
      { frontmatter: { patch: "16.7" } },
    ];

    expect(getAvailablePatchesFromEntries(entries)).toEqual(["16.8", "16.7"]);
  });
});

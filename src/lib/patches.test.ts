import {
  comparePatchesDescending,
  getAvailablePatchesFromEntries,
  getLatestPatch,
  isPatchFormat,
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

  it("sorts suffixed patches after base patch in descending order", () => {
    expect(sortPatchesDescending(["17.1", "17.1b", "17.1a", "17.2"])).toEqual([
      "17.2",
      "17.1b",
      "17.1a",
      "17.1",
    ]);
  });

  it("validates patch format with optional suffix letter", () => {
    expect(isPatchFormat("17.1")).toBe(true);
    expect(isPatchFormat("17.1b")).toBe(true);
    expect(isPatchFormat("17")).toBe(false);
    expect(isPatchFormat("17.1beta")).toBe(false);
  });

  it("compares base patch as older than suffixed patch", () => {
    expect(comparePatchesDescending("17.1", "17.1a")).toBeGreaterThan(0);
    expect(comparePatchesDescending("17.1b", "17.1a")).toBeLessThan(0);
  });

  it("returns latest patch", () => {
    expect(getLatestPatch(["16.7", "16.9", "16.8"])).toBe("16.9");
    expect(getLatestPatch(["17.1", "17.1a", "17.1b"])).toBe("17.1b");
  });

  it("resolves selected patch with fallback to latest", () => {
    const available = ["16.8", "16.7"];

    expect(resolveSelectedPatch("16.7", available)).toBe("16.7");
    expect(resolveSelectedPatch("16.1", available)).toBe("16.8");
    expect(resolveSelectedPatch(undefined, available)).toBe("16.8");

    const availableWithSuffix = ["17.1", "17.1a", "17.1b"];
    expect(resolveSelectedPatch("17.1", availableWithSuffix)).toBe("17.1");
    expect(resolveSelectedPatch("17.0", availableWithSuffix)).toBe("17.1b");
  });

  it("builds unique sorted patch list from entries", () => {
    const entries = [
      { frontmatter: { patch: "16.7" } },
      { frontmatter: { patch: "16.8" } },
      { frontmatter: { patch: "16.7" } },
      { frontmatter: { patch: "17.1b" } },
      { frontmatter: { patch: "17.1" } },
      { frontmatter: { patch: "17.1a" } },
    ];

    expect(getAvailablePatchesFromEntries(entries)).toEqual([
      "17.1b",
      "17.1a",
      "17.1",
      "16.8",
      "16.7",
    ]);
  });
});

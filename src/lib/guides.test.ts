import { describe, expect, it } from "vitest";
import {
  getGuideBySlug,
  getLatestGuide,
  getRecentGuides,
  sortGuidesByDateDescending,
} from "@/lib/guides";

const guides = [
  {
    slug: "guide-a",
    fileName: "guide-a.mdx",
    frontmatter: {
      title: "Guide A",
      date: "2026-04-01",
    },
    content: "A",
  },
  {
    slug: "guide-b",
    fileName: "guide-b.mdx",
    frontmatter: {
      title: "Guide B",
      date: "2026-04-15",
    },
    content: "B",
  },
  {
    slug: "guide-c",
    fileName: "guide-c.mdx",
    frontmatter: {
      title: "Guide C",
      date: "2026-03-20",
    },
    content: "C",
  },
];

describe("guides utilities", () => {
  it("sorts guides in descending date order", () => {
    const sorted = sortGuidesByDateDescending(guides);
    expect(sorted.map((guide) => guide.slug)).toEqual(["guide-b", "guide-a", "guide-c"]);
  });

  it("returns latest guide", () => {
    const latest = getLatestGuide(guides);
    expect(latest?.slug).toBe("guide-b");
  });

  it("returns recent guides with limit", () => {
    const recent = getRecentGuides(guides, 2);
    expect(recent.map((guide) => guide.slug)).toEqual(["guide-b", "guide-a"]);
  });

  it("returns guide by slug", () => {
    expect(getGuideBySlug(guides, "guide-a")?.frontmatter.title).toBe("Guide A");
    expect(getGuideBySlug(guides, "missing")).toBeNull();
  });
});

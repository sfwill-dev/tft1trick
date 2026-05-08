import { promises as fs } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import {
  createGuideExcerpt,
  getGuideEntries,
  getHomePageSource,
  parseGuideMdxSource,
} from "@/lib/mdx";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("content loading", () => {
  it("returns the home page MDX source", async () => {
    const source = await getHomePageSource();

    expect(source).toContain("Hi, I'm Will! 👋");
    expect(source).toContain("Common Questions");
  });

  it("returns guide entries with slug, frontmatter and excerpt", async () => {
    const entries = await getGuideEntries();
    const guide = entries.find((entry) => entry.slug === "5-nova-patch-17-1");

    expect(entries.length).toBeGreaterThan(0);
    expect(guide).toBeDefined();
    expect(guide).toMatchObject({
      slug: "5-nova-patch-17-1",
      fileName: "5-nova-patch-17-1.mdx",
      frontmatter: {
        title: "5 N.O.V.A. guide - Patch 17.1 | Set 17",
        date: "2026-04-23",
      },
    });
    expect(guide?.excerpt.length).toBeGreaterThan(0);
    expect(guide?.excerpt).not.toContain("<");
  });

  it("reads guide entries on repeated calls", async () => {
    vi.resetModules();
    const readdirSpy = vi.spyOn(fs, "readdir");
    const { getGuideEntries: getGuideEntriesFromFreshModule } = await import("@/lib/mdx");

    await getGuideEntriesFromFreshModule();
    await getGuideEntriesFromFreshModule();

    expect(readdirSpy).toHaveBeenCalledTimes(2);
  });
});

describe("parseGuideMdxSource", () => {
  it("parses and validates frontmatter", () => {
    const source = `---
title: "Test guide"
date: "2026-04-01"
---

## Sample comp`;

    const result = parseGuideMdxSource(source, "test-guide.mdx");

    expect(result.fileName).toBe("test-guide.mdx");
    expect(result.frontmatter).toEqual({
      title: "Test guide",
      date: "2026-04-01",
    });
    expect(result.content).toContain("## Sample comp");
  });

  it("throws when required frontmatter fields are missing", () => {
    const invalidSource = `---
title: "Test guide"
---

Missing date`;

    expect(() => parseGuideMdxSource(invalidSource, "test-guide.mdx")).toThrow(ZodError);
  });
});

describe("createGuideExcerpt", () => {
  it("strips markdown links while keeping visible label text", () => {
    const content = "Check [NOVA guide](https://example.com/guide) now";

    expect(createGuideExcerpt(content)).toBe("Check NOVA guide now");
  });

  it("handles malformed markdown links without failing", () => {
    const content = "Broken [NOVA guide](https://example.com and [another] text";

    expect(createGuideExcerpt(content)).toBe(
      "Broken [NOVA guide](https://example.com and [another] text",
    );
  });

  it("keeps bracket text when there is no markdown link URL", () => {
    const content = "See [Guide] now";

    expect(createGuideExcerpt(content)).toBe("See [Guide] now");
  });

  it("strips html tags while preserving empty markdown links", () => {
    const content = "Intro <strong>bold</strong> [](/path) end";

    expect(createGuideExcerpt(content)).toBe("Intro bold [](/path) end");
  });

  it("truncates at word boundaries and appends an ellipsis", () => {
    const content = "nova reroll guide with economy focus";

    expect(createGuideExcerpt(content, 20)).toBe("nova reroll guide…");
  });

  it("handles large malformed markdown input", () => {
    const content = `${"[".repeat(15000)}important`;

    expect(createGuideExcerpt(content, 30)).toBe(`${"[".repeat(30)}…`);
  });
});

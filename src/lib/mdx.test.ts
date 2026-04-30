import { ZodError } from "zod";
import { createGuideExcerpt, parseGuideMdxSource } from "@/lib/mdx";

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

  it("handles large malformed markdown input", () => {
    const content = `${"[".repeat(15000)}important`;

    expect(createGuideExcerpt(content, 30)).toBe(`${"[".repeat(30)}…`);
  });
});

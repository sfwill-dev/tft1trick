import { ZodError } from "zod";
import { parseGuideMdxSource } from "@/lib/mdx";

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

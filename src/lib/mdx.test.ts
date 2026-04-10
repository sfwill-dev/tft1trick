import { ZodError } from "zod";
import { parseCompMdxSource } from "@/lib/mdx";

describe("parseCompMdxSource", () => {
  it("parses and validates frontmatter", () => {
    const source = `---
patch: "16.8"
set: 16
updatedAt: "2026-04-01"
---

## Sample comp`;

    const result = parseCompMdxSource(source, "patch-16.8.mdx");

    expect(result.fileName).toBe("patch-16.8.mdx");
    expect(result.frontmatter).toEqual({
      patch: "16.8",
      set: 16,
      updatedAt: "2026-04-01",
    });
    expect(result.content).toContain("## Sample comp");
  });

  it("throws when required frontmatter fields are missing", () => {
    const invalidSource = `---
patch: "16.8"
updatedAt: "2026-04-01"
---

Missing set`;

    expect(() => parseCompMdxSource(invalidSource, "patch-16.8.mdx")).toThrow(ZodError);
  });
});

import { describe, expect, it } from "vitest";
import { formatGuideDate } from "@/lib/format";

describe("formatGuideDate", () => {
  it("formats YYYY-MM-DD using UTC", () => {
    expect(formatGuideDate("2026-04-23")).toBe("Apr 23, 2026");
  });
});

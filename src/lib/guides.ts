import type { GuideMdxEntry } from "@/lib/mdx";

export function sortGuidesByDateDescending(entries: GuideMdxEntry[]): GuideMdxEntry[] {
  return [...entries].sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function getLatestGuide(entries: GuideMdxEntry[]): GuideMdxEntry | null {
  return sortGuidesByDateDescending(entries)[0] ?? null;
}

export function getRecentGuides(entries: GuideMdxEntry[], limit: number): GuideMdxEntry[] {
  return sortGuidesByDateDescending(entries).slice(0, limit);
}

export function getGuideBySlug(entries: GuideMdxEntry[], slug: string): GuideMdxEntry | null {
  return entries.find((entry) => entry.slug === slug) ?? null;
}

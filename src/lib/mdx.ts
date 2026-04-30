import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { guideFrontmatterSchema, type GuideFrontmatter } from "@/schemas/guide";

const contentRootDir = path.join(process.cwd(), "content");
const homeContentDir = path.join(contentRootDir, "home");
const guidesContentDir = path.join(contentRootDir, "guides");
let cachedGuideEntries: GuideMdxEntry[] | null = null;

export type GuideMdxEntry = {
  slug: string;
  fileName: string;
  frontmatter: GuideFrontmatter;
  content: string;
};

export async function getHomePageSource(): Promise<string> {
  const filePath = path.join(homeContentDir, "page.mdx");
  return fs.readFile(filePath, "utf8");
}

export function parseGuideMdxSource(source: string, fileName: string): Omit<GuideMdxEntry, "slug"> {
  const parsed = matter(source);
  const frontmatter = guideFrontmatterSchema.parse(parsed.data);

  return {
    fileName,
    frontmatter,
    content: parsed.content,
  };
}

export async function getGuideEntries(): Promise<GuideMdxEntry[]> {
  if (cachedGuideEntries) {
    return cachedGuideEntries;
  }

  const files = await fs.readdir(guidesContentDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

  const entries = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const filePath = path.join(guidesContentDir, fileName);
      const source = await fs.readFile(filePath, "utf8");
      const parsed = parseGuideMdxSource(source, fileName);

      return {
        ...parsed,
        slug: fileName.replace(/\.mdx$/, ""),
      };
    }),
  );

  cachedGuideEntries = entries;

  return entries;
}

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { patchFrontmatterSchema, type PatchFrontmatter } from "@/schemas/patch";

const contentRootDir = path.join(process.cwd(), "content");
const homeContentDir = path.join(contentRootDir, "home");
const patchesContentDir = path.join(contentRootDir, "patches");

export type PatchMdxEntry = {
  slug: string;
  fileName: string;
  frontmatter: PatchFrontmatter;
  content: string;
};

export async function getHomePageSource(): Promise<string> {
  const filePath = path.join(homeContentDir, "page.mdx");
  return fs.readFile(filePath, "utf8");
}

export function parsePatchMdxSource(source: string, fileName: string): Omit<PatchMdxEntry, "slug"> {
  const parsed = matter(source);
  const frontmatter = patchFrontmatterSchema.parse(parsed.data);

  return {
    fileName,
    frontmatter,
    content: parsed.content,
  };
}

export async function getPatchEntries(): Promise<PatchMdxEntry[]> {
  const files = await fs.readdir(patchesContentDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

  const entries = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const filePath = path.join(patchesContentDir, fileName);
      const source = await fs.readFile(filePath, "utf8");
      const parsed = parsePatchMdxSource(source, fileName);

      return {
        ...parsed,
        slug: fileName.replace(/\.mdx$/, ""),
      };
    }),
  );

  return entries;
}

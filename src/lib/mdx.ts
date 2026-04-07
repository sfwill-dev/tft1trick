import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compFrontmatterSchema, type CompFrontmatter } from "@/schemas/comp";

const contentRootDir = path.join(process.cwd(), "content");
const homeContentDir = path.join(contentRootDir, "home");
const compsContentDir = path.join(contentRootDir, "comps");

export type HomeSectionSlug = "philosophy" | "story";

export type CompMdxEntry = {
  slug: string;
  fileName: string;
  frontmatter: CompFrontmatter;
  content: string;
};

export async function getHomeSectionSource(slug: HomeSectionSlug): Promise<string> {
  const filePath = path.join(homeContentDir, `${slug}.mdx`);
  return fs.readFile(filePath, "utf8");
}

export function parseCompMdxSource(source: string, fileName: string): Omit<CompMdxEntry, "slug"> {
  const parsed = matter(source);
  const frontmatter = compFrontmatterSchema.parse(parsed.data);

  return {
    fileName,
    frontmatter,
    content: parsed.content,
  };
}

export async function getCompEntries(): Promise<CompMdxEntry[]> {
  const files = await fs.readdir(compsContentDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

  const entries = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const filePath = path.join(compsContentDir, fileName);
      const source = await fs.readFile(filePath, "utf8");
      const parsed = parseCompMdxSource(source, fileName);

      return {
        ...parsed,
        slug: fileName.replace(/\.mdx$/, ""),
      };
    }),
  );

  return entries;
}

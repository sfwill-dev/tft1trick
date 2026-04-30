import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { guideFrontmatterSchema, type GuideFrontmatter } from "@/schemas/guide";

const contentRootDir = path.join(process.cwd(), "content");
const homeContentDir = path.join(contentRootDir, "home");
const guidesContentDir = path.join(contentRootDir, "guides");
const GUIDE_EXCERPT_MAX_LENGTH = 155;
let cachedGuideEntries: GuideMdxEntry[] | null = null;

export type GuideMdxEntry = {
  slug: string;
  fileName: string;
  frontmatter: GuideFrontmatter;
  content: string;
  excerpt: string;
};

type ParsedGuideMdxSource = Pick<GuideMdxEntry, "fileName" | "frontmatter" | "content">;

function stripMarkdownLinks(source: string): string {
  const result: string[] = [];
  const sourceLength = source.length;
  let index = 0;

  while (index < sourceLength) {
    if (source[index] !== "[") {
      result.push(source[index]);
      index += 1;
      continue;
    }

    const labelStart = index + 1;
    let labelEnd = labelStart;

    while (labelEnd < sourceLength && source[labelEnd] !== "]") {
      labelEnd += 1;
    }

    if (labelEnd >= sourceLength) {
      result.push(source.slice(index));
      break;
    }

    if (labelEnd + 1 >= sourceLength || source[labelEnd + 1] !== "(") {
      result.push(source.slice(index, labelEnd + 1));
      index = labelEnd + 1;
      continue;
    }

    const urlStart = labelEnd + 2;
    let urlEnd = urlStart;

    while (urlEnd < sourceLength && source[urlEnd] !== ")") {
      urlEnd += 1;
    }

    if (urlEnd >= sourceLength) {
      result.push(source.slice(index));
      break;
    }

    if (labelEnd > labelStart) {
      result.push(source.slice(labelStart, labelEnd));
      index = urlEnd + 1;
      continue;
    }

    result.push(source.slice(index, urlEnd + 1));
    index = urlEnd + 1;
  }

  return result.join("");
}

function stripMdxToPlainText(source: string): string {
  const withoutHtmlTags = source.replace(/<[^>]*>/g, " ");

  return stripMarkdownLinks(withoutHtmlTags)
    .replace(/`{1,3}[^`]*`{1,3}/g, " ")
    .replace(/[*_~>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createGuideExcerpt(content: string, maxLength = GUIDE_EXCERPT_MAX_LENGTH): string {
  const plainText = stripMdxToPlainText(content);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const truncated = plainText.slice(0, maxLength);
  const lastWordBoundary = truncated.lastIndexOf(" ");
  const excerptBase = lastWordBoundary > 0 ? truncated.slice(0, lastWordBoundary) : truncated;

  return `${excerptBase.trimEnd()}…`;
}

export async function getHomePageSource(): Promise<string> {
  const filePath = path.join(homeContentDir, "page.mdx");
  return fs.readFile(filePath, "utf8");
}

export function parseGuideMdxSource(source: string, fileName: string): ParsedGuideMdxSource {
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
        excerpt: createGuideExcerpt(parsed.content),
      };
    }),
  );

  cachedGuideEntries = entries;

  return entries;
}

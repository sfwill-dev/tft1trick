import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { guideFrontmatterSchema, type GuideFrontmatter } from "@/schemas/guide";

const contentRootDir = path.join(process.cwd(), "content");
const homeContentDir = path.join(contentRootDir, "home");
const guidesContentDir = path.join(contentRootDir, "guides");
const GUIDE_EXCERPT_MAX_LENGTH = 155;

export type GuideMdxEntry = {
  slug: string;
  fileName: string;
  frontmatter: GuideFrontmatter;
  content: string;
  excerpt: string;
};

type ParsedGuideMdxSource = Pick<GuideMdxEntry, "fileName" | "frontmatter" | "content">;

type MarkdownLinkParseResult = {
  text: string;
  nextIndex: number;
  isTerminal: boolean;
};

function findCharacterIndex(source: string, startIndex: number, targetCharacter: string): number {
  let index = startIndex;

  while (index < source.length && source[index] !== targetCharacter) {
    index += 1;
  }

  return index < source.length ? index : -1;
}

function parseMarkdownLinkAtIndex(source: string, index: number): MarkdownLinkParseResult {
  const labelStart = index + 1;
  const labelEnd = findCharacterIndex(source, labelStart, "]");

  if (labelEnd === -1) {
    return {
      text: source.slice(index),
      nextIndex: source.length,
      isTerminal: true,
    };
  }

  if (labelEnd + 1 >= source.length || source[labelEnd + 1] !== "(") {
    return {
      text: source.slice(index, labelEnd + 1),
      nextIndex: labelEnd + 1,
      isTerminal: false,
    };
  }

  const urlStart = labelEnd + 2;
  const urlEnd = findCharacterIndex(source, urlStart, ")");

  if (urlEnd === -1) {
    return {
      text: source.slice(index),
      nextIndex: source.length,
      isTerminal: true,
    };
  }

  if (labelEnd > labelStart) {
    return {
      text: source.slice(labelStart, labelEnd),
      nextIndex: urlEnd + 1,
      isTerminal: false,
    };
  }

  return {
    text: source.slice(index, urlEnd + 1),
    nextIndex: urlEnd + 1,
    isTerminal: false,
  };
}

function stripMarkdownLinks(source: string): string {
  const result: string[] = [];
  let index = 0;

  while (index < source.length) {
    const currentCharacter = source[index];

    if (currentCharacter === undefined) {
      break;
    }

    if (currentCharacter !== "[") {
      result.push(currentCharacter);
      index += 1;
      continue;
    }

    const parsedLink = parseMarkdownLinkAtIndex(source, index);
    result.push(parsedLink.text);

    if (parsedLink.isTerminal) {
      break;
    }

    index = parsedLink.nextIndex;
  }

  return result.join("");
}

function stripHtmlTags(source: string): string {
  const result: string[] = [];
  let insideTag = false;

  for (const character of source) {
    if (character === "<") {
      insideTag = true;

      if (result.length > 0 && result.at(-1) !== " ") {
        result.push(" ");
      }

      continue;
    }

    if (character === ">") {
      if (insideTag) {
        insideTag = false;

        continue;
      }
    }

    if (!insideTag) {
      result.push(character);
    }
  }

  return result.join("");
}

function stripMdxToPlainText(source: string): string {
  const withoutHtmlTags = stripHtmlTags(source);

  return stripMarkdownLinks(withoutHtmlTags)
    .replaceAll(/`{1,3}[^`]*`{1,3}/g, " ")
    .replaceAll(/[*_~>#]/g, " ")
    .replaceAll(/\s+/g, " ")
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

  return entries;
}

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type GuideEntry = {
  slug: string;
  date: string;
};

// Intentionally duplicated from app/lib content loading logic: this script runs
// in a standalone Node process for CI Lighthouse checks and keeps dependencies
// minimal to avoid coupling with runtime-only modules.
const BASE_URL = process.env.LHCI_BASE_URL ?? "http://localhost:3000";
const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function getLatestGuideSlug(): Promise<string | null> {
  const files = await fs.readdir(GUIDES_DIR);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));

  const guides = await Promise.all(
    mdxFiles.map(async (fileName): Promise<GuideEntry> => {
      const source = await fs.readFile(path.join(GUIDES_DIR, fileName), "utf8");
      const parsed = matter(source);

      return {
        slug: fileName.replace(/\.mdx$/, ""),
        date: String(parsed.data.date ?? ""),
      };
    }),
  );

  const latestGuide = guides.sort((a, b) => b.date.localeCompare(a.date))[0];
  return latestGuide?.slug ?? null;
}

async function main() {
  const baseUrl = normalizeBaseUrl(BASE_URL);
  const urls = [`${baseUrl}/`, `${baseUrl}/guides`, `${baseUrl}/guides/all`];

  const latestGuideSlug = await getLatestGuideSlug();

  if (latestGuideSlug) {
    urls.push(`${baseUrl}/guides/${latestGuideSlug}`);
  } else {
    console.error("[lhci] No guide files found. Running Lighthouse without a guide detail URL.");
  }

  const urlArgs = urls.map((url) => `--url=${url}`).join(" ");
  process.stdout.write(urlArgs);
}

main().catch((error) => {
  console.error("[lhci] Failed to generate Lighthouse URLs", error);
  process.exit(1);
});

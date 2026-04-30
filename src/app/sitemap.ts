import type { MetadataRoute } from "next";
import { getGuideEntries } from "@/lib/mdx";

const SITE_URL = "https://tft1trick.com";
const BUILD_DATE = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = await getGuideEntries().catch((error) => {
    console.error("Failed to load guide entries for sitemap", error);
    return [];
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: BUILD_DATE,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: BUILD_DATE,
    },
    {
      url: `${SITE_URL}/guides/all`,
      lastModified: BUILD_DATE,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(`${guide.frontmatter.date}T00:00:00.000Z`),
  }));

  return [...staticRoutes, ...guideRoutes];
}

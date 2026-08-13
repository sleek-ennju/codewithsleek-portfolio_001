import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { getDb } from "@/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getDb().project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
    select: { slug: true, updatedAt: true, cardImage: { select: { secureUrl: true } }, coverImage: { select: { secureUrl: true } } },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/resume"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [project.coverImage?.secureUrl, project.cardImage?.secureUrl].filter((url): url is string => Boolean(url)),
    })),
  ];
}

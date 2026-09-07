import { cache } from "react";

import { getDb } from "@/server/db";

const projectInclude = {
  cardImage: true,
  coverImage: true,
  socialImage: true,
  images: {
    where: { role: "gallery" },
    orderBy: { position: "asc" as const },
    include: { media: true },
  },
  technologies: { orderBy: { position: "asc" as const }, include: { technology: true } },
  metrics: { orderBy: { position: "asc" as const } },
  sections: { orderBy: { position: "asc" as const } },
  testimonials: {
    where: { published: true },
    orderBy: { displayOrder: "asc" as const },
    include: { client: true, photo: { select: { secureUrl: true, altText: true } } },
  },
  performanceAudits: {
    where: { status: "SUCCEEDED" as const, publicVisible: true, auditedAt: { not: null } },
    orderBy: { auditedAt: "desc" as const },
    select: {
      id: true,
      strategy: true,
      performanceScore: true,
      accessibilityScore: true,
      bestPracticesScore: true,
      seoScore: true,
      lcpMs: true,
      cls: true,
      totalBlockingTimeMs: true,
      source: true,
      auditedAt: true,
    },
  },
};

export const getPublishedProject = cache((slug: string) =>
  getDb().project.findFirst({ where: { slug, status: "PUBLISHED" }, include: projectInclude }),
);
export const getPreviewProject = cache((id: string) =>
  getDb().project.findUnique({ where: { id }, include: projectInclude }),
);

export type ProjectCaseStudyData = NonNullable<Awaited<ReturnType<typeof getPublishedProject>>>;

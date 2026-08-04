import { cache } from "react";

import { getDb } from "@/server/db";

const projectInclude = {
  cardImage: true,
  coverImage: true,
  socialImage: true,
  images: { where: { role: "gallery" }, orderBy: { position: "asc" as const }, include: { media: true } },
  technologies: { orderBy: { position: "asc" as const }, include: { technology: true } },
  metrics: { orderBy: { position: "asc" as const } },
};

export const getPublishedProject = cache((slug: string) => getDb().project.findFirst({ where: { slug, status: "PUBLISHED" }, include: projectInclude }));
export const getPreviewProject = cache((id: string) => getDb().project.findUnique({ where: { id }, include: projectInclude }));

export type ProjectCaseStudyData = NonNullable<Awaited<ReturnType<typeof getPublishedProject>>>;

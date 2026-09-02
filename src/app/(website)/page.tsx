import { connection } from "next/server";

import { HomePage } from "@/features/home/home-page";
import { defaultSiteSettings } from "@/features/settings/schemas";
import { getDb } from "@/server/db";
import { getSiteSettings } from "@/features/settings/queries";
import { isDatabaseUnavailable, withDatabaseRetry } from "@/server/database-resilience";

async function loadHomePageData() {
  const db = getDb();
  return Promise.all([
    db.project.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        shortSummary: true,
        projectType: true,
        year: true,
        cardImage: { select: { secureUrl: true, altText: true } },
        coverImage: { select: { secureUrl: true, altText: true } },
        socialImage: { select: { secureUrl: true, altText: true } },
        images: {
          where: { role: { in: ["story", "gallery"] } },
          orderBy: [{ role: "desc" }, { position: "asc" }],
          select: {
            role: true,
            position: true,
            media: { select: { secureUrl: true, altText: true } },
          },
        },
        technologies: {
          orderBy: { position: "asc" },
          take: 4,
          select: { technology: { select: { id: true, name: true } } },
        },
      },
    }),
    db.performanceAudit.findMany({
      where: {
        status: "SUCCEEDED",
        publicVisible: true,
        auditedAt: { not: null },
        project: { status: "PUBLISHED" },
      },
      orderBy: { auditedAt: "desc" },
      take: 3,
      select: {
        id: true,
        strategy: true,
        performanceScore: true,
        accessibilityScore: true,
        bestPracticesScore: true,
        seoScore: true,
        auditedAt: true,
        source: true,
        project: { select: { title: true, slug: true } },
      },
    }),
    db.testimonial.findMany({
      where: { published: true, featured: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      take: 3,
      select: {
        id: true,
        authorName: true,
        authorRole: true,
        quote: true,
        client: { select: { name: true } },
        photo: { select: { secureUrl: true, altText: true } },
        project: { select: { title: true, slug: true } },
      },
    }),
    getSiteSettings(),
  ]);
}

async function resolveHomePageData(): Promise<Awaited<ReturnType<typeof loadHomePageData>>> {
  try {
    return await withDatabaseRetry(loadHomePageData);
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;

    console.warn("[website:home] Database temporarily unavailable after retries", {
      code: typeof error === "object" && error && "code" in error ? error.code : undefined,
    });

    return [[], [], [], defaultSiteSettings];
  }
}

export default async function Page() {
  await connection();
  const [projects, performanceAudits, testimonials, settings] = await resolveHomePageData();
  return (
    <HomePage
      projects={projects}
      performanceAudits={performanceAudits}
      testimonials={testimonials}
      settings={settings}
    />
  );
}

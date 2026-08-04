import { HomePage } from "@/features/home/home-page";
import { getDb } from "@/server/db";

export default async function Page() {
  const db = getDb();
  const [projects, technologies, performanceAudits] = await Promise.all([
    db.project.findMany({ where: { status: "PUBLISHED", featured: true }, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }], take: 5, select: { id: true, title: true, slug: true, shortSummary: true, projectType: true, year: true, cardImage: { select: { secureUrl: true, altText: true } }, technologies: { orderBy: { position: "asc" }, take: 4, select: { technology: { select: { id: true, name: true } } } } } }),
    db.technology.findMany({ where: { projects: { some: { project: { status: "PUBLISHED" } } } }, orderBy: [{ category: "asc" }, { name: "asc" }], select: { id: true, name: true, category: true } }),
    db.performanceAudit.findMany({
      where: { status: "SUCCEEDED", auditedAt: { not: null }, project: { status: "PUBLISHED" } },
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
  ]);
  return <HomePage projects={projects} technologies={technologies} performanceAudits={performanceAudits} />;
}

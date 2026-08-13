import { HomePage } from "@/features/home/home-page";
import { getDb } from "@/server/db";
import { getSiteSettings } from "@/features/settings/queries";

export default async function Page() {
  const db = getDb();
  const [projects, technologies, performanceAudits, testimonials, settings] = await Promise.all([
    db.project.findMany({ where: { status: "PUBLISHED", featured: true }, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }], take: 5, select: { id: true, title: true, slug: true, shortSummary: true, projectType: true, year: true, cardImage: { select: { secureUrl: true, altText: true } }, technologies: { orderBy: { position: "asc" }, take: 4, select: { technology: { select: { id: true, name: true } } } } } }),
    db.technology.findMany({ where: { projects: { some: { project: { status: "PUBLISHED" } } } }, orderBy: [{ position: "asc" }, { name: "asc" }], select: { id: true, name: true, category: true } }),
    db.performanceAudit.findMany({
      where: { status: "SUCCEEDED", publicVisible: true, auditedAt: { not: null }, project: { status: "PUBLISHED" } },
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
    db.testimonial.findMany({ where: { published: true, featured: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], take: 3, select: { id: true, authorName: true, authorRole: true, quote: true, client: { select: { name: true } }, photo: { select: { secureUrl: true, altText: true } }, project: { select: { title: true, slug: true } } } }),
    getSiteSettings(),
  ]);
  return <HomePage projects={projects} technologies={technologies} performanceAudits={performanceAudits} testimonials={testimonials} settings={settings} />;
}

import { HomePage } from "@/features/home/home-page";
import { getDb } from "@/server/db";

export default async function Page() {
  const projects = await getDb().project.findMany({ where: { status: "PUBLISHED", featured: true }, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }], take: 5, select: { id: true, title: true, slug: true, shortSummary: true, projectType: true, year: true, cardImage: { select: { secureUrl: true, altText: true } }, technologies: { orderBy: { position: "asc" }, take: 4, select: { technology: { select: { id: true, name: true } } } } } });
  return <HomePage projects={projects} />;
}

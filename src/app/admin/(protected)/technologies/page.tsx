import { TechnologyManager } from "@/features/technologies/technology-manager";
import { getDb } from "@/server/db";

export default async function TechnologiesPage() {
  const technologies = await getDb().technology.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }], select: { id: true, name: true, category: true, icon: true, _count: { select: { projects: true } } } });
  return <main className="admin-main"><div className="admin-page-heading"><div><p className="admin-eyebrow">Content system</p><h1>Technologies</h1><p>Maintain the reusable stack used across projects and the public portfolio.</p></div></div><TechnologyManager technologies={technologies.map(({ _count, ...technology }) => ({ ...technology, projectCount: _count.projects }))} /></main>;
}

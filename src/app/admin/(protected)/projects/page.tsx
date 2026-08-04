import Link from "next/link";

import { getDb } from "@/server/db";

export default async function AdminProjectsPage() {
  const projects = await getDb().project.findMany({ orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }], select: { id: true, title: true, slug: true, status: true, year: true, featured: true, displayOrder: true, repositoryUrl: true, repositoryVisible: true, updatedAt: true } });
  return <main className="admin-main"><div className="admin-page-heading"><div><p className="admin-eyebrow">Content</p><h1>Projects</h1><p>Create, review, publish, order, or hide portfolio case studies.</p></div><Link className="admin-primary-button" href="/admin/projects/new">Create project</Link></div>{projects.length === 0 ? <div className="admin-panel admin-empty-state"><strong>No projects yet.</strong><p>Create the first case study as a private draft.</p></div> : <div className="admin-panel admin-project-list">{projects.map((project) => <Link key={project.id} href={`/admin/projects/${project.id}`} className="admin-project-row"><div><strong>{project.title}</strong><p>/{project.slug} · {project.year} · Updated {project.updatedAt.toLocaleDateString("en-NG")}</p></div><div className="admin-project-meta">{project.featured && <span>Featured #{project.displayOrder}</span>}<span className={`admin-status admin-status-${project.status.toLowerCase()}`}>{project.status}</span>{project.repositoryUrl && <span>{project.repositoryVisible ? "Public repo" : "Private repo"}</span>}</div></Link>)}</div>}</main>;
}

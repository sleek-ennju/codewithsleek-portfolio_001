import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";
import { ProjectSectionBuilder } from "@/features/projects/project-section-builder";
import { getDb } from "@/server/db";

export default async function EditProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [project, media, technologies] = await Promise.all([
    getDb().project.findUnique({ where: { id: projectId }, include: {
      images: { where: { role: "gallery" }, orderBy: { position: "asc" }, select: { mediaId: true } },
      technologies: { orderBy: { position: "asc" }, select: { technology: { select: { name: true } } } },
      metrics: { orderBy: { position: "asc" }, select: { label: true, value: true, unit: true } },
      sections: { orderBy: { position: "asc" }, select: { id: true, type: true, title: true, content: true } },
    } }),
    getDb().mediaAsset.findMany({ where: { kind: "IMAGE" }, orderBy: { createdAt: "desc" }, select: { id: true, fileName: true, secureUrl: true, altText: true } }),
    getDb().technology.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }], select: { id: true, name: true, category: true } }),
  ]);
  if (!project) notFound();
  const action = updateProject.bind(null, project.id);
  return <main className="admin-main"><div className="admin-page-heading"><div><p className="admin-eyebrow">Edit project</p><h1>{project.title}</h1><p>Publishing changes the public visibility immediately.</p></div><div className="admin-heading-actions"><Link className="admin-secondary-button" href={`/admin/projects/${project.id}/preview`} target="_blank">Preview project ↗</Link><Link className="admin-secondary-button" href="/admin/projects">Return to projects</Link></div></div><div className="admin-panel"><ProjectForm action={action} media={media} technologyOptions={technologies} values={{ ...project, galleryImageIds: project.images.map((image) => image.mediaId), technologies: project.technologies.map((item) => item.technology.name), metrics: project.metrics }} /></div><div className="admin-panel"><ProjectSectionBuilder projectId={project.id} sections={project.sections} /></div></main>;
}

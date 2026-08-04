import Link from "next/link";

import { createProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";
import { getDb } from "@/server/db";

export default async function NewProjectPage() {
  const media = await getDb().mediaAsset.findMany({ where: { kind: "IMAGE" }, orderBy: { createdAt: "desc" }, select: { id: true, fileName: true, secureUrl: true, altText: true } });
  return <main className="admin-main"><div className="admin-page-heading"><div><p className="admin-eyebrow">New project</p><h1>Create a case study</h1><p>Start as a draft, then publish when the public story is ready.</p></div><Link className="admin-secondary-button" href="/admin/projects">Return to projects</Link></div><div className="admin-panel"><ProjectForm action={createProject} media={media} /></div></main>;
}

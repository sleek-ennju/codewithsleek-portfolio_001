import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/features/projects/project-case-study";
import { getPreviewProject } from "@/features/projects/queries";

export default async function ProjectPreviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getPreviewProject(projectId);
  if (!project) notFound();
  return <ProjectCaseStudy preview project={project} />;
}

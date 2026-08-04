import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/features/projects/project-case-study";
import { getPublishedProject } from "@/features/projects/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return {};
  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortSummary;
  const image = project.socialImage || project.coverImage || project.cardImage;
  return { title, description, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { title, description, type: "article", publishedTime: project.publishedAt?.toISOString(), images: image ? [{ url: image.secureUrl, width: image.width ?? undefined, height: image.height ?? undefined, alt: image.altText ?? project.title }] : [] }, twitter: { card: "summary_large_image", title, description, images: image ? [image.secureUrl] : [] } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();
  return <ProjectCaseStudy project={project} />;
}

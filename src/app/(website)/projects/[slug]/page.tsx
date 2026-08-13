import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/features/projects/project-case-study";
import { getPublishedProject } from "@/features/projects/queries";
import { JsonLd } from "@/components/shared/json-ld";
import { absoluteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return {};
  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortSummary;
  const image = project.socialImage || project.coverImage || project.cardImage;
  return { title: { absolute: title }, description, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { title, description, url: `/projects/${project.slug}`, type: "article", publishedTime: project.publishedAt?.toISOString(), modifiedTime: project.updatedAt.toISOString(), images: image ? [{ url: image.secureUrl, width: image.width ?? undefined, height: image.height ?? undefined, alt: image.altText ?? project.title }] : [] }, twitter: { card: "summary_large_image", title, description, images: image ? [image.secureUrl] : [] } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();
  const image = project.socialImage || project.coverImage || project.cardImage;
  return <><JsonLd data={{ "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, description: project.seoDescription || project.shortSummary, url: absoluteUrl(`/projects/${project.slug}`), image: image?.secureUrl, datePublished: project.publishedAt?.toISOString(), dateModified: project.updatedAt.toISOString(), author: { "@type": "Person", name: "Emmanuel Ihenacho", url: absoluteUrl("/") }, keywords: project.technologies.map(({ technology }) => technology.name) }} /><ProjectCaseStudy project={project} /></>;
}

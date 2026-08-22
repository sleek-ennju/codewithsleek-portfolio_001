import type { Metadata } from "next";
import Image from "next/image";
import { ProjectsArchiveMotion } from "@/features/projects/projects-archive-motion";
import Link from "next/link";

import { getDb } from "@/server/db";

export const metadata: Metadata = { title: "Projects", description: "Code with Sleek project case studies and verified engineering outcomes.", alternates: { canonical: "/projects" }, openGraph: { title: "Projects", description: "Code with Sleek project case studies and verified engineering outcomes.", url: "/projects" } };

export default async function ProjectsPage() {
  const projects = await getDb().project.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }], include: { cardImage: true, technologies: { orderBy: { position: "asc" }, take: 4, include: { technology: true } } } });
  return <main className="projects-archive container"><ProjectsArchiveMotion /><header><Link className="projects-back-link" href="/">← Back to home</Link><p className="section-kicker">Project archive</p><h1>Selected work, built with intent.</h1><p>Product stories covering the problem, engineering decisions, measurable outcomes, and lessons behind each build.</p></header>{projects.length === 0 ? <div className="projects-empty"><strong>Case studies are being prepared.</strong><p>Published projects will appear here.</p></div> : <div className="projects-public-grid">{projects.map((project) => <article key={project.id}><Link href={`/projects/${project.slug}`}><div className="projects-card-image">{project.cardImage ? <Image src={project.cardImage.secureUrl} alt={project.cardImage.altText ?? ""} fill sizes="(max-width: 800px) 100vw, 50vw" /> : <span>{project.projectType}</span>}</div><p>{project.projectType} · {project.year}</p><h2>{project.title}</h2><p>{project.shortSummary}</p><div>{project.technologies.map(({ technology }) => <span key={technology.id}>{technology.name}</span>)}</div></Link></article>)}</div>}</main>;
}

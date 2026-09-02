import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { ProjectsArchiveMotion } from "@/features/projects/projects-archive-motion";
import Link from "next/link";

import { isDatabaseUnavailable, withDatabaseRetry } from "@/server/database-resilience";
import { getDb } from "@/server/db";

export const metadata: Metadata = {
  title: "Projects",
  description: "Code with Sleek project case studies and verified engineering outcomes.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects",
    description: "Code with Sleek project case studies and verified engineering outcomes.",
    url: "/projects",
  },
};

export default async function ProjectsPage() {
  await connection();

  let projects: Awaited<ReturnType<typeof loadPublishedProjects>> = [];
  try {
    projects = await withDatabaseRetry(loadPublishedProjects);
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    console.error("[website:projects] Database temporarily unavailable after retries");
  }

  return (
    <main className="projects-archive container">
      <ProjectsArchiveMotion />
      <header>
        <Link className="projects-back-link" href="/">
          ← Back to home
        </Link>
        <p className="section-kicker">Project archive</p>
        <h1>Selected work, built with intent.</h1>
        <p>
          Product stories covering the problem, engineering decisions, measurable outcomes, and
          lessons behind each build.
        </p>
      </header>
      {projects.length === 0 ? (
        <div className="projects-empty">
          <strong>Case studies are being prepared.</strong>
          <p>Published projects will appear here.</p>
        </div>
      ) : (
        <div className="projects-public-grid">
          {projects.map((project, index) => (
            <article className="projects-archive-card" key={project.id}>
              <Link className="projects-archive-card-link" href={`/projects/${project.slug}`}>
                <div className="projects-card-image">
                  {project.cardImage ? (
                    <Image
                      src={project.cardImage.secureUrl}
                      alt={project.cardImage.altText ?? ""}
                      fill
                      sizes="(max-width: 800px) 100vw, 55vw"
                    />
                  ) : (
                    <span>{project.projectType}</span>
                  )}
                  <span className="projects-card-index">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="projects-card-content">
                  <div className="projects-card-meta">
                    <p>{project.projectType}</p>
                    <span>{project.year}</span>
                  </div>
                  <h2>{project.title}</h2>
                  <p className="projects-card-summary">{project.shortSummary}</p>
                  <div className="projects-card-footer">
                    <div className="projects-card-technologies">
                      {project.technologies.map(({ technology }) => (
                        <span key={technology.id}>{technology.name}</span>
                      ))}
                    </div>
                    <span className="projects-card-cta">
                      View case study{" "}
                      <i>
                        <DiagonalArrow />
                      </i>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function loadPublishedProjects() {
  return getDb().project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
    include: {
      cardImage: true,
      technologies: { orderBy: { position: "asc" }, take: 4, include: { technology: true } },
    },
  });
}

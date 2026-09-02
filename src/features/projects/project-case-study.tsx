import Image from "next/image";
import Link from "next/link";

import type { ProjectCaseStudyData } from "@/features/projects/queries";
import { ProjectSectionRenderer } from "@/features/projects/project-section-renderer";
import { CaseStudyMotion } from "@/features/projects/case-study-motion";

const narrativeFields = [
  ["Problem", "problem"],
  ["Goals", "goals"],
  ["My role", "role"],
  ["Approach", "approach"],
  ["Challenges", "challenges"],
  ["Solutions", "solutions"],
  ["Outcome", "outcome"],
  ["Lessons learned", "lessons"],
] as const;

export function ProjectCaseStudy({
  project,
  preview = false,
}: {
  project: ProjectCaseStudyData;
  preview?: boolean;
}) {
  const narrativeChapters = narrativeFields.filter(([, key]) => Boolean(project[key]));

  return (
    <main className="case-study">
      <CaseStudyMotion />
      {preview && (
        <div className="case-study-preview-banner">
          <strong>Admin preview</strong>
          <span>This {project.status.toLowerCase()} project is not necessarily public.</span>
        </div>
      )}
      <header className="case-study-hero container">
        <Link className="text-link" href={preview ? `/admin/projects/${project.id}` : "/projects"}>
          ← {preview ? "Return to editor" : "All projects"}
        </Link>
        <p className="section-kicker">
          {project.projectType} · {project.year}
        </p>
        <h1>{project.title}</h1>
        <p>{project.shortSummary}</p>
        <div className="case-study-links">
          {project.liveUrl && (
            <Link className="button button-dark" href={project.liveUrl} target="_blank">
              View live site ↗
            </Link>
          )}
          {project.demoUrl && (
            <Link className="button button-light" href={project.demoUrl} target="_blank">
              Open demo ↗
            </Link>
          )}
          {project.repositoryVisible && project.repositoryUrl && (
            <Link className="button button-light" href={project.repositoryUrl} target="_blank">
              View repository ↗
            </Link>
          )}
        </div>
        <div className="case-study-tags">
          {project.industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </header>
      {project.coverImage && (
        <div className="case-study-cover container">
          <Image
            src={project.coverImage.secureUrl}
            alt={project.coverImage.altText ?? ""}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1248px"
          />
        </div>
      )}
      <section className="case-study-intro container">
        <p className="section-kicker">Overview</p>
        <p>{project.overview}</p>
      </section>
      {project.metrics.length > 0 && (
        <dl className="case-study-metrics container">
          {project.metrics.map((metric) => (
            <div key={metric.id}>
              <dt>
                <strong>{metric.value}</strong>
                {metric.unit && <small>{metric.unit}</small>}
              </dt>
              <dd>{metric.label}</dd>
            </div>
          ))}
        </dl>
      )}
      {narrativeChapters.length > 0 && (
        <div className="case-study-narrative" aria-label="Case study chapters">
          {narrativeChapters.map(([label, key], index) => (
            <section
              className={`case-study-chapter case-study-chapter-tone-${index % 4}`}
              data-chapter={String(index + 1).padStart(2, "0")}
              key={key}
              style={{ zIndex: index + 1 }}
            >
              <div className="case-study-chapter-inner container">
                <header>
                  <p className="section-kicker">{label}</p>
                  <span>
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(narrativeChapters.length).padStart(2, "0")}
                  </span>
                </header>
                <div className="case-study-chapter-copy">
                  <p>{project[key]}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
      <ProjectSectionRenderer sections={project.sections} />
      {project.technologies.length > 0 && (
        <section className="case-study-stack container">
          <p className="section-kicker">Technology</p>
          <div>
            {project.technologies.map(({ technology }) => (
              <span key={technology.id}>{technology.name}</span>
            ))}
          </div>
        </section>
      )}
      {project.images.length > 0 && (
        <section className="case-study-gallery container">
          <p className="section-kicker">Project gallery</p>
          <div>
            {project.images.map(({ id, media }) => (
              <figure key={id}>
                <Image
                  src={media.secureUrl}
                  alt={media.altText ?? ""}
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
      {project.testimonials.length > 0 && (
        <section className="case-study-testimonials container">
          <p className="section-kicker">Client perspective</p>
          {project.testimonials.map((testimonial) => (
            <figure key={testimonial.id}>
              <blockquote className={testimonial.quote.length > 260 ? "is-long" : undefined}>
                “{testimonial.quote}”
              </blockquote>
              <figcaption>
                <strong>{testimonial.authorName}</strong>
                <span>
                  {testimonial.authorRole}
                  {testimonial.client ? ` · ${testimonial.client.name}` : ""}
                </span>
              </figcaption>
            </figure>
          ))}
        </section>
      )}
      <footer className="case-study-footer container">
        <p>Have a similar challenge?</p>
        <Link className="button button-dark liquid-button" href="/#contact">
          <span>Start a conversation</span>
        </Link>
      </footer>
    </main>
  );
}

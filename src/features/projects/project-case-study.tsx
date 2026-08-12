import Image from "next/image";
import Link from "next/link";

import type { ProjectCaseStudyData } from "@/features/projects/queries";
import { ProjectSectionRenderer } from "@/features/projects/project-section-renderer";

const narrativeFields = [
  ["Problem", "problem"], ["Goals", "goals"], ["My role", "role"], ["Approach", "approach"],
  ["Challenges", "challenges"], ["Solutions", "solutions"], ["Outcome", "outcome"], ["Lessons learned", "lessons"],
] as const;

export function ProjectCaseStudy({ project, preview = false }: { project: ProjectCaseStudyData; preview?: boolean }) {
  return <main className="case-study">
    {preview && <div className="case-study-preview-banner"><strong>Admin preview</strong><span>This {project.status.toLowerCase()} project is not necessarily public.</span></div>}
    <header className="case-study-hero container">
      <Link className="text-link" href={preview ? `/admin/projects/${project.id}` : "/projects"}>← {preview ? "Return to editor" : "All projects"}</Link>
      <p className="section-kicker">{project.projectType} · {project.year}</p>
      <h1>{project.title}</h1>
      <p>{project.shortSummary}</p>
      <div className="case-study-links">
        {project.liveUrl && <Link className="button button-dark" href={project.liveUrl} target="_blank">View live site ↗</Link>}
        {project.demoUrl && <Link className="button button-light" href={project.demoUrl} target="_blank">Open demo ↗</Link>}
        {project.repositoryVisible && project.repositoryUrl && <Link className="button button-light" href={project.repositoryUrl} target="_blank">View repository ↗</Link>}
      </div>
      <div className="case-study-tags">{project.industries.map((industry) => <span key={industry}>{industry}</span>)}</div>
    </header>
    {project.coverImage && <div className="case-study-cover container"><Image src={project.coverImage.secureUrl} alt={project.coverImage.altText ?? ""} fill priority sizes="(max-width: 1280px) 100vw, 1248px" /></div>}
    <section className="case-study-intro container"><p className="section-kicker">Overview</p><p>{project.overview}</p></section>
    {project.metrics.length > 0 && <dl className="case-study-metrics container">{project.metrics.map((metric) => <div key={metric.id}><dt>{metric.value}{metric.unit && <small>{metric.unit}</small>}</dt><dd>{metric.label}</dd></div>)}</dl>}
    <div className="case-study-narrative container">{narrativeFields.map(([label, key]) => project[key] && <section key={key}><p className="section-kicker">{label}</p><p>{project[key]}</p></section>)}</div>
    <ProjectSectionRenderer sections={project.sections} />
    {project.technologies.length > 0 && <section className="case-study-stack container"><p className="section-kicker">Technology</p><div>{project.technologies.map(({ technology }) => <span key={technology.id}>{technology.name}</span>)}</div></section>}
    {project.images.length > 0 && <section className="case-study-gallery container"><p className="section-kicker">Project gallery</p><div>{project.images.map(({ id, media }) => <figure key={id}><Image src={media.secureUrl} alt={media.altText ?? ""} fill sizes="(max-width: 800px) 100vw, 50vw" /></figure>)}</div></section>}
    {project.testimonials.length > 0 && <section className="case-study-testimonials container"><p className="section-kicker">Client perspective</p>{project.testimonials.map((testimonial) => <figure key={testimonial.id}><blockquote>“{testimonial.quote}”</blockquote><figcaption><strong>{testimonial.authorName}</strong><span>{testimonial.authorRole}{testimonial.client ? ` · ${testimonial.client.name}` : ""}</span></figcaption></figure>)}</section>}
    <footer className="case-study-footer container"><p>Have a similar challenge?</p><Link className="button button-dark" href="/#contact">Start a conversation</Link></footer>
  </main>;
}

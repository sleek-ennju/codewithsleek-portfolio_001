import Link from "next/link";
import Image from "next/image";

import { credibilityMetrics, processSteps } from "./content";
import { ContactSection } from "@/features/contact/contact-section";

type FeaturedProject = { id: string; title: string; slug: string; shortSummary: string; projectType: string; year: number; cardImage: { secureUrl: string; altText: string | null } | null; technologies: Array<{ technology: { id: string; name: string } }> };
type HomeTechnology = { id: string; name: string; category: string };
type PerformanceEvidence = { id: string; strategy: string; performanceScore: number | null; accessibilityScore: number | null; bestPracticesScore: number | null; seoScore: number | null; auditedAt: Date | null; source: string; project: { title: string; slug: string } };

export function HomePage({ projects, technologies, performanceAudits }: { projects: FeaturedProject[]; technologies: HomeTechnology[]; performanceAudits: PerformanceEvidence[] }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow hero-stack"><span aria-hidden="true">&lt;/&gt;</span> Frontend Engineer · React · Tailwind CSS · TypeScript · MERN Stack · Figma</p>
          <h1>Crafting logic,<br /><span>the sleek way.</span></h1>
          <p className="hero-lede">
            I design and engineer clear, scalable web products for ambitious
            teams—from the first product decision to the polished release.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="#contact">Start a project <span aria-hidden="true">↗</span></Link>
            <Link className="button button-light" href="#works">Explore my work</Link>
          </div>

          <dl className="metrics-grid">
            {credibilityMetrics.map((metric) => (
              <div key={metric.value}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section works-section" id="works">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Selected work</p>
              <h2>Products with a point of view.</h2>
            </div>
            <Link className="text-link" href="/projects">View all case studies <span aria-hidden="true">↗</span></Link>
          </div>

          {projects.length === 0 ? <div className="home-projects-empty"><strong>Selected case studies are being prepared.</strong><p>Published, featured work will appear here.</p></div> : <div className="project-grid">
            {projects.map((project, index) => <article className="project-card" key={project.id}><Link href={`/projects/${project.slug}`} aria-label={`Read the ${project.title} case study`}><div className={`project-art project-art-${index + 1}`}>{project.cardImage && <Image src={project.cardImage.secureUrl} alt={project.cardImage.altText ?? ""} fill sizes={index > 2 ? "(max-width: 800px) 100vw, 50vw" : "(max-width: 800px) 100vw, 33vw"} priority={index < 2} />}<span>Case study {String(index + 1).padStart(2, "0")}</span><i aria-hidden="true">↗</i></div><p>{project.projectType} · {project.year}</p><h3>{project.title}</h3><p className="project-summary">{project.shortSummary}</p>{project.technologies.length > 0 && <div className="home-project-tech">{project.technologies.map(({ technology }) => <span key={technology.id}>{technology.name}</span>)}</div>}</Link></article>)}
          </div>}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="process-heading">
            <div><p className="section-kicker">How I work</p><h2>From intent to a dependable release.</h2></div>
            <p>Each stage closes a different kind of risk: the wrong problem, an unclear experience, fragile implementation, or an unverified launch.</p>
          </div>
          <ol className="process-grid">
            {processSteps.map((step) => (
              <li key={step.number}>
                <div><span>{step.number}</span><small>Stage</small></div>
                <div><h3>{step.title}</h3><p>{step.description}</p><strong>{step.output}</strong></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section technology-section" id="technologies">
        <div className="container">
          <div className="technology-heading">
            <div><p className="section-kicker">Capabilities</p><h2>A focused stack for complete product delivery.</h2></div>
            <p>Tools are selected for the product—not for the trend cycle. This stack supports responsive interfaces, dependable application logic, useful data, and considered design.</p>
          </div>
          {technologies.length ? (
            <ul className="technology-grid">
              {technologies.map((technology, index) => (
                <li key={technology.id}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{technology.name}</strong><small>{technology.category}</small></div>
                </li>
              ))}
            </ul>
          ) : <p className="technology-empty">Published-project technologies will appear here.</p>}
        </div>
      </section>

      {performanceAudits.length > 0 ? <section className="section proof-section" aria-labelledby="proof-title">
        <div className="container">
          <div className="proof-heading">
            <div><p className="section-kicker light">Verified performance</p><h2 id="proof-title">Measured. Dated. Reproducible.</h2></div>
            <p>Only successful audits for published work appear here. Scores remain tied to their project, test strategy, source, and audit date.</p>
          </div>
          <div className="proof-audit-grid">
            {performanceAudits.map((audit) => {
              const scores = [{ label: "Performance", value: audit.performanceScore }, { label: "Accessibility", value: audit.accessibilityScore }, { label: "Best practices", value: audit.bestPracticesScore }, { label: "SEO", value: audit.seoScore }].filter((score): score is { label: string; value: number } => score.value !== null);
              return <article key={audit.id}>
                <div className="proof-audit-meta"><span>{audit.strategy.toLowerCase()}</span>{audit.auditedAt && <time dateTime={audit.auditedAt.toISOString()}>{audit.auditedAt.toLocaleDateString("en-NG", { month: "short", year: "numeric" })}</time>}</div>
                <h3><Link href={`/projects/${audit.project.slug}`}>{audit.project.title}<span aria-hidden="true">↗</span></Link></h3>
                <dl>{scores.map((score) => <div key={score.label}><dt>{score.value}</dt><dd>{score.label}</dd></div>)}</dl>
                <p>Source: {audit.source}</p>
              </article>;
            })}
          </div>
        </div>
      </section> : null}

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="portrait-placeholder profile-card" aria-label="Emmanuel Ihenacho profile card">
            <div className="profile-card-top"><span>EI</span><small>CODEwithSleek / 01</small></div>
            <div><p>Frontend engineer</p><strong>Emmanuel<br />Ihenacho</strong></div>
          </div>
          <div>
            <p className="section-kicker">About me</p>
            <h2>Frontend-first. Product-minded. Full-stack when it matters.</h2>
            <p>I’m Emmanuel Ihenacho, the frontend engineer behind Code with Sleek. I turn product ideas and visual systems into responsive web applications that feel clear, deliberate, and ready for real use.</p>
            <p>My work combines React and TypeScript engineering, MERN-stack delivery, and design fluency in Figma—with accessibility, maintainability, and product outcomes treated as part of the same job.</p>
            <div className="about-actions">
              <Link className="button button-dark" href="#contact">Start a project</Link>
              <Link className="button button-light" href="/projects">Browse case studies</Link>
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}

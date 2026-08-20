import Link from "next/link";
import Image from "next/image";

import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { credibilityMetrics, processSteps } from "./content";
import { ContactSection } from "@/features/contact/contact-section";
import type { SiteSettings } from "@/features/settings/schemas";
import { TestimonialDeck, type HomeTestimonial } from "./testimonial-deck";

type FeaturedProject = { id: string; title: string; slug: string; shortSummary: string; projectType: string; year: number; cardImage: { secureUrl: string; altText: string | null } | null; technologies: Array<{ technology: { id: string; name: string } }> };
type HomeTechnology = { id: string; name: string; category: string };
type PerformanceEvidence = { id: string; strategy: string; performanceScore: number | null; accessibilityScore: number | null; bestPracticesScore: number | null; seoScore: number | null; auditedAt: Date | null; source: string; project: { title: string; slug: string } };

export function HomePage({ projects, technologies, performanceAudits, testimonials, settings }: { projects: FeaturedProject[]; technologies: HomeTechnology[]; performanceAudits: PerformanceEvidence[]; testimonials: HomeTestimonial[]; settings: SiteSettings }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow hero-stack"><span aria-hidden="true">&lt;/&gt;</span> Frontend Engineer · React · Tailwind CSS · TypeScript · MERN Stack · Figma</p>
          <h1>{settings.heroTitle}<br /><span>{settings.heroAccent}</span></h1>
          <p className="hero-lede">{settings.heroDescription}</p>
          <div className="hero-actions">
            <Link className="button button-dark liquid-button" href="#contact"><span>Start a project <DiagonalArrow /></span></Link>
            <Link className="button button-light liquid-button" href="#works"><span>Explore my work</span></Link>
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
            <Link className="text-link" href="/projects">View all case studies <DiagonalArrow /></Link>
          </div>

          {projects.length === 0 ? <div className="home-projects-empty"><strong>Selected case studies are being prepared.</strong><p>Published, featured work will appear here.</p></div> : <div className="project-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.id}>
                <Link href={`/projects/${project.slug}`} aria-label={`Read the ${project.title} case study`}>
                  <div className={`project-art project-art-${index + 1}`}>
                    {project.cardImage && <Image src={project.cardImage.secureUrl} alt={project.cardImage.altText ?? ""} fill sizes={index > 2 ? "(max-width: 800px) 100vw, 50vw" : "(max-width: 800px) 100vw, 33vw"} priority={index < 2} />}
                    <span>Case study {String(index + 1).padStart(2, "0")}</span>
                    <i><DiagonalArrow /></i>
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-meta"><span>{project.projectType}</span><time>{project.year}</time></div>
                    <h3>{project.title}</h3>
                    <p className="project-summary">{project.shortSummary}</p>
                    <div className="project-card-footer">
                      {project.technologies.length > 0 && <ul className="home-project-tech" aria-label={`${project.title} technologies`}>{project.technologies.map(({ technology }) => <li key={technology.id}>{technology.name}</li>)}</ul>}
                      <span className="project-card-cta">View case study <i><DiagonalArrow /></i></span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container">
          <div className="process-heading">
            <div><p className="section-kicker">How I work</p><h2>From intent to a <span>dependable release.</span></h2></div>
            <p>Each stage closes a different kind of risk: the wrong problem, an unclear experience, fragile implementation, or an unverified launch.</p>
          </div>
          <ol className="process-grid">
            {processSteps.map((step) => (
              <li key={step.number}>
                <div className="process-index"><span>{step.number}</span><small>Stage</small><i aria-hidden="true" /></div>
                <div className="process-step"><h3>{step.title}</h3><div><p>{step.description}</p><strong><span>Output</span>{step.output}</strong></div></div>
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
                <h3><Link href={`/projects/${audit.project.slug}`}>{audit.project.title}<DiagonalArrow /></Link></h3>
                <dl>{scores.map((score) => <div key={score.label}><dt>{score.value}</dt><dd>{score.label}</dd></div>)}</dl>
                <p>Source: {audit.source}</p>
              </article>;
            })}
          </div>
        </div>
      </section> : null}

      {testimonials.length > 0 && <section className="section testimonial-section" aria-labelledby="testimonial-title"><div className="container"><div className="testimonial-heading"><div><p className="section-kicker">Client perspective</p><h2 id="testimonial-title">Clear work. Lasting confidence.</h2></div><p>Selected notes from the people closest to the work. Move through the deck to reveal each perspective.</p></div><TestimonialDeck testimonials={testimonials} /></div></section>}

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="portrait-placeholder profile-card" aria-label="Emmanuel Ihenacho profile card">
            <div className="profile-card-top"><span><Image src="/logos/cws_logo_mark.png" alt="" width={500} height={500} sizes="112px" /></span><small>CODE / WITH / SLEEK<br />PROFILE 01</small></div>
            <div className="profile-card-copy"><p>Frontend engineer · Product thinker</p><strong>Emmanuel<br />Ihenacho</strong><small>Design clarity <i /> Engineering rigour</small></div>
          </div>
          <div className="about-copy">
            <p className="section-kicker">About me</p>
            <h2>Frontend-first. Product-minded. Full-stack when it matters.</h2>
            <p>I’m Emmanuel Ihenacho, the frontend engineer behind Code with Sleek. I turn product ideas and visual systems into responsive web applications that feel clear, deliberate, and ready for real use.</p>
            <p>My work combines React and TypeScript engineering, MERN-stack delivery, and design fluency in Figma—with accessibility, maintainability, and product outcomes treated as part of the same job.</p>
            <div className="about-actions">
              <Link className="button button-dark liquid-button" href="#contact"><span>Start a project</span></Link>
              <Link className="button button-light liquid-button" href="/projects"><span>Browse case studies</span></Link>
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";

import { credibilityMetrics, processSteps } from "./content";

type FeaturedProject = { id: string; title: string; slug: string; shortSummary: string; projectType: string; year: number; cardImage: { secureUrl: string; altText: string | null } | null; technologies: Array<{ technology: { id: string; name: string } }> };

export function HomePage({ projects }: { projects: FeaturedProject[] }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />
        <div className="container hero-content">
          <p className="hero-availability"><span aria-hidden="true" /> Available for select product engagements</p>
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
          <p className="section-kicker">How I work</p>
          <h2>My process</h2>
          <p className="section-intro">A structured path from product intent to a reliable release.</p>
          <ol className="process-grid">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section proof-section">
        <div className="container proof-grid">
          <div>
            <p className="section-kicker light">Build with Sleek</p>
            <h2>Thoughtful engineering for ambitious products.</h2>
          </div>
          <blockquote>
            <p>Client stories and verified testimonials will be published here through the content platform.</p>
            <footer>Content-managed social proof</footer>
          </blockquote>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="portrait-placeholder" aria-label="Portrait placeholder for Emmanuel Ihenacho">
            <span>EI</span>
            <strong>Ihenacho<br />Emmanuel</strong>
          </div>
          <div>
            <p className="section-kicker">About me</p>
            <h2>Frontend-first. Product-minded. Full-stack when it matters.</h2>
            <p>I’m the engineer behind Code with Sleek, building modern web products where technical discipline and thoughtful user experience reinforce each other.</p>
            <p>The final biography, portrait, social links, and booking destination will be managed through the platform’s site settings.</p>
            <div className="about-actions">
              <Link className="button button-dark" href="#contact">Book a call</Link>
              <Link className="button button-light" href="/resume">View résumé</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

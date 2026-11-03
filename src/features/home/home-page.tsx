import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { processSteps, services } from "./content";
import { ContactSection } from "@/features/contact/contact-section";
import type { SiteSettings } from "@/features/settings/schemas";
import { TestimonialDeck, type HomeTestimonial } from "./testimonial-deck";
import { MotionStory } from "./motion-story";
import { ProjectVisualGallery } from "./project-visual-gallery";

type ProjectVisual = { secureUrl: string; altText: string | null };
type FeaturedProject = {
  id: string;
  title: string;
  slug: string;
  shortSummary: string;
  projectType: string;
  year: number;
  cardImage: ProjectVisual | null;
  coverImage: ProjectVisual | null;
  socialImage: ProjectVisual | null;
  images: Array<{ role: string; position: number; media: ProjectVisual }>;
  technologies: Array<{ technology: { id: string; name: string } }>;
};
type PerformanceEvidence = {
  id: string;
  strategy: string;
  performanceScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  seoScore: number | null;
  auditedAt: Date | null;
  source: string;
  project: { title: string; slug: string };
};

export function HomePage({
  projects,
  performanceAudits,
  testimonials,
  settings,
}: {
  projects: FeaturedProject[];
  performanceAudits: PerformanceEvidence[];
  testimonials: HomeTestimonial[];
  settings: SiteSettings;
}) {
  return (
    <main>
      <MotionStory />
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow hero-stack">
            <span aria-hidden="true">&lt;/&gt;</span> Websites · Booking and payments · Automation ·
            Custom software
          </p>
          <h1>
            <span className="hero-title-main">{settings.heroTitle}</span>
            <span className="hero-title-accent">{settings.heroAccent}</span>
          </h1>
          <p className="hero-lede">{settings.heroDescription}</p>
          <div className="hero-actions">
            <Link className="button button-dark liquid-button" href="#contact">
              <span>
                Get a free audit <DiagonalArrow />
              </span>
            </Link>
            <Link className="button button-light liquid-button" href="#works">
              <span>See our work</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section works-section" id="works">
        <div className="container works-story-stage">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Selected work</p>
              <h2>Work that earns its keep.</h2>
            </div>
            <Link className="text-link" href="/projects">
              View all case studies <DiagonalArrow />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="home-projects-empty">
              <strong>Selected case studies are being prepared.</strong>
              <p>Published, featured work will appear here.</p>
            </div>
          ) : (
            <>
              <div className="work-story-progress" aria-hidden="true">
                <span />
                <ol>
                  {projects.slice(0, 3).map((project, index) => (
                    <li key={project.id}>{String(index + 1).padStart(2, "0")}</li>
                  ))}
                </ol>
              </div>
              <div className="project-grid">
                {projects.slice(0, 3).map((project, index) => {
                  const storyVisuals = project.images
                    .filter((image) => image.role === "story")
                    .sort((a, b) => a.position - b.position)
                    .map(({ media }) => media);
                  const fallbackVisuals = [
                    project.cardImage,
                    project.coverImage,
                    project.socialImage,
                    ...project.images
                      .filter((image) => image.role !== "story")
                      .map(({ media }) => media),
                  ]
                    .filter((visual): visual is ProjectVisual => Boolean(visual))
                    .filter(
                      (visual, visualIndex, visuals) =>
                        visuals.findIndex(({ secureUrl }) => secureUrl === visual.secureUrl) ===
                        visualIndex,
                    );
                  const projectVisuals = [
                    ...storyVisuals,
                    ...fallbackVisuals.filter(
                      (fallback) =>
                        !storyVisuals.some((story) => story.secureUrl === fallback.secureUrl),
                    ),
                  ].slice(0, 3);
                  const trailerVisuals = projectVisuals.map((visual, visualIndex) => ({
                    ...visual,
                    frame:
                      visualIndex === 0 ? "overview" : visualIndex === 1 ? "feature" : "detail",
                  }));
                  return (
                    <article className="project-card" key={project.id}>
                      <div className="project-card-layout">
                        <ProjectVisualGallery
                          projectTitle={project.title}
                          projectHref={`/projects/${project.slug}`}
                          caseStudyNumber={String(index + 1).padStart(2, "0")}
                          visuals={trailerVisuals}
                          eager={index === 0}
                        />
                        <Link
                          className="project-copy-link"
                          href={`/projects/${project.slug}`}
                          aria-label={`Read the ${project.title} case study`}
                        >
                          <div className="project-card-body">
                            <div className="project-card-meta">
                              <span>{project.projectType}</span>
                              <time>{project.year}</time>
                            </div>
                            <h3>{project.title}</h3>
                            <p className="project-summary">{project.shortSummary}</p>
                            <div className="project-card-footer">
                              {project.technologies.length > 0 && (
                                <ul
                                  className="home-project-tech"
                                  aria-label={`${project.title} technologies`}
                                >
                                  {project.technologies.map(({ technology }) => (
                                    <li key={technology.id}>{technology.name}</li>
                                  ))}
                                </ul>
                              )}
                              <span className="project-card-cta">
                                View case study{" "}
                                <i>
                                  <DiagonalArrow />
                                </i>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="process-transition" aria-hidden="true">
          <span />
          <i />
        </div>
        <div className="container process-story-stage">
          <div className="process-heading">
            <div>
              <p className="section-kicker">How we work</p>
              <h2>
                From first audit to a <span>measured launch.</span>
              </h2>
            </div>
            <p>
              Each stage removes a different risk: fixing the wrong thing, an unclear scope,
              surprises during the build, or a launch nobody measured.
            </p>
          </div>
          <div className="process-story-layout">
            <div className="process-blueprint" aria-hidden="true">
              <div className="process-blueprint-chrome">
                <span>CODE WITH SLEEK / DELIVERY SYSTEM</span>
                <i>LIVE</i>
              </div>
              <div className="process-progress">
                <span />
              </div>
              <div className="blueprint-layer blueprint-layer-1">
                <span>01 / AUDIT</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="blueprint-layer blueprint-layer-2">
                <span>02 / PLAN</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="blueprint-layer blueprint-layer-3">
                <span>03 / BUILD</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="blueprint-layer blueprint-layer-4">
                <span>04 / LAUNCH</span>
                <strong>MEASURED</strong>
                <i />
                <i />
                <i />
              </div>
            </div>
            <ol className="process-grid">
              {processSteps.map((step) => (
                <li key={step.number}>
                  <div className="process-index">
                    <span>{step.number}</span>
                    <small>Stage</small>
                  </div>
                  <div className="process-step">
                    <h3>{step.title}</h3>
                    <div>
                      <p>{step.description}</p>
                      <strong>
                        <span>Output</span>
                        {step.output}
                      </strong>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section technology-section services-section" id="services">
        <div className="container">
          <div className="technology-heading">
            <div>
              <p className="section-kicker">Services</p>
              <h2>Start with a website. Grow into a system.</h2>
            </div>
            <p>
              Most clients start with a site that finally does its job. As the business grows, we add
              the pieces that save time and win more customers, on the same foundation.
            </p>
          </div>
          <div className="capability-rail" aria-hidden="true">
            <span>FOUND</span>
            <i />
            <span>BOOKED</span>
            <i />
            <span>AUTOMATED</span>
            <i />
            <span>SCALED</span>
          </div>
          <ul className="technology-grid services-grid">
            {services.map((service) => (
              <li key={service.number}>
                <span aria-hidden="true">{service.number}</span>
                <div>
                  <small>{service.outcome}</small>
                  <strong>{service.title}</strong>
                  <p>{service.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {performanceAudits.length > 0 ? (
        <section className="section proof-section" aria-labelledby="proof-title">
          <div className="proof-transition-copy" aria-hidden="true">
            <span>DESIGN / ENGINEER / DELIVER</span>
          </div>
          <div className="container">
            <div className="proof-stage">
              <div className="proof-heading">
                <div>
                  <p className="section-kicker light">Verified performance</p>
                  <h2 id="proof-title">Measured. Dated. Reproducible.</h2>
                </div>
                <p>
                  Every site we ship is measured with Google PageSpeed. Scores are recorded by
                  project, device and date, so you can check the claims for yourself.
                </p>
              </div>
              <div className="proof-ledger" aria-hidden="true">
                <span>Evidence log</span>
                <i />
                <span>{String(performanceAudits.length).padStart(2, "0")} latest runs</span>
              </div>
              <div className="proof-audit-grid">
                {performanceAudits.map((audit, auditIndex) => {
                  const scores = [
                    { label: "Performance", value: audit.performanceScore },
                    { label: "Accessibility", value: audit.accessibilityScore },
                    { label: "Best practices", value: audit.bestPracticesScore },
                    { label: "SEO", value: audit.seoScore },
                  ].filter(
                    (score): score is { label: string; value: number } => score.value !== null,
                  );
                  return (
                    <article key={audit.id}>
                      <div className="proof-audit-meta">
                        <span>{String(auditIndex + 1).padStart(2, "0")}</span>
                        <span>{audit.strategy.toLowerCase()} audit</span>
                        {audit.auditedAt && (
                          <time dateTime={audit.auditedAt.toISOString()}>
                            {audit.auditedAt.toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })}
                          </time>
                        )}
                      </div>
                      <h3>
                        <Link href={`/projects/${audit.project.slug}`}>
                          {audit.project.title}
                          <DiagonalArrow />
                        </Link>
                      </h3>
                      <dl>
                        {scores.map((score) => (
                          <div
                            key={score.label}
                            style={{ "--audit-score": `${score.value}%` } as CSSProperties}
                          >
                            <dt>{score.value}</dt>
                            <dd>{score.label}</dd>
                            <span aria-hidden="true" />
                          </div>
                        ))}
                      </dl>
                      <p>
                        <span>Source</span>
                        <strong>{audit.source}</strong>
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 && (
        <section className="section testimonial-section" aria-labelledby="testimonial-title">
          <div className="container">
            <div className="testimonial-heading">
              <div>
                <p className="section-kicker">Client perspective</p>
                <h2 id="testimonial-title">Clear work. Lasting confidence.</h2>
              </div>
              <p>
                Selected notes from the people closest to the work. Move through the deck to reveal
                each perspective.
              </p>
            </div>
            <TestimonialDeck testimonials={testimonials} />
          </div>
        </section>
      )}

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="portrait-placeholder profile-card">
            <Image
              className="profile-card-portrait"
              src="/images/about/emmanuel-ihenacho-editorial-blue-facing-right.png"
              alt="Emmanuel Ihenacho, founder and lead engineer of CodeWithSleek"
              fill
              sizes="(max-width: 800px) 100vw, 40vw"
            />
            <div className="profile-card-top">
              <small>
                CODE / WITH / SLEEK
                <br />
                FOUNDER
              </small>
            </div>
            <div className="profile-card-copy">
              <p>Founder · Lead engineer</p>
              <strong>
                Emmanuel
                <br />
                Ihenacho
              </strong>
              <small>
                Design clarity <i /> Engineering rigour
              </small>
            </div>
          </div>
          <div className="about-copy">
            <p className="section-kicker">Who you’ll work with</p>
            <h2>Built by an engineer. Run like a studio.</h2>
            <p>
              CodeWithSleek is led by Emmanuel Ihenacho, a full-stack engineer based in the UK. You
              work directly with the person building your project, not an account manager passing
              messages along.
            </p>
            <p>
              That means proper engineering under the hood, with fast pages, accessible design and
              reliable integrations, and plain English in every conversation about it.
            </p>
            <div className="about-actions">
              <Link className="button button-dark liquid-button" href="#contact">
                <span>Get a free audit</span>
              </Link>
              <Link className="button button-light liquid-button" href="/founder">
                <span>Meet the founder</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}

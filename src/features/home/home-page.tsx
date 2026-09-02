import Link from "next/link";
import Image from "next/image";

import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { ResumeDownload } from "@/components/shared/resume-download";
import { processSteps } from "./content";
import { ContactSection } from "@/features/contact/contact-section";
import type { SiteSettings } from "@/features/settings/schemas";
import { TestimonialDeck, type HomeTestimonial } from "./testimonial-deck";
import { MotionStory } from "./motion-story";
import { ProjectVisualGallery } from "./project-visual-gallery";
import {
  EXPERIENCED_STACK,
  FOCUSED_STACK,
  TECHNOLOGY_LIBRARY,
  technologySlug,
} from "@/features/technologies/library";

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
  const technologyByName = new Map(
    TECHNOLOGY_LIBRARY.map((technology) => [
      technology.name,
      { ...technology, id: technologySlug(technology.name) },
    ]),
  );
  const focusedTechnologies = FOCUSED_STACK.map((name) => technologyByName.get(name)).filter(
    (technology) => technology !== undefined,
  );
  const experiencedTechnologies = EXPERIENCED_STACK.map((name) =>
    technologyByName.get(name),
  ).filter((technology) => technology !== undefined);
  return (
    <main>
      <MotionStory />
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow hero-stack">
            <span aria-hidden="true">&lt;/&gt;</span> Frontend Engineer · Next.js · React ·
            TypeScript · Tailwind CSS · State · Motion · Integrations
          </p>
          <h1>
            <span className="hero-title-main">{settings.heroTitle}</span>
            <span className="hero-title-accent">{settings.heroAccent}</span>
          </h1>
          <p className="hero-lede">{settings.heroDescription}</p>
          <div className="hero-actions">
            <Link className="button button-dark liquid-button" href="#contact">
              <span>
                Start a project <DiagonalArrow />
              </span>
            </Link>
            <Link className="button button-light liquid-button" href="#works">
              <span>Explore my work</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section works-section" id="works">
        <div className="container works-story-stage">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Selected work</p>
              <h2>Products with a point of view.</h2>
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
              <p className="section-kicker">How I work</p>
              <h2>
                From intent to a <span>dependable release.</span>
              </h2>
            </div>
            <p>
              Each stage closes a different kind of risk: the wrong problem, an unclear experience,
              fragile implementation, or an unverified launch.
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
                <span>01 / PRODUCT FRAME</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="blueprint-layer blueprint-layer-2">
                <span>02 / EXPERIENCE MAP</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="blueprint-layer blueprint-layer-3">
                <span>03 / ENGINEERED SYSTEM</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="blueprint-layer blueprint-layer-4">
                <span>04 / RELEASE READY</span>
                <strong>VERIFIED</strong>
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

      <section className="section technology-section" id="technologies">
        <div className="container">
          <div className="technology-heading">
            <div>
              <p className="section-kicker">Capabilities</p>
              <h2>A focused stack for complete product delivery.</h2>
            </div>
            <p>
              Next.js, React, and TypeScript anchor the work. Tailwind, deliberate state management,
              purposeful motion, and dependable integrations turn that foundation into complete
              products.
            </p>
          </div>
          <div className="capability-rail" aria-hidden="true">
            <span>DESIGN</span>
            <i />
            <span>FRONTEND</span>
            <i />
            <span>DATA</span>
            <i />
            <span>INTEGRATIONS</span>
          </div>
          {focusedTechnologies.length ? (
            <ul className="technology-grid">
              {focusedTechnologies.map((technology, index) => (
                <li key={technology.id}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{technology.name}</strong>
                    <small>{technology.category}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="technology-empty">The focused technology library is being prepared.</p>
          )}
          {experiencedTechnologies.length > 0 && (
            <div className="technology-experience">
              <p>Also experienced with</p>
              <ul>
                {experiencedTechnologies.map((technology) => (
                  <li key={technology.id}>{technology.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {performanceAudits.length > 0 ? (
        <section className="section proof-section" aria-labelledby="proof-title">
          <div className="container">
            <div className="proof-heading">
              <div>
                <p className="section-kicker light">Verified performance</p>
                <h2 id="proof-title">Measured. Dated. Reproducible.</h2>
              </div>
              <p>
                Only successful audits for published work appear here. Scores remain tied to their
                project, test strategy, source, and audit date.
              </p>
            </div>
            <div className="proof-audit-grid">
              {performanceAudits.map((audit) => {
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
                      <span>{audit.strategy.toLowerCase()}</span>
                      {audit.auditedAt && (
                        <time dateTime={audit.auditedAt.toISOString()}>
                          {audit.auditedAt.toLocaleDateString("en-NG", {
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
                        <div key={score.label}>
                          <dt>{score.value}</dt>
                          <dd>{score.label}</dd>
                        </div>
                      ))}
                    </dl>
                    <p>Source: {audit.source}</p>
                  </article>
                );
              })}
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
              alt="Emmanuel Ihenacho, frontend engineer and founder of Code with Sleek"
              fill
              sizes="(max-width: 800px) 100vw, 40vw"
            />
            <div className="profile-card-top">
              <small>
                CODE / WITH / SLEEK
                <br />
                PROFILE 01
              </small>
            </div>
            <div className="profile-card-copy">
              <p>Frontend engineer · Product thinker</p>
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
            <p className="section-kicker">About me</p>
            <h2>Frontend-first. Product-minded. Full-stack when it matters.</h2>
            <p>
              I’m Emmanuel Ihenacho, the frontend engineer behind Code with Sleek. I turn product
              ideas and visual systems into responsive web applications that feel clear, deliberate,
              and ready for real use.
            </p>
            <p>
              My work combines Next.js, React, and TypeScript engineering with considered state,
              motion, backend integrations, and design fluency in Figma—with accessibility,
              maintainability, and product outcomes treated as part of the same job.
            </p>
            <div className="about-actions">
              <Link className="button button-dark liquid-button" href="#contact">
                <span>Start a project</span>
              </Link>
              <Link className="button button-light liquid-button" href="/projects">
                <span>Browse case studies</span>
              </Link>
              <ResumeDownload
                href={settings.resumeUrl || "/documents/Emmanuel-Ihenacho-Resume.pdf"}
              />
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}

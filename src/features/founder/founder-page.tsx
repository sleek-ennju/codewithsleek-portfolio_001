import Image from "next/image";
import Link from "next/link";

import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { ResumeDownload } from "@/components/shared/resume-download";
import {
  EXPERIENCED_STACK,
  FOCUSED_STACK,
  TECHNOLOGY_LIBRARY,
  technologySlug,
} from "@/features/technologies/library";

export function FounderPage({ resumeUrl, githubUrl }: { resumeUrl: string; githubUrl: string }) {
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
      <section className="section about-section founder-intro" id="about">
        <div className="container about-grid">
          <div className="portrait-placeholder profile-card">
            <Image
              className="profile-card-portrait"
              src="/images/about/emmanuel-ihenacho-editorial-blue-facing-right.png"
              alt="Emmanuel Ihenacho, founder and lead engineer of CodeWithSleek"
              fill
              priority
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
            <p className="section-kicker">The founder</p>
            <h1>Frontend-first. Product-minded. Full-stack when it matters.</h1>
            <p>
              I’m Emmanuel Ihenacho, founder and lead engineer at CodeWithSleek. I turn product ideas
              and visual systems into responsive web applications that feel clear, deliberate and
              ready for real use.
            </p>
            <p>
              My work combines Next.js, React and TypeScript engineering with considered state,
              motion, backend integrations and design fluency in Figma, with accessibility,
              maintainability and business outcomes treated as part of the same job.
            </p>
            <div className="about-actions">
              <ResumeDownload href={resumeUrl} />
              <Link className="button button-light liquid-button" href={githubUrl} target="_blank">
                <span>
                  GitHub <DiagonalArrow />
                </span>
              </Link>
            </div>
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
              Next.js, React and TypeScript anchor the work. Tailwind, deliberate state management,
              purposeful motion and dependable integrations turn that foundation into complete
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
          <div className="about-actions founder-actions">
            <Link className="button button-dark liquid-button" href="/#contact">
              <span>
                Work with us <DiagonalArrow />
              </span>
            </Link>
            <Link className="button button-light liquid-button" href="/projects">
              <span>Browse case studies</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { DiagonalArrow } from "@/components/shared/diagonal-arrow";

type GalleryVisual = { secureUrl: string; altText: string | null; frame: string };

export function ProjectVisualGallery({ projectTitle, projectHref, caseStudyNumber, visuals, eager }: { projectTitle: string; projectHref: string; caseStudyNumber: string; visuals: GalleryVisual[]; eager: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = visuals.length - 1;
  const showPrevious = () => setActiveIndex((current) => current === 0 ? lastIndex : current - 1);
  const showNext = () => setActiveIndex((current) => current === lastIndex ? 0 : current + 1);

  return (
    <div className="project-art">
      <div className="project-gallery-media" aria-live="polite">
        {visuals.map((visual, index) => <Image className="project-visual-slide" data-active={index === activeIndex} data-visual-frame={visual.frame} key={`${visual.secureUrl}-${index}`} src={visual.secureUrl} alt={index === activeIndex ? visual.altText ?? `${projectTitle} project view ${index + 1}` : ""} fill sizes="(max-width: 800px) 100vw, 58vw" loading={eager && index === 0 ? "eager" : "lazy"} />)}
      </div>
      <Link className="project-art-link" href={projectHref} aria-label={`Read the ${projectTitle} case study`}><i><DiagonalArrow /></i></Link>
      <span>Case study {caseStudyNumber}</span>
      {visuals.length > 1 && <div className="project-gallery-controls" aria-label={`${projectTitle} gallery controls`}>
        <button type="button" onClick={showPrevious} aria-label={`Show previous ${projectTitle} image`}><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m12.5 4.5-5 5.5 5 5.5" /></svg></button>
        <small><b>{String(activeIndex + 1).padStart(2, "0")}</b> / {String(visuals.length).padStart(2, "0")}</small>
        <button type="button" onClick={showNext} aria-label={`Show next ${projectTitle} image`}><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7.5 4.5 5 5.5-5 5.5" /></svg></button>
      </div>}
    </div>
  );
}

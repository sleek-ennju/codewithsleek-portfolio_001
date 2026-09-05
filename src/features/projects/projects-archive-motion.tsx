"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ProjectsArchiveMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".projects-archive > header > *",
          { y: 36 },
          { y: 0, duration: 0.72, stagger: 0.08 },
        )
        .fromTo(
          ".projects-public-grid article:first-child",
          { autoAlpha: 0, y: 70, clipPath: "inset(10% 0 0 round 1.5rem)" },
          { autoAlpha: 1, y: 0, clipPath: "inset(0% 0 0 round 1.5rem)", duration: 0.9 },
          "-=0.28",
        );

      gsap.utils
        .toArray<HTMLElement>(".projects-public-grid article")
        .slice(1)
        .forEach((card, index) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 90, x: index % 2 ? 28 : -28 },
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 94%", end: "top 62%", scrub: 0.55 },
            },
          );
        });
    });
    return () => media.revert();
  }, []);

  return null;
}

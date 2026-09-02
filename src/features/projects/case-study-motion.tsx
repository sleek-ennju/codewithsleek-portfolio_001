"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CaseStudyMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("case-study-motion-ready");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".case-study-chapter");
      const sizeChapters = () => {
        const headerHeight =
          document.querySelector<HTMLElement>(".site-header")?.getBoundingClientRect().height ?? 0;
        const availableHeight = window.innerHeight - headerHeight;
        chapters.forEach((chapter) => {
          const overflow = Math.max(0, chapter.offsetHeight - availableHeight);
          chapter.style.setProperty("--chapter-sticky-top", `${headerHeight - overflow}px`);
        });
      };

      sizeChapters();
      window.addEventListener("resize", sizeChapters);
      gsap.fromTo(
        ".case-study-intro > *",
        { autoAlpha: 0, y: 70 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".case-study-intro",
            start: "top 88%",
            end: "center 58%",
            scrub: 0.6,
          },
        },
      );
      gsap.fromTo(
        ".case-study-metrics > div",
        { autoAlpha: 0, y: 58, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".case-study-metrics",
            start: "top 90%",
            end: "center 58%",
            scrub: 0.65,
          },
        },
      );
      chapters.forEach((chapter) => {
        const copy = chapter.querySelector<HTMLElement>(".case-study-chapter-copy");
        if (!copy) return;
        gsap.fromTo(
          copy,
          { autoAlpha: 0.25, y: 80 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 88%", end: "top 38%", scrub: 0.7 },
          },
        );
      });
      gsap.utils
        .toArray<HTMLElement>(
          ".case-study-section, .case-study-stack, .case-study-gallery figure, .case-study-testimonials figure",
        )
        .forEach((section, index) => {
          gsap.fromTo(
            section,
            { autoAlpha: 0, y: 72, x: index % 2 ? 18 : -18 },
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top 92%", end: "top 62%", scrub: 0.55 },
            },
          );
        });
      ScrollTrigger.addEventListener("refreshInit", sizeChapters);
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("resize", sizeChapters);
        ScrollTrigger.removeEventListener("refreshInit", sizeChapters);
        chapters.forEach((chapter) => chapter.style.removeProperty("--chapter-sticky-top"));
      };
    });
    return () => {
      document.documentElement.classList.remove("case-study-motion-ready");
      media.revert();
    };
  }, []);

  return null;
}

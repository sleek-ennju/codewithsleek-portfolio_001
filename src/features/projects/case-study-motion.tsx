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
      gsap.fromTo(".case-study-intro > *", { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: 0.12, ease: "none", scrollTrigger: { trigger: ".case-study-intro", start: "top 88%", end: "center 58%", scrub: 0.6 } });
      gsap.fromTo(".case-study-metrics > div", { autoAlpha: 0, y: 58, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: ".case-study-metrics", start: "top 90%", end: "center 58%", scrub: 0.65 } });
      gsap.utils.toArray<HTMLElement>(".case-study-narrative section, .case-study-section, .case-study-stack, .case-study-gallery figure, .case-study-testimonials figure").forEach((section, index) => {
        gsap.fromTo(section, { autoAlpha: 0, y: 72, x: index % 2 ? 18 : -18 }, { autoAlpha: 1, y: 0, x: 0, ease: "none", scrollTrigger: { trigger: section, start: "top 92%", end: "top 62%", scrub: 0.55 } });
      });
    });
    return () => {
      document.documentElement.classList.remove("case-study-motion-ready");
      media.revert();
    };
  }, []);

  return null;
}

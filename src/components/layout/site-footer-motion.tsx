"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SiteFooterMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (!footer) return;

    document.documentElement.classList.add("footer-motion-ready");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: footer, start: "top 100%", end: "bottom bottom", scrub: 0.65, invalidateOnRefresh: true },
      });
      const closingPanel = document.querySelector<HTMLElement>(".case-study-footer");
      if (closingPanel) timeline.fromTo(closingPanel, { yPercent: 0, scale: 1 }, { yPercent: -20, scale: 0.985, borderRadius: "0 0 2rem 2rem", ease: "none" }, 0);
      timeline
        .fromTo(footer, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", ease: "none" }, 0)
        .fromTo(".footer-invitation > p", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.16)
        .fromTo(".footer-invitation > a", { autoAlpha: 0, y: 70, backgroundSize: "205% 100%", backgroundPosition: "0% 0" }, { autoAlpha: 1, y: 0, backgroundSize: "100% 100%", backgroundPosition: "0% 0", ease: "none" }, 0.24)
        .fromTo(".footer-grid > *", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.06, ease: "none" }, 0.5);
    });

    return () => {
      document.documentElement.classList.remove("footer-motion-ready");
      media.revert();
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionStory() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    const media = gsap.matchMedia();
    const contexts: gsap.Context[] = [];
    root.classList.add("story-motion-ready");

    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) contexts.push(gsap.context(() => {
        gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.65 } })
          .to(".hero-grid", { scale: 0.9, yPercent: 12, transformOrigin: "50% 100%", ease: "none" }, 0)
          .to(".hero h1", { xPercent: -3, yPercent: -7, ease: "none" }, 0)
          .to(".hero-lede, .hero-actions", { yPercent: -15, autoAlpha: 0.72, ease: "none" }, 0);
      }, hero));

      const works = document.querySelector<HTMLElement>(".works-section");
      const cards = gsap.utils.toArray<HTMLElement>(".works-section .project-card");
      if (works && cards.length) contexts.push(gsap.context(() => {
        const artwork = cards.map((card) => card.querySelector<HTMLElement>(".project-art"));
        const visualGroups = cards.map((card) => gsap.utils.toArray<HTMLElement>(card.querySelectorAll(".project-visual-slide")));
        const images = visualGroups.flat();
        const bodies = cards.map((card) => card.querySelector<HTMLElement>(".project-card-body"));
        const visualLabels = cards.map((card) => card.querySelector<HTMLElement>(".project-visual-status b"));
        gsap.set(cards, { autoAlpha: 0, y: 28, pointerEvents: "none" });
        gsap.set(artwork, { clipPath: "inset(100% 0 0 0 round 2rem)" });
        gsap.set(images, { autoAlpha: 0, scale: 1.02 });
        visualGroups.forEach((group) => gsap.set(group[0], { autoAlpha: 1 }));
        gsap.set(cards[0], { autoAlpha: 1, y: 0, pointerEvents: "auto" });
        gsap.set(artwork[0], { clipPath: "inset(0% 0 0 0 round 2rem)" });
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: works, start: "top 76%", end: "top 18%", scrub: 0.65, invalidateOnRefresh: true },
        })
          .fromTo(".section-heading-row .section-kicker", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0)
          .fromTo(".section-heading-row h2", { autoAlpha: 0, y: 72 }, { autoAlpha: 1, y: 0, duration: 0.34 }, 0.06)
          .fromTo(".section-heading-row > .text-link", { autoAlpha: 0, x: 56 }, { autoAlpha: 1, x: 0, duration: 0.28 }, 0.14)
          .fromTo(".work-story-progress", { autoAlpha: 0, scaleX: 0.18 }, { autoAlpha: 1, scaleX: 1, transformOrigin: "left center", duration: 0.36 }, 0.2)
          .fromTo(cards[0], { autoAlpha: 0, y: 96 }, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.25)
          .fromTo(artwork[0], { clipPath: "inset(16% 0 0 0 round 2rem)", scale: 0.965 }, { clipPath: "inset(0% 0 0 0 round 2rem)", scale: 1, duration: 0.42 }, 0.28)
          .fromTo(bodies[0], { autoAlpha: 0, x: 64 }, { autoAlpha: 1, x: 0, duration: 0.36 }, 0.34)
          .fromTo(cards[0].querySelectorAll(".project-card-meta, h3, .project-summary, .project-card-footer"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.045 }, 0.42);
        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: works, start: "top top+=88", end: `+=${Math.max(420, cards.length * 115)}%`, pin: ".works-story-stage", scrub: 0.65, anticipatePin: 1, invalidateOnRefresh: true },
        });
        const appendVisualStory = (index: number) => {
          const group = visualGroups[index];
          if (!group.length) {
            timeline.to(bodies[index], { y: -7, duration: 0.7, ease: "none" });
            return;
          }
          if (group.length === 1) {
            timeline
              .to(group[0], { scale: 1.065, duration: 0.75, ease: "none" })
              .to(bodies[index], { y: -7, duration: 0.75, ease: "none" }, "<");
            return;
          }
          group.slice(1).forEach((slide, slideIndex) => {
            const previous = group[slideIndex];
            timeline
              .to(previous, { scale: 1.055, duration: 0.32, ease: "none" })
              .to(previous, { autoAlpha: 0, scale: 1.085, duration: 0.24 })
              .fromTo(slide, { autoAlpha: 0, scale: 1.01 }, { autoAlpha: 1, scale: 1.045, duration: 0.34 }, "<")
              .set(visualLabels[index], { attr: { "data-current": `${"\u200B"}${String(slideIndex + 2).padStart(2, "0")}` } }, "<");
          });
          timeline
            .to(group.at(-1)!, { scale: 1.065, duration: 0.28, ease: "none" })
            .to(bodies[index], { y: -7, duration: 0.28, ease: "none" }, "<");
        };
        appendVisualStory(0);
        cards.forEach((card, index) => {
          if (!index) return;
          timeline
            .to(cards[index - 1], { y: -20, autoAlpha: 0, pointerEvents: "none", duration: 0.3 })
            .to(card, { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.36 }, "<0.16")
            .to(artwork[index], { clipPath: "inset(0% 0 0 0 round 2rem)", duration: 0.52 }, "<");
          appendVisualStory(index);
        });
        const storyDuration = timeline.duration();
        timeline.fromTo(".work-story-progress span", { scaleX: 0 }, { scaleX: 1, duration: storyDuration, ease: "none" }, 0);
      }, works));

      const process = document.querySelector<HTMLElement>(".process-section");
      const processStage = document.querySelector<HTMLElement>(".process-story-stage");
      const steps = gsap.utils.toArray<HTMLElement>(".process-grid li");
      if (process && processStage && steps.length) contexts.push(gsap.context(() => {
        const layers = gsap.utils.toArray<HTMLElement>(".blueprint-layer");
        gsap.set(steps, { autoAlpha: 0, y: 20 });
        gsap.set(layers, { autoAlpha: 0, scale: 0.965 });
        gsap.set(steps[0], { autoAlpha: 1, y: 0 });
        gsap.set(layers[0], { autoAlpha: 1, scale: 0.965 });
        gsap.timeline({ scrollTrigger: { trigger: ".process-transition", start: "top 88%", end: "bottom 22%", scrub: 0.7, invalidateOnRefresh: true } })
          .fromTo(".process-transition span", { yPercent: 0, scaleX: 1 }, { yPercent: -104, scaleX: 0.96, ease: "none" }, 0)
          .fromTo(".process-transition i", { yPercent: 0, scaleX: 1, opacity: 0.2 }, { yPercent: -104, scaleX: 0.96, opacity: 0, ease: "none" }, 0)
          .fromTo(".process-heading > div", { autoAlpha: 0, y: 110, xPercent: -5 }, { autoAlpha: 1, y: 0, xPercent: 0, ease: "none" }, 0)
          .fromTo(".process-heading > p", { autoAlpha: 0, y: 155, xPercent: 5 }, { autoAlpha: 1, y: 0, xPercent: 0, ease: "none" }, 0.08)
          .fromTo(".process-blueprint", { autoAlpha: 0, y: 190, rotate: -1.4 }, { autoAlpha: 1, y: 0, rotate: 0, ease: "none" }, 0.14)
          .fromTo(".process-grid", { autoAlpha: 0, y: 240 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.2);
        const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: processStage, start: "top top+=88", end: `+=${steps.length * 90}%`, pin: processStage, scrub: 0.65, anticipatePin: 1, invalidateOnRefresh: true } });
        steps.forEach((step, index) => {
          if (index) timeline
            .to(steps[index - 1], { autoAlpha: 0, y: -16, duration: 0.24 })
            .to(layers[index - 1], { autoAlpha: 0, scale: 1.025, duration: 0.28 }, "<")
            .to(step, { autoAlpha: 1, y: 0, duration: 0.34 }, "<0.12")
            .to(layers[index], { autoAlpha: 1, scale: 1, duration: 0.38 }, "<");
          else timeline.to(layers[0], { scale: 1, duration: 0.38 });
          timeline
            .fromTo(layers[index].querySelectorAll("i, strong"), { autoAlpha: 0.25, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.045 }, "<0.04")
            .to(step, { y: -6, duration: 0.42, ease: "none" });
        });
        const processDuration = timeline.duration();
        timeline.fromTo(".process-progress span", { scaleY: 0 }, { scaleY: 1, duration: processDuration, ease: "none" }, 0);
      }, process));

      const technology = document.querySelector<HTMLElement>(".technology-section");
      if (technology) contexts.push(gsap.context(() => {
        const technologyCards = gsap.utils.toArray<HTMLElement>(".technology-grid li");
        gsap.set(technologyCards, { autoAlpha: 0, y: 80 });
        gsap.timeline({ scrollTrigger: { trigger: technology, start: "top 88%", end: "top 36%", scrub: 0.65, invalidateOnRefresh: true } })
          .fromTo(".technology-heading > div", { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, ease: "none" }, 0)
          .fromTo(".technology-heading > p", { autoAlpha: 0, y: 135 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.12)
          .fromTo(".capability-rail span", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.08, ease: "none" }, 0.2)
          .fromTo(".capability-rail i", { scaleX: 0 }, { scaleX: 1, stagger: 0.08, ease: "none" }, 0.24);
        gsap.to(technologyCards, { autoAlpha: 1, y: 0, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ".technology-grid", start: "top 88%", end: "center 48%", scrub: 0.6, invalidateOnRefresh: true } });
        gsap.fromTo(technology, { "--capability-shift": "7%" }, { "--capability-shift": "-7%", ease: "none", scrollTrigger: { trigger: technology, start: "top bottom", end: "bottom top", scrub: 0.7 } });
      }, technology));

      const testimonial = document.querySelector<HTMLElement>(".testimonial-section");
      if (testimonial) contexts.push(gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: testimonial, start: "top 84%", end: "top 34%", scrub: 0.65, invalidateOnRefresh: true },
        });
        timeline
          .fromTo(".testimonial-heading > div", { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, ease: "none" }, 0)
          .fromTo(".testimonial-heading > p", { autoAlpha: 0, y: 105 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.1)
          .fromTo(".testimonial-deck", { autoAlpha: 0, y: 120, rotateX: 8, scale: 0.95 }, { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, ease: "none" }, 0.18)
          .fromTo(".testimonial-shadow-card-back", { x: 0, y: 0, rotate: 0 }, { x: 37, y: -24, rotate: 2.2, ease: "none" }, 0.48)
          .fromTo(".testimonial-shadow-card-middle", { x: 0, y: 0, rotate: 0 }, { x: 18, y: -12, rotate: 1, ease: "none" }, 0.48)
          .fromTo(".testimonial-deck-controls", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.56);
      }, testimonial));

      const about = document.querySelector<HTMLElement>(".about-section");
      if (about) contexts.push(gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: about, start: "top 84%", end: "top 24%", scrub: 0.65, invalidateOnRefresh: true },
        });
        timeline
          .fromTo(".profile-card", { autoAlpha: 0.35, x: -48, clipPath: "inset(0 100% 0 0 round 2rem)" }, { autoAlpha: 1, x: 0, clipPath: "inset(0 0% 0 0 round 2rem)", duration: 0.28, ease: "none" }, 0)
          .fromTo(".profile-card-top > span, .profile-card-top > small", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.06, ease: "none" }, 0.24)
          .fromTo(".profile-card-copy > *", { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, stagger: 0.07, ease: "none" }, 0.3)
          .fromTo(".about-copy > .section-kicker", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.14)
          .fromTo(".about-copy > h2", { autoAlpha: 0, y: 58 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.22)
          .fromTo(".about-copy > p:not(.section-kicker)", { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, stagger: 0.08, ease: "none" }, 0.34)
          .fromTo(".about-actions", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.48);
      }, about));

      const contact = document.querySelector<HTMLElement>(".contact-section");
      if (contact) contexts.push(gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: contact, start: "top 86%", end: "top 28%", scrub: 0.65, invalidateOnRefresh: true },
        });
        timeline
          .fromTo(".contact-copy > .section-kicker", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, ease: "none" }, 0)
          .fromTo(".contact-copy > h2", { autoAlpha: 0, y: 64 }, { autoAlpha: 1, y: 0, ease: "none" }, 0.08)
          .fromTo(".contact-copy > p:not(.section-kicker), .contact-copy dl > div", { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, stagger: 0.055, ease: "none" }, 0.2)
          .fromTo(".contact-form", { autoAlpha: 0, x: 84, y: 42, scale: 0.975 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, ease: "none" }, 0.12)
          .fromTo(".contact-form > *", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, stagger: 0.045, ease: "none" }, 0.32)
          .fromTo(contact, { "--contact-word-shift": "-7%" }, { "--contact-word-shift": "0%", ease: "none" }, 0);
      }, contact));

      for (const selector of [".proof-section"]) {
        const section = document.querySelector<HTMLElement>(selector);
        if (!section) continue;
        contexts.push(gsap.context(() => {
          const content = section.querySelectorAll<HTMLElement>(":scope > .container, :scope > div");
          gsap.fromTo(content, { clipPath: "inset(7% 0 0 0)", y: 28 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 82%", once: true } });
        }, section));
      }
    });

    media.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const elements = gsap.utils.toArray<HTMLElement>(".works-section .project-card, .process-grid li, .technology-grid li, .profile-card, .about-copy, .contact-form");
      elements.forEach((element) => contexts.push(gsap.context(() => {
        gsap.fromTo(element, { y: 28, clipPath: "inset(0 0 12% 0)" }, { y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
      }, element)));
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".project-card, .process-grid li, .technology-grid li, .profile-card, .about-copy, .contact-form", { clearProps: "all" });
    });

    let anchorFrame = 0;
    let anchorTimer = 0;
    const scrollToHashTarget = () => {
      const target = document.querySelector<HTMLElement>(window.location.hash);
      if (!target) return;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 88);
      window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
    };
    const alignHashTarget = () => {
      const hash = window.location.hash;
      if (!hash) return;
      anchorFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        anchorFrame = window.requestAnimationFrame(scrollToHashTarget);
        anchorTimer = window.setTimeout(() => { ScrollTrigger.refresh(); scrollToHashTarget(); }, 350);
      });
    };
    const refresh = () => { ScrollTrigger.refresh(); alignHashTarget(); };
    window.addEventListener("load", refresh, { once: true });
    window.addEventListener("hashchange", alignHashTarget);
    alignHashTarget();
    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("hashchange", alignHashTarget);
      if (anchorFrame) window.cancelAnimationFrame(anchorFrame);
      if (anchorTimer) window.clearTimeout(anchorTimer);
      contexts.forEach((context) => context.revert());
      media.revert();
      root.classList.remove("story-motion-ready");
    };
  }, []);

  return null;
}

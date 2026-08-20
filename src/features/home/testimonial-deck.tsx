"use client";

import Image from "next/image";
import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import Link from "next/link";
import { useState } from "react";

function DeckArrow({ direction }: { direction: "previous" | "next" }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d={direction === "previous" ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} /></svg>;
}

export type HomeTestimonial = {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  client: { name: string } | null;
  photo: { secureUrl: string; altText: string | null } | null;
  project: { title: string; slug: string } | null;
};

export function TestimonialDeck({ testimonials }: { testimonials: HomeTestimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const active = testimonials[activeIndex];
  const initials = active.authorName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  function show(index: number, nextDirection: "next" | "previous") {
    setDirection(nextDirection);
    setActiveIndex((index + testimonials.length) % testimonials.length);
  }

  return (
    <div className="testimonial-deck">
      <div className="testimonial-stage">
        <div className="testimonial-shadow-card testimonial-shadow-card-back" aria-hidden="true" />
        <div className="testimonial-shadow-card testimonial-shadow-card-middle" aria-hidden="true" />
        <figure className={`testimonial-card testimonial-card-${direction}`} key={`${active.id}-${direction}`}>
          <div className="testimonial-card-topline"><span>Client note</span><span>{String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</span></div>
          <blockquote className={active.quote.length > 260 ? "is-long" : undefined}>“{active.quote}”</blockquote>
          <figcaption>
            <div className="testimonial-avatar">
              {active.photo ? <Image src={active.photo.secureUrl} alt={active.photo.altText || `${active.authorName} portrait`} fill sizes="64px" /> : <span>{initials}</span>}
            </div>
            <div><strong>{active.authorName}</strong><span>{active.authorRole}{active.client ? ` · ${active.client.name}` : ""}</span></div>
            {active.project && <Link href={`/projects/${active.project.slug}`}>View project <DiagonalArrow /></Link>}
          </figcaption>
        </figure>
      </div>

      <div className="testimonial-deck-controls">
        <div className="testimonial-progress" aria-label={`Testimonial ${activeIndex + 1} of ${testimonials.length}`}>
          {testimonials.map((testimonial, index) => <button key={testimonial.id} type="button" className={index === activeIndex ? "is-active" : ""} aria-label={`Show testimonial ${index + 1} from ${testimonial.authorName}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => show(index, index > activeIndex ? "next" : "previous")}><span /></button>)}
        </div>
        {testimonials.length > 1 && <div className="testimonial-arrows">
          <button type="button" aria-label="Previous testimonial" onClick={() => show(activeIndex - 1, "previous")}><DeckArrow direction="previous" /><span>Previous</span></button>
          <button type="button" aria-label="Next testimonial" onClick={() => show(activeIndex + 1, "next")}><span>Next</span><DeckArrow direction="next" /></button>
        </div>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const DISPLAY_TIME_MS = 5500;
const EXIT_TIME_MS = 350;

export function ContactNotification({ message }: { message: string }) {
  const [phase, setPhase] = useState<"visible" | "leaving" | "hidden">("visible");

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setPhase("leaving"), DISPLAY_TIME_MS);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), DISPLAY_TIME_MS + EXIT_TIME_MS);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <aside className={`contact-toast contact-toast-${phase}`} aria-atomic="true" aria-live="polite" onAnimationEnd={(event) => {
      if (phase === "leaving" && event.currentTarget === event.target) setPhase("hidden");
    }} role="status">
      <div className="contact-toast-icon" aria-hidden="true">✓</div>
      <div className="contact-toast-copy">
        <strong>Enquiry received</strong>
        <p>{message}</p>
      </div>
      <button aria-label="Dismiss notification" onClick={() => setPhase("leaving")} type="button">×</button>
      <span className="contact-toast-progress" aria-hidden="true" />
    </aside>
  );
}

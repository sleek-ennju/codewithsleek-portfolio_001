"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const DISPLAY_TIME_MS = 5500;
const EXIT_TIME_MS = 350;

export function ContactNotification({
  message,
  tone,
}: {
  message: string;
  tone: "success" | "error";
}) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"visible" | "leaving" | "hidden">("visible");

  useEffect(() => {
    const mountFrame = window.requestAnimationFrame(() => setMounted(true));
    const leaveTimer = window.setTimeout(() => setPhase("leaving"), DISPLAY_TIME_MS);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), DISPLAY_TIME_MS + EXIT_TIME_MS);
    return () => {
      window.cancelAnimationFrame(mountFrame);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!mounted || phase === "hidden") return null;

  return createPortal(
    <aside
      className={`contact-toast contact-toast-${tone} contact-toast-${phase}`}
      aria-atomic="true"
      onAnimationEnd={(event) => {
        if (phase === "leaving" && event.currentTarget === event.target) setPhase("hidden");
      }}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="contact-toast-icon" aria-hidden="true">
        {tone === "success" ? "✓" : "!"}
      </div>
      <div className="contact-toast-copy">
        <strong>{tone === "success" ? "Enquiry received" : "Couldn’t send enquiry"}</strong>
        <p>{message}</p>
      </div>
      <button aria-label="Dismiss notification" onClick={() => setPhase("leaving")} type="button">
        ×
      </button>
      <span className="contact-toast-progress" aria-hidden="true" />
    </aside>,
    document.body,
  );
}

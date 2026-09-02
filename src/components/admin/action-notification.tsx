"use client";

import { useEffect, useState } from "react";

const DISPLAY_TIME_MS = 5_500;
const EXIT_TIME_MS = 280;

export function ActionNotification({
  message,
  tone,
  title,
}: {
  message: string;
  tone: "success" | "error";
  title: string;
}) {
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
    <aside
      className={`admin-action-notification admin-action-notification-${tone} admin-action-notification-${phase}`}
      role={tone === "error" ? "alert" : "status"}
      aria-atomic="true"
      onAnimationEnd={(event) => {
        if (phase === "leaving" && event.currentTarget === event.target) setPhase("hidden");
      }}
    >
      <span aria-hidden="true">{tone === "success" ? "✓" : "!"}</span>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <button aria-label="Dismiss notification" onClick={() => setPhase("leaving")} type="button">
        ×
      </button>
      <i aria-hidden="true" />
    </aside>
  );
}

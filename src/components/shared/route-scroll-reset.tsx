"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Shared layouts survive App Router transitions, so explicitly reset the document
 * on pathname changes. Hash destinations keep their intentional anchor position.
 */
export function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/** Native snapshots preserve the outgoing page while the next route renders. */
export function PageSweep() {
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    if (!pending.current) return;
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const frame = requestAnimationFrame(() => pending.current?.());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    let active: ViewTransition | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    function click(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      const link =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (
        !link ||
        link.download ||
        (link.target && link.target !== "_self") ||
        link.closest(".mobile-menu-scene")
      )
        return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (!/^\/(?:projects(?:\/[^/]+)?|privacy|resume)?\/?$/.test(url.pathname)) return;

      event.preventDefault();
      event.stopPropagation();
      if (active) return;
      const returning =
        url.pathname === "/" ||
        (location.pathname.startsWith("/projects/") && url.pathname === "/projects");
      document.documentElement.dataset.pageSweep = returning ? "back" : "forward";
      active = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pending.current = () => {
              clearTimeout(timeout);
              pending.current = null;
              resolve();
            };
            // A stalled request must never leave the interface locked behind a snapshot.
            timeout = setTimeout(() => {
              active?.skipTransition();
              pending.current?.();
            }, 5000);
            router.push(`${url.pathname}${url.search}${url.hash}`);
          }),
      );
      void active.finished
        .catch(() => {})
        .finally(() => {
          active = undefined;
          delete document.documentElement.dataset.pageSweep;
        });
    }
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("click", click, true);
      active?.skipTransition();
      pending.current?.();
      clearTimeout(timeout);
      delete document.documentElement.dataset.pageSweep;
    };
  }, [router]);
  return null;
}

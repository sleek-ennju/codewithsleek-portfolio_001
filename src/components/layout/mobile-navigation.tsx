"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiagonalArrow } from "@/components/shared/diagonal-arrow";

type NavigationItem = { label: string; href: string };

export function MobileNavigation({
  items,
  bookingUrl,
}: {
  items: readonly NavigationItem[];
  bookingUrl: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openedWithKeyboardRef = useRef(false);
  const visible = phase !== "closed";
  const expanded = phase === "opening" || phase === "open";

  const requestClose = useCallback(
    (restoreFocus = false, afterClose?: () => void) => {
      if (phase === "closing" || phase === "closed") return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPhase("closing");
      window.setTimeout(
        () => {
          setPhase("closed");
          if (restoreFocus) triggerRef.current?.focus();
          afterClose?.();
        },
        reducedMotion ? 0 : 650,
      );
    },
    [phase],
  );

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focusTimer =
      phase === "opening"
        ? window.setTimeout(
            () => {
              if (openedWithKeyboardRef.current) {
                dialogRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
              } else {
                dialogRef.current?.focus({ preventScroll: true });
              }
              setPhase("open");
            },
            reducedMotion ? 0 : 1050,
          )
        : undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestClose(true);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>("a, button:not([disabled])"),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (focusTimer) window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, requestClose, visible]);

  function openMenu(event: React.MouseEvent<HTMLButtonElement>) {
    if (visible) requestClose(true);
    else {
      // Pointer-triggered dialogs focus the scene without visually selecting the first link.
      // Keyboard-triggered dialogs retain the expected visible focus on the first destination.
      openedWithKeyboardRef.current = event.detail === 0;
      setPhase("opening");
    }
  }

  function followInternalLink(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    requestClose(false, () => router.push(href));
  }

  return (
    <div className={`mobile-menu ${visible ? "is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="mobile-menu-trigger"
        type="button"
        aria-expanded={expanded}
        aria-controls="mobile-navigation-scene"
        onClick={openMenu}
      >
        <span>{visible ? "Close" : "Menu"}</span>
        <i aria-hidden="true">
          <b />
          <b />
        </i>
      </button>

      {visible &&
        createPortal(
          <div
            ref={dialogRef}
            className={`mobile-menu-scene is-open is-${phase}`}
            id="mobile-navigation-scene"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            tabIndex={-1}
          >
            <div className="mobile-menu-rail" aria-hidden="true">
              <span>CODE / WITH / SLEEK</span>
              <b>Navigation</b>
            </div>
            <div className="mobile-menu-panel">
              <button
                className="mobile-menu-close"
                type="button"
                aria-label="Close navigation"
                onClick={() => requestClose(true)}
              >
                <span>Close</span>
                <i aria-hidden="true">×</i>
              </button>
              <div className="mobile-menu-intro">
                <span>Explore</span>
                <small>{String(items.length).padStart(2, "0")} destinations</small>
              </div>
              <nav aria-label="Mobile navigation">
                <ol>
                  {items.map((item, index) => (
                    <li key={item.href} style={{ "--menu-index": index } as React.CSSProperties}>
                      <Link
                        href={item.href}
                        onClick={(event) => followInternalLink(event, item.href)}
                        tabIndex={expanded ? 0 : -1}
                      >
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        <span>{item.label}</span>
                        <i>
                          <DiagonalArrow />
                        </i>
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="mobile-menu-footer">
                <p>Have a product in mind?</p>
                <Link
                  href={bookingUrl || "/#contact"}
                  onClick={
                    bookingUrl
                      ? () => requestClose()
                      : (event) => followInternalLink(event, "/#contact")
                  }
                  tabIndex={expanded ? 0 : -1}
                  target={bookingUrl ? "_blank" : undefined}
                >
                  Start a conversation <DiagonalArrow />
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

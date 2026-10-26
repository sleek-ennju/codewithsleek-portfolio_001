"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { endAdminSession } from "@/features/auth/actions";

type AdminNavigationItem = {
  href: string;
  label: string;
  short: string;
};

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      <span>{pending ? "Signing out…" : "Sign out"}</span>
      <i aria-hidden="true">↗</i>
    </button>
  );
}

export function AdminMobileNavigation({
  adminName,
  items,
}: {
  adminName: string;
  items: readonly AdminNavigationItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openedWithKeyboardRef = useRef(false);
  const visible = phase !== "closed";
  const expanded = phase === "opening" || phase === "open";

  const requestClose = useCallback(
    (restoreFocus = false, afterClose?: () => void) => {
      if (phase === "closed" || phase === "closing") return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPhase("closing");
      window.setTimeout(
        () => {
          setPhase("closed");
          if (restoreFocus) triggerRef.current?.focus();
          afterClose?.();
        },
        reducedMotion ? 0 : 560,
      );
    },
    [phase],
  );

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    const workspace = document.querySelector<HTMLElement>(".admin-main");
    const previousAriaHidden = workspace?.getAttribute("aria-hidden") ?? null;
    const wasInert = workspace?.hasAttribute("inert") ?? false;
    document.body.style.overflow = "hidden";
    workspace?.setAttribute("aria-hidden", "true");
    workspace?.setAttribute("inert", "");

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
            reducedMotion ? 0 : 760,
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
      if (workspace) {
        if (previousAriaHidden === null) workspace.removeAttribute("aria-hidden");
        else workspace.setAttribute("aria-hidden", previousAriaHidden);
        if (!wasInert) workspace.removeAttribute("inert");
      }
      if (focusTimer) window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, requestClose, visible]);

  function toggleMenu(event: React.MouseEvent<HTMLButtonElement>) {
    if (visible) {
      requestClose(true);
      return;
    }

    openedWithKeyboardRef.current = event.detail === 0;
    setPhase("opening");
  }

  function followAdminLink(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    if (href === pathname) {
      requestClose(true);
      return;
    }
    requestClose(false, () => router.push(href));
  }

  return (
    <div className={`admin-mobile-navigation ${visible ? "is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="admin-mobile-trigger"
        type="button"
        aria-expanded={expanded}
        aria-controls="admin-mobile-navigation-scene"
        onClick={toggleMenu}
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
            className={`admin-mobile-scene is-${phase}`}
            id="admin-mobile-navigation-scene"
            role="dialog"
            aria-modal="true"
            aria-label="Administration navigation"
            tabIndex={-1}
          >
            <div className="admin-mobile-rail" aria-hidden="true">
              <span>CODE / WITH / SLEEK</span>
              <b>Admin</b>
            </div>

            <div className="admin-mobile-panel">
              <button
                className="admin-mobile-close"
                type="button"
                aria-label="Close administration navigation"
                onClick={() => requestClose(true)}
              >
                <span>Close</span>
                <i aria-hidden="true">×</i>
              </button>

              <div className="admin-mobile-intro">
                <span>Control room</span>
                <small>{String(items.length).padStart(2, "0")} destinations</small>
              </div>

              <nav aria-label="Mobile administration">
                <ol>
                  {items.map((item, index) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <li
                        key={item.href}
                        style={{ "--admin-menu-index": index } as React.CSSProperties}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={(event) => followAdminLink(event, item.href)}
                          tabIndex={expanded ? 0 : -1}
                        >
                          <small>{String(index + 1).padStart(2, "0")}</small>
                          <span>{item.label}</span>
                          <em>{item.short}</em>
                          <i aria-hidden="true">
                            <DiagonalArrow />
                          </i>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <footer className="admin-mobile-footer">
                <div>
                  <small>Signed in as</small>
                  <strong>{adminName}</strong>
                </div>
                <div className="admin-mobile-footer-actions">
                  <Link href="/" target="_blank" tabIndex={expanded ? 0 : -1}>
                    Live site <DiagonalArrow />
                  </Link>
                  <form action={endAdminSession}>
                    <SignOutButton />
                  </form>
                </div>
              </footer>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

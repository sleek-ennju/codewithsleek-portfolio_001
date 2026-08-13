"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type NavigationItem = { label: string; href: string };

export function MobileNavigation({ items, bookingUrl }: { items: readonly NavigationItem[]; bookingUrl: string }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstLink = dialogRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])')];
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
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div className={`mobile-menu ${open ? "is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="mobile-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation-scene"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{open ? "Close" : "Menu"}</span>
        <i aria-hidden="true"><b /><b /></i>
      </button>

      {open && createPortal(<div
        ref={dialogRef}
        className="mobile-menu-scene is-open"
        id="mobile-navigation-scene"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <button className="mobile-menu-close" type="button" aria-label="Close navigation" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}><span>Close</span><i aria-hidden="true">×</i></button>
        <div className="mobile-menu-rail" aria-hidden="true"><span>CODE / WITH / SLEEK</span><b>Navigation</b></div>
        <div className="mobile-menu-panel">
          <div className="mobile-menu-intro"><span>Explore</span><small>{String(items.length).padStart(2, "0")} destinations</small></div>
          <nav aria-label="Mobile navigation">
            <ol>
              {items.map((item, index) => (
                <li key={item.href} style={{ "--menu-index": index } as React.CSSProperties}>
                  <Link href={item.href} onClick={close} tabIndex={open ? 0 : -1}>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>{item.label}</span>
                    <i aria-hidden="true">↗</i>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mobile-menu-footer">
            <p>Have a product in mind?</p>
            <Link href={bookingUrl || "/#contact"} onClick={close} tabIndex={open ? 0 : -1} target={bookingUrl ? "_blank" : undefined}>Start a conversation <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>, document.body)}
    </div>
  );
}

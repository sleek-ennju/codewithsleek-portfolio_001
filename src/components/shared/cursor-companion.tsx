"use client";

import { useEffect, useRef } from "react";

export function CursorCompanion() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!dot) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let dotX = pointerX;
    let dotY = pointerY;
    let frame = 0;

    const render = () => {
      const followSpeed = reducedMotion.matches ? 1 : 0.16;
      dotX += (pointerX - dotX) * followSpeed;
      dotY += (pointerY - dotY) * followSpeed;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        dot.dataset.visible = "false";
        return;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.dataset.visible = "true";
      dot.dataset.interactive =
        event.target instanceof Element &&
        Boolean(event.target.closest("a, button, [role='button']"))
          ? "true"
          : "false";
    };
    const handleLeave = () => {
      dot.dataset.visible = "false";
    };
    const handleDown = () => {
      dot.dataset.pressed = "true";
    };
    const handleUp = () => {
      dot.dataset.pressed = "false";
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  return <div ref={dotRef} className="cursor-companion" aria-hidden="true" />;
}

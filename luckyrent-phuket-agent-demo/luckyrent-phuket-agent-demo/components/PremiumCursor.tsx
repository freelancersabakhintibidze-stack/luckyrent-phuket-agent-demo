"use client";

import { useEffect, useRef } from "react";

/**
 * PremiumCursor (Section 5). No dependencies.
 * - default: small gold dot on the pointer + thin gold ring trailing with soft glow
 * - over links/buttons: ring grows translucent, dot hides
 * - on click: ring presses in
 * - over disabled controls: dim dashed ring
 * - over text fields: custom cursor hides, native text cursor shows (CSS)
 * - touch devices: not activated at all (native cursor stays)
 * - prefers-reduced-motion: ring follows the pointer instantly, no trailing
 */
export default function PremiumCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return; // touch: keep native cursor, show nothing

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = reduceMq.matches;
    const onReduceChange = (e: MediaQueryListEvent) => {
      reduce = e.matches;
    };
    reduceMq.addEventListener("change", onReduceChange);

    document.documentElement.classList.add("cursor-on");
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    let px = -100;
    let py = -100;
    let rx = -100;
    let ry = -100;
    let visible = false;
    let raf = 0;

    const INTERACTIVE = "a, button, [role='button'], .chip, summary, label[for]";
    const TEXTUAL = "input, textarea, select, [contenteditable='true']";

    const setClasses = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      root.classList.remove("state-hover", "state-disabled", "state-text");
      if (!el) return;
      if (el.closest(TEXTUAL)) {
        root.classList.add("state-text");
        return;
      }
      const control = el.closest<HTMLElement>(INTERACTIVE);
      if (!control) return;
      const disabled =
        control.hasAttribute("disabled") || control.getAttribute("aria-disabled") === "true";
      root.classList.add(disabled ? "state-disabled" : "state-hover");
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (reduce) {
        rx = px;
        ry = py;
      }
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
        rx = px;
        ry = py;
      }
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      setClasses(e.target);
    };

    const onDown = () => root.classList.add("state-press");
    const onUp = () => root.classList.remove("state-press");
    const onLeave = () => {
      visible = false;
      root.style.opacity = "0";
    };

    const loop = () => {
      // quiet trailing: exponential ease toward the pointer
      rx += (px - rx) * (reduce ? 1 : 0.19);
      ry += (py - ry) * (reduce ? 1 : 0.19);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    root.style.opacity = "0";
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      reduceMq.removeEventListener("change", onReduceChange);
      document.documentElement.classList.remove("cursor-on");
    };
  }, []);

  return (
    <div className="premium-cursor" ref={rootRef} aria-hidden="true">
      <div className="pc-ring" ref={ringRef} />
      <div className="pc-dot" ref={dotRef} />
    </div>
  );
}

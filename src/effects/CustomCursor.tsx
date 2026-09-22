import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { InteractionState } from "../hooks/useInteraction";

interface Props {
  enabled: boolean;
  interaction: RefObject<InteractionState>;
}

export function CustomCursor({ enabled, interaction }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    const tip = pointer.current;
    const glow = halo.current;
    const caption = label.current;
    if (!enabled || !element || !tip || !glow || !caption) return;
    const desktop = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const contrast = matchMedia("(forced-colors: active)");
    let visible = false;
    let pressed = false;
    let frame = 0;
    let previous = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let currentTarget: Element | null = null;
    let clickAnimation: Animation | undefined;
    const allowed = () => desktop.matches && !reduced.matches && !contrast.matches;

    const hide = () => {
      visible = false;
      pressed = false;
      element.dataset.visible = "false";
      element.dataset.pressed = "false";
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      clickAnimation?.cancel();
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible) return;
      const dt = Math.min((now - (previous || now - 16)) / 1000, 0.05);
      previous = now;
      const follow = 1 - Math.exp(-20 * dt);
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      // Only the light trails. The arrow always points at the real hit target.
      const speed = Math.min(interaction.current.cursor.speed / 3500, 1);
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 + speed * 0.12})`;
      if (Math.hypot(targetX - x, targetY - y) > 0.1 || speed > 0.01) {
        frame = requestAnimationFrame(tick);
      } else {
        glow.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        previous = 0;
      }
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const describeTarget = (target: Element | null) => {
      const native = target?.closest("input,textarea,select,[contenteditable]:not([contenteditable='false']),[aria-disabled='true'],:disabled,.unavailable,iframe");
      if (native) return false;
      const control = target?.closest("a[href],button,[role='button'],summary");
      const anchor = control instanceof HTMLAnchorElement ? control : null;
      const text = anchor?.hostname === "github.com" ? "CODE"
        : anchor?.closest(".project-card") ? "VIEW"
        : anchor && anchor.origin !== location.origin ? "OPEN" : "";
      element.dataset.kind = control ? "interactive" : "default";
      caption.textContent = text;
      return true;
    };
    const position = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !allowed() || document.hidden) {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      currentTarget = event.target instanceof Element ? event.target : null;
      if (!describeTarget(currentTarget)) {
        hide();
        return;
      }
      tip.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      tip.dataset.flip = targetX > innerWidth - 85 ? "true" : "false";
      if (!visible) {
        x = targetX;
        y = targetY;
        glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        visible = true;
        element.dataset.visible = "true";
        document.documentElement.classList.add("has-custom-cursor");
      }
      wake();
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      position(event);
      if (!visible) return;
      pressed = true;
      element.dataset.pressed = "true";
      clickAnimation?.cancel();
      const ring = tip.querySelector(".cursor-click-ring");
      clickAnimation = ring?.animate([
        { opacity: 0.65, transform: "translate(-50%, -50%) scale(0.5)" },
        { opacity: 0, transform: "translate(-50%, -50%) scale(2.2)" },
      ], { duration: 400, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
    };
    const up = () => {
      pressed = false;
      element.dataset.pressed = "false";
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") hide();
    };
    const scroll = () => {
      if (!visible || pressed) return;
      currentTarget = document.elementFromPoint(targetX, targetY);
      if (!describeTarget(currentTarget)) hide();
    };
    const visibility = () => { if (document.hidden) hide(); };
    const preference = () => { if (!allowed()) hide(); };
    window.addEventListener("pointermove", position, { passive: true });
    window.addEventListener("pointerover", position, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", scroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", visibility);
    [desktop, reduced, contrast].forEach((query) => query.addEventListener("change", preference));
    return () => {
      hide();
      window.removeEventListener("pointermove", position);
      window.removeEventListener("pointerover", position);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", scroll);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", visibility);
      [desktop, reduced, contrast].forEach((query) => query.removeEventListener("change", preference));
    };
  }, [enabled, interaction]);

  return (
    <div ref={root} className="custom-cursor" data-visible="false" aria-hidden="true">
      <div ref={halo} className="cursor-halo"><div className="cursor-halo-light" /></div>
      <div ref={pointer} className="cursor-pointer">
        <span className="cursor-click-ring" />
        <svg className="cursor-arrow" width="17" height="19" viewBox="0 0 27 30" fill="none">
          <path d="M5.2 2.4C3.1 1.6 1.5 3.2 2.2 5.4L8.1 25.2C8.7 27.2 11 27.3 11.7 25.3L15 16.3L23.5 13C25.6 12.2 25.5 9.9 23.4 9.2L5.2 2.4Z" fill="#a9adbd" fillOpacity="0.07" stroke="#b0b3c0" strokeOpacity="0.78" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
        <span ref={label} className="cursor-label" />
      </div>
    </div>
  );
}

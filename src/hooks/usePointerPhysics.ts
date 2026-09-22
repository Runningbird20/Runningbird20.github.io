import { useEffect } from "react";
import { advanceSpring, hoverPosition } from "../lib/cursorPhysics";

interface Target {
  element: HTMLElement;
  type: "magnet" | "art";
  box: DOMRect;
  x: { position: number; velocity: number };
  y: { position: number; velocity: number };
  targetX: number;
  targetY: number;
}

// Keep movement small enough that the visual target and its hit area stay aligned.
export function usePointerPhysics(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const desktop = matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const contrast = matchMedia("(forced-colors: active)");
    const targets = new Map<HTMLElement, Target>();
    let active: Target | undefined;
    let frame = 0;
    let previous = 0;
    let dragging = false;
    const allowed = () => desktop.matches && !reduce.matches && !contrast.matches && !document.hidden;
    const properties = ["--pointer-x", "--pointer-y", "--pointer-rx", "--pointer-ry", "--pointer-light-x", "--pointer-light-y"];
    const clear = (target: Target) => {
      properties.forEach((property) => target.element.style.removeProperty(property));
      delete target.element.dataset.physicsActive;
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      active = undefined;
      dragging = false;
      targets.forEach(clear);
      targets.clear();
    };
    const tick = (now: number) => {
      frame = 0;
      if (!allowed()) { reset(); return; }
      const dt = Math.min((now - (previous || now - 16)) / 1000, 0.05);
      previous = now;
      let unsettled = false;
      targets.forEach((target, element) => {
        if (!element.isConnected) { targets.delete(element); return; }
        target.x = advanceSpring(target.x, target.targetX, dt);
        target.y = advanceSpring(target.y, target.targetY, dt);
        const x = target.x.position;
        const y = target.y.position;
        const strength = target.type === "magnet" ? 5 : 3;
        element.style.setProperty("--pointer-x", `${x * strength}px`);
        element.style.setProperty("--pointer-y", `${y * strength}px`);
        element.style.setProperty("--pointer-rx", `${-y * 3}deg`);
        element.style.setProperty("--pointer-ry", `${x * 3}deg`);
        element.style.setProperty("--pointer-light-x", `${(x + 1) * 50}%`);
        element.style.setProperty("--pointer-light-y", `${(y + 1) * 50}%`);
        const moving = Math.abs(x - target.targetX) + Math.abs(y - target.targetY)
          + Math.abs(target.x.velocity) + Math.abs(target.y.velocity) > 0.002;
        unsettled ||= moving;
        if (!moving && target !== active) { clear(target); targets.delete(element); }
      });
      if (unsettled) frame = requestAnimationFrame(tick);
      else previous = 0;
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const release = () => {
      if (active) {
        active.targetX = active.targetY = 0;
        active = undefined;
        wake();
      }
    };
    const move = (event: PointerEvent) => {
      if (!allowed() || event.pointerType !== "mouse") { reset(); return; }
      if (dragging || event.buttons) { release(); return; }
      const origin = event.target instanceof Element ? event.target : null;
      // Never bend a disabled control or interrupt editable/text-selection flows.
      if (origin?.closest("input,textarea,select,[contenteditable],.unavailable,[aria-disabled='true'],:disabled")) {
        release(); return;
      }
      const element = origin?.closest<HTMLElement>("[data-magnetic],[data-hover-art]");
      if (!element) { release(); return; }
      if (active?.element !== element) {
        release();
        let target = targets.get(element);
        if (!target) {
          target = { element, type: element.hasAttribute("data-magnetic") ? "magnet" : "art",
            box: element.getBoundingClientRect(), x: { position: 0, velocity: 0 }, y: { position: 0, velocity: 0 },
            targetX: 0, targetY: 0 };
          targets.set(element, target);
        } else target.box = element.getBoundingClientRect();
        active = target;
        element.dataset.physicsActive = "true";
      }
      const point = hoverPosition(event.clientX, event.clientY, active.box);
      active.targetX = point.x;
      active.targetY = point.y;
      wake();
    };
    const down = () => { dragging = true; release(); };
    const up = () => { dragging = false; };
    const key = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") reset(); };
    const preference = () => { if (!allowed()) reset(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("resize", reset);
    window.addEventListener("keydown", key);
    document.documentElement.addEventListener("pointerleave", release);
    document.addEventListener("visibilitychange", preference);
    [desktop, reduce, contrast].forEach((query) => query.addEventListener("change", preference));
    return () => {
      reset();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("resize", reset);
      window.removeEventListener("keydown", key);
      document.documentElement.removeEventListener("pointerleave", release);
      document.removeEventListener("visibilitychange", preference);
      [desktop, reduce, contrast].forEach((query) => query.removeEventListener("change", preference));
    };
  }, [enabled]);
}

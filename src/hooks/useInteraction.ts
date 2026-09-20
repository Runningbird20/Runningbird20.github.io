import { useEffect, useRef } from "react";
export interface InteractionState {
  viewport: { width: number; height: number };
  scroll: { y: number; progress: number };
  cursor: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    speed: number;
    state: "default" | "link" | "pressed";
  };
  pointer: { down: boolean; type: string };
  device: {
    coarsePointer: boolean;
    reducedMotion: boolean;
    performanceMode: "full" | "low";
  };
}
export function readCapabilities(): InteractionState["device"] {
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return {
    coarsePointer,
    reducedMotion,
    performanceMode:
      reducedMotion ||
      coarsePointer ||
      connection?.saveData ||
      navigator.hardwareConcurrency <= 4
        ? "low"
        : "full",
  };
}
// Mutable frame state avoids rerendering the React tree on every pointer/scroll event.
export function useInteraction() {
  const state = useRef<InteractionState>({
    viewport: { width: 0, height: 0 },
    scroll: { y: 0, progress: 0 },
    cursor: {
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      speed: 0,
      state: "default",
    },
    pointer: { down: false, type: "mouse" },
    device: readCapabilities(),
  });
  useEffect(() => {
    let frame = 0;
    let lastTime = 0;
    let idle: ReturnType<typeof setTimeout>;
    const update = () => {
      frame = 0;
      state.current.viewport = { width: innerWidth, height: innerHeight };
      const extent = document.documentElement.scrollHeight - innerHeight;
      state.current.scroll = {
        y: scrollY,
        progress: extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0,
      };
      state.current.device = readCapabilities();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const move = (event: PointerEvent) => {
      const cursor = state.current.cursor;
      const dt = Math.max(8, event.timeStamp - lastTime);
      cursor.velocityX = lastTime
        ? ((event.clientX - cursor.x) / dt) * 1000
        : 0;
      cursor.velocityY = lastTime
        ? ((event.clientY - cursor.y) / dt) * 1000
        : 0;
      cursor.speed = Math.hypot(cursor.velocityX, cursor.velocityY);
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      cursor.state = state.current.pointer.down
        ? "pressed"
        : event.target instanceof Element && event.target.closest("a,button")
          ? "link"
          : "default";
      state.current.pointer.type = event.pointerType;
      lastTime = event.timeStamp;
      clearTimeout(idle);
      idle = setTimeout(() => {
        cursor.velocityX = cursor.velocityY = cursor.speed = 0;
        lastTime = 0;
      }, 80);
    };
    const down = () => {
      state.current.pointer.down = true;
      state.current.cursor.state = "pressed";
    };
    const up = () => {
      state.current.pointer.down = false;
      state.current.cursor.state = "default";
    };
    const reset = () => {
      up();
      state.current.cursor.velocityX =
        state.current.cursor.velocityY =
        state.current.cursor.speed =
          0;
      lastTime = 0;
    };
    const queries = [
      matchMedia("(prefers-reduced-motion: reduce)"),
      matchMedia("(pointer: coarse)"),
    ];
    queries.forEach((query) => query.addEventListener("change", schedule));
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    update();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      observer.disconnect();
      queries.forEach((query) => query.removeEventListener("change", schedule));
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);
  return state;
}

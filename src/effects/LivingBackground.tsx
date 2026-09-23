import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { RefObject } from "react";
import type { InteractionState } from "../hooks/useInteraction";
import { particleDisplacement } from "../lib/cursorPhysics";

interface Props {
  interaction: RefObject<InteractionState>;
  introActive: boolean;
}

export function LivingBackground({ interaction, introActive }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const moving = !paused && !reducedMotion && !introActive;

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);

  // Keep scene positions when paused or when the introduction completes.
  const clock = useRef(0);
  const camera = useRef({ x: 0, y: 0, scroll: 0 });
  useEffect(() => {
    const surface = canvas.current;
    const layer = root.current;
    const ctx = surface?.getContext("2d");
    if (!surface || !layer || !ctx) return;
    let width = 1;
    let height = 1;
    let frame = 0;
    let last = 0;
    let pointerPresent = false;
    const low = interaction.current.device.performanceMode === "low";
    const count = low ? 28 : 60;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: ((i * 0.61803398875 + 0.08) % 1),
      y: ((i * 0.38196601125 + (i % 7) * 0.13) % 1),
      depth: 0.3 + (i % 5) * 0.175,
      phase: i * 2.39996,
      magenta: i % 3 === 0,
    }));
    let waves: { x: number; y: number; born: number }[] = [];
    const wrap = (value: number, size: number) => ((value + 60) % (size + 120) + size + 120) % (size + 120) - 60;

    const draw = (dt: number) => {
      const t = clock.current;
      const state = interaction.current;
      const targetX = pointerPresent && !state.device.coarsePointer ? state.cursor.x / width - 0.5 : 0;
      const targetY = pointerPresent && !state.device.coarsePointer ? state.cursor.y / height - 0.5 : 0;
      const blend = moving ? 1 - Math.exp(-dt * 3) : 0;
      camera.current.x += (targetX - camera.current.x) * blend;
      camera.current.y += (targetY - camera.current.y) * blend;
      camera.current.scroll += (state.scroll.progress - camera.current.scroll) * blend;
      const view = camera.current;
      layer.style.setProperty("--ambient-x", `${view.x * 45}px`);
      layer.style.setProperty("--ambient-y", `${view.y * 30}px`);
      layer.style.setProperty("--ambient-drift", `${Math.sin(t * 0.12) * 5 + view.scroll * 18}%`);
      ctx.clearRect(0, 0, width, height);

      // Sparse orbital geometry echoes the entrance without covering the content.
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i % 2 ? "#c779d613" : "#63d6e516";
        ctx.ellipse(width * (0.88 - view.scroll * 0.25) + view.x * 25, height * 0.45,
          width * (0.27 + i * 0.075), height * (0.34 + i * 0.08),
          -0.35 + t * 0.012 + view.scroll * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3D portal tunnel rings expanding outward as camera flies forward into depth
      const ringCount = 4;
      for (let i = 0; i < ringCount; i++) {
        const ringProgress = ((i / ringCount) + view.scroll * 2.8) % 1;
        const ringRadius = ringProgress * (Math.max(width, height) * 0.72) + 20;
        const ringAlpha = Math.sin(ringProgress * Math.PI) * 0.16;
        if (ringAlpha > 0.01) {
          ctx.lineWidth = 1 + ringProgress * 1.4;
          ctx.strokeStyle = i % 2 === 0 ? `rgba(99, 214, 229, ${ringAlpha})` : `rgba(199, 121, 214, ${ringAlpha})`;
          ctx.beginPath();
          ctx.arc(
            width * 0.5 + view.x * 35 * (1 - ringProgress),
            height * 0.5 + view.y * 25 * (1 - ringProgress),
            ringRadius,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }
      const points = particles.map((particle) => {
        let x = wrap(particle.x * width + Math.sin(t * 0.09 + particle.phase) * 22
          + view.x * 38 * particle.depth + view.scroll * 55 * particle.depth, width);
        let y = wrap(particle.y * height - t * (2 + particle.depth * 3)
          + view.y * 28 * particle.depth - view.scroll * 150 * particle.depth, height);
        if (moving && pointerPresent && !state.device.coarsePointer) {
          const dx = state.cursor.x - x;
          const dy = state.cursor.y - y;
          const displacement = particleDisplacement(
            dx,
            dy,
            state.pointer.down,
            state.cursor.speed,
            particle.phase,
          );
          x += displacement.x;
          y += displacement.y;
        }
        return { ...particle, x, y };
      });
      // Limit both connection distance and density to keep the page readable.
      points.forEach((point, i) => {
        let connections = 0;
        for (let j = i + 1; j < points.length && connections < 2; j++) {
          const other = points[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance > 130) continue;
          ctx.globalAlpha = (1 - distance / 130) * 0.18;
          ctx.strokeStyle = point.magenta ? "#c779d6" : "#63d6e5";
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
          connections++;
        }
        ctx.globalAlpha = 0.2 + point.depth * 0.38;
        ctx.fillStyle = point.magenta ? "#c779d6" : "#63d6e5";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 0.7 + point.depth * 1.1, 0, Math.PI * 2);
        ctx.fill();
      });
      waves = waves.filter((wave) => t - wave.born < 1.6);
      waves.forEach((wave) => {
        const age = (t - wave.born) / 1.6;
        ctx.globalAlpha = (1 - age) ** 2 * 0.3;
        ctx.strokeStyle = "#c779d6";
        ctx.beginPath();
        ctx.arc(wave.x * width, wave.y * height, 8 + age * 200, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      frame = 0;
      if (!moving || document.hidden) return;
      if (!last) last = now;
      const elapsed = now - last;
      // A modest frame budget is sufficient for slow ambient movement.
      if (elapsed >= 1000 / (low ? 24 : 30)) {
        const dt = Math.min(elapsed / 1000, 0.08);
        clock.current += dt;
        draw(dt);
        last = now;
      }
      frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = surface.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(devicePixelRatio || 1, low ? 1 : 1.5);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      ctx.setTransform(surface.width / width, 0, 0, surface.height / height, 0, 0);
      draw(0);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (moving && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const move = () => { pointerPresent = true; };
    const leave = () => { pointerPresent = false; };
    const click = (event: PointerEvent) => {
      if (!moving || event.button !== 0 || !(event.target instanceof Element)
        || event.target.closest("a,button,input,textarea,select,[role='button']")) return;
      waves = [...waves.slice(-3), { x: event.clientX / width, y: event.clientY / height, born: clock.current }];
    };
    resize();
    visibility();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("pointerdown", click, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("pointerdown", click);
    };
  }, [interaction, moving]);

  return (
    <>
      <div ref={root} className="living-background" aria-hidden="true">
        <div className="ambient-field ambient-cyan" />
        <div className="ambient-field ambient-magenta" />
        <canvas ref={canvas} className="ambient-particles" />
        <div className="ambient-shade" />
      </div>
      {!introActive && !reducedMotion && (
        <button className="background-toggle" data-magnetic onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Resume background animation" : "Pause background animation"}
          title={paused ? "Resume background animation" : "Pause background animation"}>
          {paused ? <Play size={12} /> : <Pause size={12} />}
          <span>{paused ? "Motion paused" : "Pause motion"}</span>
        </button>
      )}
    </>
  );
}

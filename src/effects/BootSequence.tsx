import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { AccessTitle } from "./AccessTitle";
import { paintPortal, portalTiming } from "./portalScene";
import type { PortalLetter, PortalState } from "./portalScene";
import { animation, rememberIntro } from "../lib/animation";
import type { InteractionState } from "../hooks/useInteraction";
import type { RefObject } from "react";
const lines = [
  "> initializing system...",
  "[OK] establishing secure connection",
  "[OK] loading identity",
  "[OK] loading project archive",
  "[OK] loading experience records",
  "[OK] initializing graphics engine",
  "> authenticating visitor...",
];

interface Props {
  active: boolean;
  onComplete: () => void;
  interaction: RefObject<InteractionState>;
}
export function BootSequence({ active, onComplete, interaction }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLCanvasElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const finish = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    if (!active || !root.current || !surface.current) return;
    const element = root.current;
    const canvas = surface.current;
    const ctx = canvas.getContext("2d");
    let complete = false;
    let timeline: gsap.core.Timeline;
    const done = () => {
      if (complete) return;
      complete = true;
      timeline?.kill();
      rememberIntro();
      onComplete();
    };
    finish.current = done;
    if (!ctx) {
      const frame = requestAnimationFrame(done);
      return () => cancelAnimationFrame(frame);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    const scene: PortalState = { time: -1, opening: 0, travel: 0 };
    let letters: PortalLetter[] = [];
    let width = 0;
    let height = 0;
    const draw = () => paintPortal(ctx, width, height, scene, letters);
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) return;
      width = box.width;
      height = box.height;
      const maxRatio = interaction.current.device.performanceMode === "low" ? 1 : 1.5;
      const ratio = Math.min(window.devicePixelRatio || 1, maxRatio);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      draw();
    };
    // Paint the initial opaque frame before the browser can display the page.
    resize();
    const context = gsap.context(() => {
      timeline = gsap.timeline({
        onComplete: done,
        onUpdate: () => {
          if (scene.time >= 0) draw();
        },
      });
      timeline.fromTo(
        ".terminal-label",
        { opacity: 0.88 },
        { opacity: 1, duration: 0.16, repeat: 1, yoyo: true },
        0.4,
      );
      let position = 0.2;
      const terminalLines = Array.from(
        element.querySelectorAll<HTMLElement>(".boot-line"),
      );
      terminalLines.forEach((line) => {
        const cursor = line.querySelector(".boot-cursor");
        if (cursor) timeline.set(cursor, { display: "inline-block" }, position);
        line.querySelectorAll(".boot-character").forEach((character) => {
          position +=
            animation.characterMin +
            Math.random() * (animation.characterMax - animation.characterMin);
          timeline.set(character, { display: "inline" }, position);
        });
        // The command has been submitted: hide its caret before output/loading.
        if (cursor) timeline.set(cursor, { display: "none" }, position);
        position += animation.linePause;
      });
      const clearAt = position + animation.authenticationPause;
      const accessAt = clearAt + 0.28;
      const glitchAt = accessAt + animation.readableHold;
      const portalAt = accessAt + animation.portalDelay;
      const finishAt = portalAt + animation.transitionDuration;
      timeline.set(".boot-cursor", { display: "none" }, accessAt);
      timeline.to(".terminal-panel", { opacity: 0, duration: 0.22 }, clearAt);
      timeline.to(".access-stage", { opacity: 1, duration: 0.08 }, accessAt);
      timeline.set(".access-echo, .access-fragments", { opacity: 1 }, glitchAt);
      timeline.set(".access-title", { filter: "drop-shadow(3px 0 #63d6e5) drop-shadow(-3px 0 #c779d6)" }, glitchAt);
      timeline.to(
        ".access-glyph",
        {
          x: (i) => (i % 2 ? 7 : -7),
          y: (i) => ((i % 3) - 1) * 5,
          scaleY: (i) => (i % 2 ? 1.16 : 0.84),
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "steps(1)",
        },
        glitchAt + 0.05,
      );
      timeline.fromTo(
        ".echo-cyan",
        { x: -13, y: 3 },
        {
          x: 16,
          y: -3,
          duration: 0.13,
          repeat: 5,
          yoyo: true,
          ease: "steps(1)",
        },
        glitchAt,
      );
      timeline.fromTo(
        ".echo-magenta",
        { x: 12, y: -4 },
        {
          x: -18,
          y: 5,
          duration: 0.17,
          repeat: 4,
          yoyo: true,
          ease: "steps(1)",
        },
        glitchAt,
      );
      timeline.fromTo(
        ".access-fragments i",
        { scaleX: 1, x: -12 },
        {
          scaleX: 3,
          x: 25,
          duration: 0.16,
          stagger: 0.025,
          repeat: 2,
          yoyo: true,
          ease: "steps(1)",
        },
        glitchAt + 0.02,
      );
      timeline.set(".access-glyph", { x: 0, y: 0, scale: 1 }, portalAt);
      timeline.call(() => {
        // Read geometry once at the handover; animation frames only draw pixels.
        letters = Array.from(element.querySelectorAll<HTMLElement>(".access-glyph")).map((glyph) => {
          const box = glyph.getBoundingClientRect();
          return {
            x: (box.left + box.width / 2) / width,
            y: (box.top + box.height / 2) / height,
            width: box.width / width,
            height: box.height / height,
            pixels: Array.from(glyph.querySelectorAll("rect")).map((pixel) => ({
              x: Number(pixel.getAttribute("x")),
              y: Number(pixel.getAttribute("y")),
            })),
          };
        });
      }, [], portalAt);
      timeline.set(".access-stage, .terminal-panel", { visibility: "hidden" }, portalAt);
      timeline.fromTo(scene, { time: 0 }, {
        time: animation.transitionDuration,
        duration: animation.transitionDuration,
        ease: "none",
        immediateRender: false,
      }, portalAt);
      const open = (opening: number, duration: number, at: number) => {
        timeline.to(scene, { opening, duration, ease: "sine.inOut" }, portalAt + at);
      };
      const openAt = portalTiming.openAt;
      open(1, 1, openAt);
      open(0.92, 0.35, openAt + 1);
      open(1.035, 0.35, openAt + 1.35);
      open(1, 0.3, openAt + 1.7);
      timeline.to(scene, { travel: 1, duration: 1.25, ease: "power3.in" }, portalAt + openAt + 2);
      timeline.to(".boot-skip", { opacity: 0, duration: 0.2 }, finishAt - 0.35);
    }, element);
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        done();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        skip.current?.focus();
      }
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => {
      if (reduce.matches) done();
    };
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    reduce.addEventListener("change", preference);
    return () => {
      context.revert();
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      reduce.removeEventListener("change", preference);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, onComplete, interaction]);
  if (!active) return null;
  return (
    <div ref={root} className="boot-sequence">
      <canvas ref={surface} className="portal-surface" aria-hidden="true" />
      <div className="boot-interface" role="dialog" aria-modal="true" aria-label="Portfolio introduction">
          <div className="terminal-panel">
            <p className="terminal-label">
              PORTFOLIO / SYSTEM INITIALIZATION <span>01</span>
            </p>
            <div className="boot-status" aria-hidden="true">
              {lines.map((line) => (
                <p className="boot-line" key={line}>
                  {Array.from(line).map((character, index) => (
                    <span
                      className={`boot-character${line.startsWith("[OK]") && index < 4 ? " boot-ok" : ""}`}
                      key={index}
                    >
                      {character}
                    </span>
                  ))}
                  {line.startsWith(">") && <span className="boot-cursor" />}
                </p>
              ))}
            </div>
            <p className="terminal-caption">
              An introduction, not a login. No credentials required.
            </p>
          </div>
        <AccessTitle />
        <p className="sr-only" role="status">
          Opening portfolio. Press Escape or use Skip Intro to continue immediately.
        </p>
        <button ref={skip} className="boot-skip" onClick={() => finish.current()}>
          SKIP INTRO <span>ESC ↗</span>
        </button>
      </div>
    </div>
  );
}

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { AccessTitle } from "./AccessTitle";
import { animation, rememberIntro } from "../lib/animation";
import type { InteractionState } from "../hooks/useInteraction";
import type { CSSProperties, RefObject } from "react";
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
  const skip = useRef<HTMLButtonElement>(null);
  const finish = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    if (!active || !root.current) return;
    const element = root.current;
    let complete = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    const particles = Array.from(
      element.querySelectorAll<HTMLElement>(".boot-particle"),
    );
    const low = interaction.current.device.performanceMode === "low";
    const count = low ? 24 : particles.length;
    let timeline: gsap.core.Timeline;
    const done = () => {
      if (complete) return;
      complete = true;
      timeline?.kill();
      rememberIntro();
      onComplete();
    };
    finish.current = done;
    const context = gsap.context(() => {
      timeline = gsap.timeline({ onComplete: done });
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
      const burstAt = accessAt + animation.burstDelay;
      const finishAt = burstAt + animation.transitionDuration;
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
      timeline.to(
        ".access-stage",
        { opacity: 0, scale: 1.15, duration: 0.22 },
        burstAt,
      );
      // Seed actual terminal characters at their measured text positions.
      const sources = Array.from(
        element.querySelectorAll<HTMLElement>(".boot-line, .access-glyph"),
      );
      particles.forEach((particle, i) => {
        if (i >= count) {
          gsap.set(particle, { display: "none" });
          return;
        }
        const source = sources[i % sources.length];
        const box = source.getBoundingClientRect();
        const text = source.dataset.character || source.textContent || "01";
        particle.textContent = text[(i * 7) % text.length].trim() || "·";
        gsap.set(particle, {
          x: box.left + box.width * ((i % 7) / 7),
          y: box.top,
          opacity: 0,
        });
        const angle = i * 2.39996;
        const color = ["#a6e3c5", "#b6a0ff", "#80caff", "#f2c18c"][i % 4];
        timeline.to(
          particle,
          {
            opacity: 0.85,
            color,
            x: innerWidth / 2 + Math.cos(angle) * innerWidth * 0.58,
            y: innerHeight / 2 + Math.sin(angle) * innerHeight * 0.55,
            rotation: i % 2 ? 70 : -70,
            duration: 0.48,
            ease: "power2.out",
          },
          burstAt,
        );
        timeline.to(
          particle,
          {
            x: `${55 + ((i * 17) % 42)}vw`,
            y: `${110 + ((i * 43) % 390)}px`,
            rotation: 0,
            scale: 0.6,
            opacity: 0.22,
            duration: 0.62,
            ease: animation.ease,
          },
          burstAt + 0.48,
        );
      });
      timeline.to(
        ".terminal-panel",
        { opacity: 0, scale: 1.035, duration: 0.22 },
        burstAt,
      );
      timeline.to(".boot-backdrop", { opacity: 0, duration: 0.7 }, burstAt);
      timeline.to(".boot-skip", { opacity: 0, duration: 0.2 }, finishAt - 0.35);
      timeline.call(() => {}, [], finishAt);
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
    const resize = () => done(); // Finish cleanly instead of using stale particle geometry.
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    reduce.addEventListener("change", preference);
    const watchdog = setTimeout(done, (timeline!.duration() + 1.5) * 1000);
    return () => {
      clearTimeout(watchdog);
      context.revert();
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      reduce.removeEventListener("change", preference);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, onComplete, interaction]);
  return (
    <div
      ref={root}
      className={`boot-sequence ${active ? "boot-active" : "boot-settled"}`}
    >
      {active && (
        <div
          className="boot-interface"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio introduction"
        >
          <div className="boot-backdrop" />
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
            Opening portfolio. Press Escape or use Skip Intro to continue
            immediately.
          </p>
          <button
            ref={skip}
            className="boot-skip"
            onClick={() => finish.current()}
          >
            SKIP INTRO <span>ESC ↗</span>
          </button>
        </div>
      )}
      <div className="boot-particles" aria-hidden="true">
        {Array.from({ length: 56 }, (_, i) => (
          <span
            className="boot-particle"
            key={i}
            style={
              {
                "--particle-x": `${55 + ((i * 17) % 42)}%`,
                "--particle-y": `${110 + ((i * 43) % 390)}px`,
                "--particle-color": [
                  "#a6e3c5",
                  "#b6a0ff",
                  "#80caff",
                  "#f2c18c",
                ][i % 4],
              } as CSSProperties
            }
          >
            ·
          </span>
        ))}
      </div>
    </div>
  );
}

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Compass } from "lucide-react";

export interface JourneyStage {
  id: string;
  label: string;
  sectorCode: string;
  content: ReactNode;
  horizontalSpan?: number;
}

interface StageMetric {
  stage: JourneyStage;
  entryU: number;
  exitU: number;
  horizontalSpan: number;
}

function computeStageMetrics(stages: JourneyStage[]): {
  list: StageMetric[];
  totalU: number;
} {
  let currentU = 0;
  const list: StageMetric[] = [];
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const entryU = i === 0 ? 0 : currentU + 1;
    const span = Math.max(0, stage.horizontalSpan ?? 0);
    const exitU = entryU + span;
    currentU = exitU;
    list.push({
      stage,
      entryU,
      exitU,
      horizontalSpan: span,
    });
  }
  const totalU = list.length > 0 ? list[list.length - 1].exitU : 0;
  return { list, totalU };
}

interface Props {
  stages: JourneyStage[];
  active: boolean;
}

export function ScrollJourney({ stages, active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [depthMeters, setDepthMeters] = useState(0);
  const [warpSpeed, setWarpSpeed] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const stageCount = stages.length;

  const cameraRef = useRef({
    targetProgress: 0,
    currentProgress: 0,
    velocity: 0,
    lastScrollY: 0,
    lastTime: 0,
  });

  const stageElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const stageMetrics = useMemo(() => computeStageMetrics(stages), [stages]);

  // Jump to specific stage
  const navigateToStage = useCallback(
    (index: number) => {
      if (!trackRef.current || stageMetrics.list.length <= 1) return;
      const extent = trackRef.current.scrollHeight - window.innerHeight;
      if (extent <= 0) return;
      const metric = stageMetrics.list[index];
      if (!metric) return;
      const targetProgress =
        stageMetrics.totalU > 0 ? metric.entryU / stageMetrics.totalU : 0;
      const targetY = targetProgress * extent;
      window.scrollTo({
        top: targetY,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [stageMetrics, reducedMotion],
  );

  // Sync with URL hash
  useEffect(() => {
    if (!active) return;
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const index = stages.findIndex(
        (s) => s.id.toLowerCase() === hash.toLowerCase(),
      );
      if (index !== -1) {
        navigateToStage(index);
      }
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        const id = href.slice(1).toLowerCase();
        const index = stages.findIndex((s) => s.id.toLowerCase() === id);
        if (index !== -1) {
          e.preventDefault();
          navigateToStage(index);
          history.pushState(null, "", href);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    document.addEventListener("click", handleLinkClick);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      document.removeEventListener("click", handleLinkClick);
    };
  }, [active, stages, navigateToStage]);

  // Main animation loop for 3D camera & Z-axis stage projection
  useEffect(() => {
    if (!active) return;

    let animFrame = 0;
    let lastActiveIndex = 0;

    const tick = (now: number) => {
      const camera = cameraRef.current;
      const track = trackRef.current;
      const extent = track
        ? track.scrollHeight - window.innerHeight
        : 1;
      const scrollY = window.scrollY;

      const target = extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0;
      camera.targetProgress = target;

      // Calculate velocity
      const dt = Math.max(8, camera.lastTime ? now - camera.lastTime : 16) / 1000;
      camera.lastTime = now;
      const scrollDiff = scrollY - camera.lastScrollY;
      camera.lastScrollY = scrollY;
      const instantVelocity = Math.abs(scrollDiff) / (dt * 1000);
      camera.velocity += (instantVelocity - camera.velocity) * 0.15;

      // Lerp camera progress towards target with tight, responsive response
      const diff = camera.targetProgress - camera.currentProgress;
      const lerpFactor = reducedMotion ? 1 : 0.28;
      if (Math.abs(diff) < 0.0001) {
        camera.currentProgress = camera.targetProgress;
      } else {
        camera.currentProgress += diff * lerpFactor;
      }

      const p = camera.currentProgress;
      const u = p * stageMetrics.totalU;

      // Determine active stage index cleanly based on midpoint thresholds
      let activeIdx = 0;
      for (let i = 0; i < stageMetrics.list.length; i++) {
        const m = stageMetrics.list[i];
        const next = stageMetrics.list[i + 1];
        const threshold = next ? (m.exitU + next.entryU) / 2 : m.exitU;
        if (u <= threshold) {
          activeIdx = i;
          break;
        }
        activeIdx = i;
      }

      if (activeIdx !== lastActiveIndex) {
        lastActiveIndex = activeIdx;
        setCurrentStageIndex(activeIdx);
      }

      // Update depth readout meters
      const depth = Math.round(u * 280);
      setDepthMeters(depth);
      setWarpSpeed(Math.min(100, Math.round(camera.velocity * 35)));

      // Position each stage in 3D Z space
      stageElementsRef.current.forEach((el, i) => {
        if (!el) return;

        const m = stageMetrics.list[i];
        if (!m) return;

        let delta: number;
        let h: number;

        if (u < m.entryU) {
          delta = m.entryU - u; // > 0: ahead in tunnel
          h = 0;
        } else if (u > m.exitU) {
          delta = m.exitU - u; // < 0: passed behind
          h = 1;
        } else {
          delta = 0; // pinned at focal plane
          h = m.horizontalSpan > 0 ? (u - m.entryU) / m.horizontalSpan : 0;
        }

        // Always publish timeline variables to the stage element
        el.style.setProperty("--timeline-progress", h.toFixed(4));
        el.style.setProperty("--axis-fill", `${(h * 100).toFixed(1)}%`);

        if (reducedMotion) {
          // Clean 2D crossfade for reduced motion
          const isCurrent =
            (u >= m.entryU - 0.45 && u <= m.exitU + 0.45) ||
            (i === 0 && u <= m.exitU + 0.45) ||
            (i === stageMetrics.list.length - 1 && u >= m.entryU - 0.45);
          el.style.opacity = isCurrent ? "1" : "0";
          el.style.transform = "none";
          el.style.filter = "none";
          el.style.visibility = isCurrent ? "visible" : "hidden";
          if (isCurrent) {
            el.setAttribute("data-focal", "true");
          } else {
            el.removeAttribute("data-focal");
          }
          return;
        }

        // 3D Perspective Projection with continuous Z movement:
        if (Math.abs(delta) > 1.6) {
          el.style.visibility = "hidden";
          return;
        }

        el.style.visibility = "visible";

        // Crisp 3D perspective without texture stretching:
        // Departing elements (delta < 0) maintain scale = 1.0 to ensure fonts never pixelate
        let z: number;
        let scale: number;
        let opacity: number;

        if (delta > 0) {
          // Approaching from distance: scales smoothly from 0.35 up to 1.0
          z = -delta * 950;
          scale = Math.max(0.35, 1 - delta * 0.38);
          opacity = Math.max(0, Math.min(1, 1.35 - delta * 1.35));
        } else if (delta < 0) {
          // Departing / scrolled out: gentle forward motion, scale locked at 1 to keep text razor sharp
          z = Math.min(260, -delta * 260);
          scale = 1.0;
          opacity = Math.max(0, 1 - Math.abs(delta) * 1.5);
        } else {
          // Focal plane (during normal focus or horizontal span)
          z = 0;
          scale = 1.0;
          opacity = 1.0;
        }

        const isFocal = Math.abs(delta) <= 0.35;
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.filter = "none";

        if (isFocal) {
          el.setAttribute("data-focal", "true");
        } else {
          el.removeAttribute("data-focal");
        }
      });

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [active, stageMetrics, reducedMotion]);

  // Keyboard navigation for jumping sectors
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "PageDown" || (e.key === "ArrowDown" && e.altKey)) {
        e.preventDefault();
        navigateToStage(Math.min(stageCount - 1, currentStageIndex + 1));
      } else if (e.key === "PageUp" || (e.key === "ArrowUp" && e.altKey)) {
        e.preventDefault();
        navigateToStage(Math.max(0, currentStageIndex - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        navigateToStage(0);
      } else if (e.key === "End") {
        e.preventDefault();
        navigateToStage(stageCount - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, currentStageIndex, stageCount, navigateToStage]);

  if (!active) return null;

  const activeStage = stages[currentStageIndex] || stages[0];

  return (
    <div ref={containerRef} className="scroll-journey">
      {/* Native scroll track for smooth mouse wheel, trackpad, touch, and scrollbar physics */}
      <div
        ref={trackRef}
        className="journey-scroll-track"
        style={{ height: `${stageMetrics.totalU * 95 + 100}vh` }}
        aria-hidden="true"
      />

      {/* 3D Spatial Corridor Viewport */}
      <div className="journey-viewport" aria-live="polite">
        {/* Hyperspace tunnel depth rings that expand outward */}
        <div className="tunnel-corridor" aria-hidden="true">
          <div className="tunnel-ring tunnel-ring-1" />
          <div className="tunnel-ring tunnel-ring-2" />
          <div className="tunnel-ring tunnel-ring-3" />
        </div>

        {/* 3D Stages */}
        <div className="journey-stage-world">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              ref={(el) => {
                stageElementsRef.current[index] = el;
              }}
              id={stage.id}
              className={`journey-stage ${
                index === currentStageIndex ? "is-active" : ""
              }`}
              aria-label={`Sector ${index + 1}: ${stage.label}`}
            >
              <div className="journey-stage-inner">
                <div className="stage-card-scroller">{stage.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Futuristic Spatial Telemetry HUD */}
      <aside
        className="spatial-hud"
        aria-label="Portal Navigation Telemetry"
      >
        <div className="hud-telemetry">
          <div className="hud-chip">
            <Compass size={13} className="hud-icon pulse" />
            <span className="hud-sector">
              SECTOR 0{currentStageIndex + 1} // {activeStage.sectorCode}
            </span>
          </div>
          <div className="hud-depth-readout">
            <span className="hud-dim">Z-DEPTH:</span> -{depthMeters}M
            {warpSpeed > 15 && (
              <span className="hud-warp-badge">WARP {warpSpeed}%</span>
            )}
          </div>
        </div>

        {/* Waypoint Sector Track */}
        <nav
          className="hud-waypoints"
          aria-label="Corridor Sectors"
        >
          {stages.map((stage, idx) => (
            <button
              key={stage.id}
              type="button"
              className={`hud-waypoint ${
                idx === currentStageIndex ? "is-active" : ""
              }`}
              onClick={() => navigateToStage(idx)}
              title={`Jump to ${stage.label}`}
              aria-label={`Jump to sector ${idx + 1}: ${stage.label}`}
            >
              <span className="waypoint-pip" />
              <span className="waypoint-label">{stage.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}

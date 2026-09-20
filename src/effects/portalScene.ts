export interface PortalState {
  time: number;
  opening: number;
  travel: number;
}

export interface PortalLetter {
  x: number;
  y: number;
  width: number;
  height: number;
  pixels: { x: number; y: number }[];
}

const TAU = Math.PI * 2;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function portalGeometry(width: number, height: number, state: PortalState) {
  const restingRadius = Math.min(width * 0.32, height * 0.3, 230);
  const endRadius = Math.hypot(width, height) / 2 + 80;
  const opening = restingRadius * state.opening;
  return {
    x: width / 2,
    y: height / 2,
    radius: opening + (endRadius - opening) * state.travel,
    restingRadius,
    endRadius,
  };
}

// The canvas is the only cover over the page. Each complete frame has a fully
// opaque exterior and a transparent interior, all in the same coordinate space.
export function paintPortal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: PortalState,
  letters: PortalLetter[] = [],
) {
  const { x, y, radius, restingRadius } = portalGeometry(width, height, state);
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#080a0a";
  ctx.fillRect(0, 0, width, height);

  if (state.time >= 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    if (radius > 0) {
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, TAU);
    }
    ctx.clip("evenodd");

    // Constant stroke widths, clockwise phase offsets, counterclockwise motion.
    // Moving each radius with the aperture pushes the entire current outward.
    const spacing = Math.max(width, height) * 0.725 / 29;
    ctx.lineWidth = 1.6;
    ctx.globalAlpha = clamp(state.time / 0.45);
    for (let i = 0; i < 29; i++) {
      const arcRadius = radius + 12 + (i + 1) * spacing;
      const angle = -Math.PI / 4 - i * TAU * 0.1 / 5.5 - state.time * TAU / 5.5;
      ctx.beginPath();
      ctx.strokeStyle = "#63d6e5";
      ctx.arc(x, y, arcRadius, angle, angle + Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "#c779d6";
      ctx.arc(x, y, arcRadius, angle + Math.PI / 2, angle + Math.PI);
      ctx.stroke();
    }

    // The same bitmap letters as the title join the exterior current. They
    // share its clipping, so no text fragments can obscure the revealed page.
    letters.forEach((letter, i) => {
      const t = clamp((state.time - i * 0.015) / 1.55);
      if (t >= 1 || letter.pixels.length === 0) return;
      const dx = letter.x * width - x;
      const dy = letter.y * height - y;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) - t * Math.PI * 1.15;
      const drift = Math.sin(t * Math.PI / 2);
      const orbit = Math.max(
        distance + (restingRadius * 1.8 - distance) * drift,
        radius + letter.width * width * 0.8,
      );
      ctx.save();
      ctx.translate(x + Math.cos(angle) * orbit, y + Math.sin(angle) * orbit);
      ctx.rotate(-t * Math.PI * 1.2);
      ctx.scale(1 + t * 1.5, 1 - t * 0.8);
      ctx.globalAlpha = 1 - t * t;
      ctx.fillStyle = t < 0.12 ? "#d3ffe3" : i % 2 ? "#c779d6" : "#63d6e5";
      const pixelWidth = letter.width * width / 5;
      const pixelHeight = letter.height * height / 7;
      for (const pixel of letter.pixels) {
        ctx.fillRect((pixel.x - 2.5) * pixelWidth, (pixel.y - 3.5) * pixelHeight, pixelWidth, pixelHeight);
      }
      ctx.restore();
    });

    ctx.globalAlpha = 1;
    if (radius > 0) {
      const glow = ctx.createRadialGradient(x, y, radius, x, y, radius + 36);
      glow.addColorStop(0, "#c8f6ffbb");
      glow.addColorStop(0.15, "#63d6e566");
      glow.addColorStop(0.6, "#c779d622");
      glow.addColorStop(1, "#c779d600");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius + 36, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#dcfaff";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(x, y, radius + 0.9, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();

    // A brief light at the center opens into the rim. No whole-surface fades.
    const seedOpacity = clamp(state.time / 0.15) * (1 - clamp((state.time - 0.25) / 0.2));
    if (seedOpacity > 0) {
      const seed = ctx.createRadialGradient(x, y, 0, x, y, 34);
      seed.addColorStop(0, "#ffffff");
      seed.addColorStop(0.13, "#e2faff");
      seed.addColorStop(0.3, "#63d6e5aa");
      seed.addColorStop(1, "#c779d600");
      ctx.globalAlpha = seedOpacity;
      ctx.fillStyle = seed;
      ctx.fillRect(x - 34, y - 34, 68, 68);
      ctx.globalAlpha = 1;
    }
  }

  // Clear LAST: even the glow and title cannot paint inside the opening.
  if (radius > 0) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fillStyle = "#000";
    ctx.fill();
  }
  ctx.restore();
}

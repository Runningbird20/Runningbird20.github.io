import assert from "node:assert/strict";
import test from "node:test";
import { createCanvas } from "@napi-rs/canvas";
import { paintPortal, portalGeometry } from "../src/effects/portalScene.ts";

// Real bitmap-shaped glyphs fade around the seed before the opening appears.
// An empty letter list would miss regressions in that drawing layer.
const glyphPixels = ["01110", "10001", "10001", "11111", "10001", "10001", "10001"]
  .flatMap((row, y) => Array.from(row).flatMap((pixel, x) => pixel === "1" ? [{ x, y }] : []));
const letters = Array.from({ length: 13 }, (_, i) => ({
  x: 0.2 + i * 0.05,
  y: 0.5,
  width: 0.035,
  height: 0.07,
  pixels: i === 6 ? [] : glyphPixels,
}));

const phases = [
  ["terminal cover", { time: -1, opening: 0, travel: 0 }],
  ["portal start", { time: 0, opening: 0, travel: 0 }],
  ["title fades", { time: 0.4, opening: 0, travel: 0 }],
  ["bright seed", { time: 0.9, opening: 0, travel: 0 }],
  ["seed becomes opening", { time: 1.1, opening: 0.015, travel: 0 }],
  ["opening expands", { time: 1.6, opening: 0.55, travel: 0 }],
  ["open circle", { time: 2.05, opening: 1, travel: 0 }],
  ["ebb contraction", { time: 2.4, opening: 0.92, travel: 0 }],
  ["ebb expansion", { time: 2.75, opening: 1.035, travel: 0 }],
  ["ebb settles", { time: 3.05, opening: 1, travel: 0 }],
  ["travel begins", { time: 3.35, opening: 1, travel: 0.12 }],
  ["travel crosses viewport", { time: 3.95, opening: 1, travel: 0.65 }],
  ["full reveal", { time: 4.3, opening: 1, travel: 1 }],
];

function surface(width, height, dpr) {
  const canvas = createCanvas(Math.round(width * dpr), Math.round(height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
  return { canvas, ctx };
}

function assertAperture(canvas, ctx, width, height, dpr, state, label) {
  const geometry = portalGeometry(width, height, state);
  const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  // Ignore only the rasterized circumference, not the glow or swirl region.
  const tolerance = 1.5 / dpr;
  const innerSquared = Math.max(0, geometry.radius - tolerance) ** 2;
  const outerSquared = (geometry.radius + tolerance) ** 2;
  let inside = 0;
  let outside = 0;
  for (let py = 0; py < canvas.height; py++) {
    const dy = (py + 0.5) * height / canvas.height - geometry.y;
    for (let px = 0; px < canvas.width; px++) {
      const dx = (px + 0.5) * width / canvas.width - geometry.x;
      const distanceSquared = dx * dx + dy * dy;
      const alpha = rgba[(py * canvas.width + px) * 4 + 3];
      if (distanceSquared < innerSquared) {
        inside++;
        if (alpha !== 0) assert.fail(`${label}: page covered inside circle at (${px}, ${py}), alpha ${alpha}`);
      } else if (geometry.radius === 0 || distanceSquared > outerSquared) {
        outside++;
        if (alpha !== 255) assert.fail(`${label}: page leaks outside circle at (${px}, ${py}), alpha ${alpha}`);
      }
    }
  }
  if (geometry.radius > tolerance + 1) assert.ok(inside > 0, `${label}: checked visible page pixels`);
  if (state.travel === 1) {
    assert.ok(geometry.radius > Math.hypot(width, height) / 2, "opening covers every viewport corner before handoff");
    assert.equal(inside, canvas.width * canvas.height, `${label}: entire viewport is transparent before removing the canvas`);
  } else {
    assert.ok(outside > 0, `${label}: checked opaque cover pixels`);
  }
}

for (const [name, width, height, dpr] of [
  ["desktop", 1440, 900, 1],
  ["retina portrait", 390, 844, 2],
  ["ultrawide fractional DPR", 2560, 1080, 1.5],
  ["short landscape rounded fractional DPR", 963, 441, 1.25],
]) {
  test(`${name}: page is visible only inside the circle throughout the transition`, () => {
    const { canvas, ctx } = surface(width, height, dpr);
    // Reuse the canvas through expansion AND contraction to expose stale holes.
    for (const [phase, state] of phases) {
      paintPortal(ctx, width, height, state, letters);
      assertAperture(canvas, ctx, width, height, dpr, state, `${name}, ${phase}`);
    }
  });
}

test("repainting after a larger opening leaves no transparent residue", () => {
  const width = 640;
  const height = 400;
  const dpr = 2;
  const reused = surface(width, height, dpr);
  paintPortal(reused.ctx, width, height, { time: 3.55, opening: 1, travel: 1 }, letters);
  for (const state of [
    { time: 1.3, opening: 1, travel: 0 },
    { time: 1.65, opening: 0.92, travel: 0 },
    { time: 0.7, opening: 0.4, travel: 0 },
    { time: -1, opening: 0, travel: 0 },
  ]) {
    paintPortal(reused.ctx, width, height, state, letters);
    const fresh = surface(width, height, dpr);
    paintPortal(fresh.ctx, width, height, state, letters);
    assert.deepEqual(
      reused.ctx.getImageData(0, 0, reused.canvas.width, reused.canvas.height).data,
      fresh.ctx.getImageData(0, 0, fresh.canvas.width, fresh.canvas.height).data,
      "each complete frame must match a fresh render, regardless of earlier aperture size",
    );
  }
});

test("a resized backing surface immediately restores the same aperture guarantees", () => {
  const { canvas, ctx } = surface(800, 500, 1);
  const state = { time: 0.8, opening: 0.7, travel: 0 };
  paintPortal(ctx, 800, 500, state, letters);
  for (const [width, height, dpr] of [[360, 780, 2], [780, 360, 1.5], [800, 500, 1]]) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    paintPortal(ctx, width, height, state, letters);
    assertAperture(canvas, ctx, width, height, dpr, state, `resized ${width}×${height}@${dpr}`);
  }
});

test("bitmap letters remain visible during the fade", () => {
  const width = 800;
  const height = 500;
  const state = { time: 0.45, opening: 0, travel: 0 };
  const withLetters = surface(width, height, 1);
  const withoutLetters = surface(width, height, 1);
  paintPortal(withLetters.ctx, width, height, state, letters);
  paintPortal(withoutLetters.ctx, width, height, state);
  const painted = withLetters.ctx.getImageData(0, 0, width, height).data;
  const empty = withoutLetters.ctx.getImageData(0, 0, width, height).data;
  let changed = 0;
  for (let i = 0; i < painted.length; i += 4) {
    if (painted[i] !== empty[i] || painted[i + 1] !== empty[i + 1] || painted[i + 2] !== empty[i + 2]) changed++;
  }
  assert.ok(changed > 100, "nonempty bitmap glyphs must remain visible during collapse");
  assertAperture(withLetters.canvas, withLetters.ctx, width, height, 1, state, "visible bitmap letters");
});


test("the title keeps its size while fading and finishes before the portal opens", () => {
  const width = 800;
  const height = 500;
  let initialExtent = 0;
  for (const time of [0, 0.4, 0.7, 0.9, 1.05]) {
    const state = { time, opening: 0, travel: 0 };
    const withLetters = surface(width, height, 1);
    const withoutLetters = surface(width, height, 1);
    paintPortal(withLetters.ctx, width, height, state, letters);
    paintPortal(withoutLetters.ctx, width, height, state);
    const painted = withLetters.ctx.getImageData(0, 0, width, height).data;
    const empty = withoutLetters.ctx.getImageData(0, 0, width, height).data;
    let extent = 0;
    for (let i = 0; i < painted.length; i += 4) {
      if (painted[i] === empty[i] && painted[i + 1] === empty[i + 1] && painted[i + 2] === empty[i + 2]) continue;
      const pixel = i / 4;
      extent = Math.max(extent, Math.hypot(pixel % width - width / 2, Math.floor(pixel / width) - height / 2));
    }
    if (time === 0) {
      initialExtent = extent;
      assert.ok(initialExtent > 0, "title must begin visible");
    } else if (time < 0.85) {
      assert.ok(
        extent > initialExtent * 0.95,
        "visible title must retain its original size while fading",
      );
    } else {
      assert.equal(extent, 0, "no title fragments should remain after the fade");
    }
  }
});

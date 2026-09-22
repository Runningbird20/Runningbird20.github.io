import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceSpring,
  hoverPosition,
  particleDisplacement,
} from "../src/lib/cursorPhysics.ts";

test("spring converges to its target without diverging across frame rates", () => {
  for (const dt of [1 / 240, 1 / 60, 1 / 24, 0.2]) {
    let axis = { position: 0, velocity: 0 };
    for (let elapsed = 0; elapsed < 2; elapsed += dt) {
      axis = advanceSpring(axis, 1, dt);
      assert.ok(Number.isFinite(axis.position));
      assert.ok(Math.abs(axis.position) < 1.1, `spring overshot at ${dt}s frames`);
    }
    assert.ok(Math.abs(axis.position - 1) < 0.001, `spring settled at ${dt}s frames`);
  }
});

test("particles attract at medium range and repel close to the pointer", () => {
  const medium = particleDisplacement(120, 0, false, 0);
  const close = particleDisplacement(15, 0, false, 0);
  assert.ok(medium.x > 0, "medium-range particle moves toward pointer");
  assert.ok(close.x < 0, "nearby particle moves away from pointer");
});

test("press and velocity broaden repulsion while keeping force bounded", () => {
  const calm = particleDisplacement(100, 0, false, 0);
  const pressed = particleDisplacement(100, 0, true, 0);
  const fast = particleDisplacement(100, 0, false, 4000);
  assert.ok(pressed.x < calm.x);
  assert.ok(fast.x < calm.x);
  for (const result of [pressed, fast, particleDisplacement(0, 0, true, 9000, 1)]) {
    assert.ok(Math.hypot(result.x, result.y) <= 110.001, "displacement remains bounded");
  }
});

test("hover coordinates normalize and clamp around target center", () => {
  const box = { left: 100, top: 50, width: 200, height: 100 };
  assert.deepEqual(hoverPosition(200, 100, box), { x: 0, y: 0 });
  assert.deepEqual(hoverPosition(-500, 900, box), { x: -1, y: 1 });
  assert.deepEqual(hoverPosition(250, 75, box), { x: 0.5, y: -0.5 });
});

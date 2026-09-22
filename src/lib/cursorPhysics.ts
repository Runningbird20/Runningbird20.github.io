export interface SpringAxis {
  position: number;
  velocity: number;
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Exact critically damped spring integration: stable at different frame rates,
// with no accumulated energy when returning from a background tab.
export function advanceSpring(axis: SpringAxis, target: number, seconds: number, frequency = 14): SpringAxis {
  const dt = clamp(seconds, 0, 0.1);
  const offset = axis.position - target;
  const decay = Math.exp(-frequency * dt);
  const impulse = axis.velocity + frequency * offset;
  return {
    position: target + (offset + impulse * dt) * decay,
    velocity: (axis.velocity - frequency * impulse * dt) * decay,
  };
}

export function particleDisplacement(dx: number, dy: number, pressed: boolean, speed: number, phase = 0) {
  const distance = Math.hypot(dx, dy);
  const falloff = (radius: number) => Math.max(0, 1 - distance / radius) ** 2;
  // A calm outer field attracts; the small inner field keeps particles away
  // from the pointer. Pressing or sweeping quickly pushes a wider region away.
  const attraction = 32 * falloff(210) * Math.min(distance / 65, 1);
  const repulsion = 65 * falloff(65) + (pressed ? 115 * falloff(220) : 0)
    + 24 * clamp(speed / 2200, 0, 1) * falloff(150);
  const force = clamp(attraction - repulsion, -110, 24);
  const ux = distance > 0.001 ? dx / distance : Math.cos(phase);
  const uy = distance > 0.001 ? dy / distance : Math.sin(phase);
  return { x: ux * force, y: uy * force };
}

export function hoverPosition(x: number, y: number, box: { left: number; top: number; width: number; height: number }) {
  return {
    x: box.width > 0 ? clamp((x - box.left) / box.width * 2 - 1, -1, 1) : 0,
    y: box.height > 0 ? clamp((y - box.top) / box.height * 2 - 1, -1, 1) : 0,
  };
}

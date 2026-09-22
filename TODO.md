# Portfolio TODO

## Vision

Build an experimental, highly interactive developer portfolio that showcases software engineering, security engineering, creative frontend development, animation, WebGL, and interaction design.

The experience should follow this progression:

**Terminal Boot → Authentication → ACCESS GRANTED → Color Portal → Interactive Hero → Scroll Journey → Projects → Experience → Skills → Contact**

The website should feel alive. Cursor movement, clicks, scrolling, velocity, and hover states should influence the interface.

At the same time, the portfolio must remain performant, accessible, responsive, and usable by recruiters who simply want to find information quickly.

---

# Phase 1: Project Foundation

- [x] Initialize React + TypeScript + Vite
- [x] Configure Tailwind CSS
- [x] Configure ESLint
- [x] Create clean project structure
- [x] Add `.gitignore`
- [x] Configure GitHub Pages deployment
- [x] Create GitHub Actions deployment workflow
- [x] Verify `npm run dev`
- [x] Verify `npm run build`
- [x] Create centralized portfolio data file
- [x] Create TypeScript interfaces for portfolio data
- [x] Add placeholder personal information
- [x] Add placeholder project data
- [x] Add placeholder experience data
- [x] Add placeholder education data
- [x] Add placeholder activity/hackathon data
- [x] Add placeholder skill data
- [x] Configure SEO metadata
- [x] Add favicon placeholder

Suggested structure:

```text
src/
├── components/
├── sections/
├── effects/
├── hooks/
├── data/
│   └── portfolio.ts
├── lib/
├── styles/
├── assets/
├── App.tsx
└── main.tsx
```

---

# Phase 2: Core Portfolio

Build the normal portfolio experience before implementing advanced effects.

- [x] Create navigation
- [x] Create Hero section
- [x] Create About section
- [x] Create Projects section
- [x] Create reusable Project component
- [x] Create Experience section
- [x] Create Education section
- [x] Create Skills section
- [x] Create Activities/Hackathons section
- [x] Create Contact section
- [x] Create Footer
- [x] Add Resume link
- [x] Add GitHub link
- [x] Add LinkedIn link
- [x] Add email link
- [x] Implement responsive layout
- [x] Verify mobile layout
- [x] Verify tablet layout
- [x] Verify desktop layout

The portfolio must remain fully usable without the advanced animation system.

---

# Phase 3: Animation Foundation

Install and configure animation/graphics libraries only when they are actually needed.

Potential libraries (only GSAP is required for phases 1–5):

- [x] GSAP
- [ ] GSAP ScrollTrigger — deferred until a feature needs it
- [ ] Three.js — deferred until a feature needs it
- [ ] React Three Fiber — deferred until a feature needs it
- [ ] React Three Drei — deferred until a feature needs it
- [ ] Motion — deferred until a feature needs it
- [ ] Lenis — deferred until a feature needs it
- [ ] Matter.js — deferred until a feature needs it
- [ ] Howler.js — deferred until a feature needs it

Do not install every library immediately. Add them as their corresponding features are implemented.

Create shared systems for:

- [x] Animation timing
- [x] Scroll progress
- [x] Cursor position
- [x] Cursor velocity
- [x] Pointer state
- [x] Device capabilities
- [x] Reduced motion
- [x] Viewport size
- [x] Performance mode

---

# Phase 4: Terminal Boot Sequence

Create the initial loading experience.

Initial state:

```text
> initializing system...

[OK] establishing secure connection
[OK] loading identity
[OK] loading project archive
[OK] loading experience records
[OK] initializing graphics engine

> authenticating visitor...
```

Requirements:

- [x] Full-screen black terminal
- [x] Monospace typography
- [x] Blinking terminal cursor
- [x] Sequential typing animation
- [x] Randomized but controlled terminal timing
- [x] Animated `[OK]` responses
- [x] Subtle terminal flicker
- [ ] Optional CRT/noise effect — intentionally omitted to limit visual noise
- [x] Prevent excessive visual effects
- [x] Add `SKIP INTRO`
- [x] Allow keyboard skip
- [x] Remember intro completion during current session
- [x] Do not replay full intro during normal internal navigation
- [x] Respect `prefers-reduced-motion`

Target intro duration:

**Approximately 2.5-4 seconds**

---

# Phase 5: ACCESS GRANTED Transition

This should be one of the signature moments of the portfolio.

After authentication:

```text
ACCESS GRANTED
```

Sequence:

1. Terminal stops.
2. `ACCESS GRANTED` appears.
3. Brief pause.
4. Text begins glitching.
5. Characters distort.
6. Terminal UI destabilizes.
7. Interface explodes outward.
8. Monochrome terminal transitions into full color.
9. Terminal particles transform into the hero environment.

Tasks:

- [x] Create ACCESS GRANTED typography
- [x] Create glitch effect
- [x] Create text distortion
- [x] Create terminal shake/distortion
- [x] Convert terminal characters into particles
- [x] Animate particles outward
- [x] Introduce color during explosion
- [x] Transition particles into hero background
- [x] Synchronize transition using GSAP timeline
- [x] Ensure transition works at different resolutions
- [x] Create reduced-motion alternative
- [x] Test performance on mobile

The transition should feel dramatic without taking too long.

---

# Phase 6: Living Background

Create a persistent interactive visual environment.

Implementation: a lightweight Canvas 2D particle field and CSS color fields, using the portal's cyan (`#63d6e5`) and magenta (`#c779d6`). No additional graphics library needed.

- [ ] WebGL canvas — deferred; Canvas 2D meets current visual requirements
- [x] Create particle system
- [x] Create subtle background geometry
- [x] Add depth
- [x] Add parallax
- [x] Add procedural movement
- [x] Connect some nearby particles
- [x] Make environment react to scroll
- [x] Make environment react to cursor
- [x] Make environment react to clicks on non-interactive areas
- [x] Implement smooth transitions between sections through continuous scroll progress
- [x] Apply cyan and magenta as the site's main accent colors
- [x] Add pause control and a static reduced-motion version
- [x] Pause work in hidden tabs and reduce particle density on mobile

The background should evolve throughout the portfolio rather than remaining identical.

---

# Phase 7: Cursor Physics

Make the interface respond physically to the visitor.

Track:

```text
cursor.x
cursor.y
cursor.velocityX
cursor.velocityY
cursor.speed
cursor.state
```

Implement:

- [x] Custom desktop cursor
- [x] Smooth cursor interpolation
- [x] Cursor velocity calculation
- [x] Cursor attraction
- [x] Cursor repulsion
- [x] Particle displacement
- [x] Hover distortion
- [x] Magnetic buttons
- [x] Cursor state transitions
- [x] Disable custom cursor on touch devices

Cursor states:

```text
DEFAULT → translucent gray outline + soft neutral halo
PROJECT LINK → VIEW
GITHUB → CODE
EXTERNAL LINK → OPEN
BUTTON / INTERNAL LINK → brighter halo
CLICK → brief ring + pointer press
```

Custom cursor falls back to native controls for touch, reduced motion, forced colors, editable fields, disabled links, and keyboard navigation. The pointer stays at the true click position; only its light trails.

Do not sacrifice normal click behavior or accessibility.

---

# Phase 8: Click Shockwaves

Clicking empty areas should influence the environment.

- [ ] Detect background clicks
- [ ] Create radial shockwave
- [ ] Displa

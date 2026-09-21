export const animation = {
  sessionKey: "portfolio:intro-complete:v1",
  characterMin: 0.018,
  characterMax: 0.028,
  linePause: 0.1,
  authenticationPause: 1.5,
  readableHold: 0.9,
  portalDelay: 2.0,
  transitionDuration: 4.55,
  ease: "power3.out",
} as const;
export function introAlreadySeen() {
  try {
    return sessionStorage.getItem(animation.sessionKey) === "true";
  } catch {
    return false;
  }
}
export function rememberIntro() {
  try {
    sessionStorage.setItem(animation.sessionKey, "true");
  } catch {
    /* Storage may be blocked; navigation still works. */
  }
}
export function shouldShowIntro() {
  return (
    !introAlreadySeen() &&
    !location.hash &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Framer Motion tokens implementing the Phase 4 visual-design-spec motion
// system (§2.9) — every section reuses these instead of inventing its own
// timing/easing per component.

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN = [0.65, 0, 0.35, 1];

export const DURATION = {
  micro: 0.15,
  base: 0.3,
  section: 0.7,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.section, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.section, ease: EASE_OUT } },
};

export function staggerContainer(staggerChildren = 0.08, delayChildren = 0) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

export const scrollRevealViewport = { once: true, margin: '-100px' };

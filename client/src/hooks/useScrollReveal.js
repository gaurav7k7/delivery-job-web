import { useReducedMotion } from 'framer-motion';
import { fadeUp, fadeIn, scrollRevealViewport } from '../lib/motionVariants';

// Every section's entrance animation goes through this hook so the
// prefers-reduced-motion governor (Phase 4 §2.9) is enforced in exactly one
// place: reduced motion collapses translateY into a plain opacity fade.
export function useScrollReveal() {
  const prefersReducedMotion = useReducedMotion();
  return {
    variants: prefersReducedMotion ? fadeIn : fadeUp,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: scrollRevealViewport,
  };
}

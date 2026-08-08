import { ReactLenis } from 'lenis/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function SmoothScrollProvider({ children }) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion) return children;

  return (
    <ReactLenis root options={{ duration: 1.1, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)) }}>
      {children}
    </ReactLenis>
  );
}

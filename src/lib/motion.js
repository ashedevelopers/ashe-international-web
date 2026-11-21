import { useMemo } from 'react';

// True only on browsers that cannot observe scrolling (very old devices). Scroll-reveal elements then show
// immediately, so content is never left invisible. Everywhere else the scroll animations play normally.
export function useForceIn() {
  return useMemo(() => typeof window !== 'undefined' && !('IntersectionObserver' in window), []);
}

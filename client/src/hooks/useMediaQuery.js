import { useCallback, useSyncExternalStore } from 'react';

// useSyncExternalStore is the React-provided primitive for exactly this case
// (subscribing to a mutable external source, like matchMedia) — it avoids the
// extra render-on-mount and query-change footguns of syncing an external
// value into useState from inside an effect.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

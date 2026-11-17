import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False during prerender and hydration, true afterwards. Lets components that
 * depend on the visitor's clock or browser (e.g. the date picker) render a
 * stable placeholder first, so hydration never mismatches.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

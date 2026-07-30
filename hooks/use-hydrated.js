"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/*
 * False on the server and on the first client render, true afterwards.
 *
 * Needed wherever a branch depends on something only the browser can see — the
 * auth cookie via hasAuthToken(), or a persisted Zustand store. Without it the
 * server renders the signed-out branch while the client renders the signed-in
 * one, and React reports a hydration mismatch and throws the tree away.
 *
 * Gate on this and render the same thing both times, then let the real state
 * appear once hydrated.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

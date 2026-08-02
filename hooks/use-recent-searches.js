"use client";

import { useCallback, useSyncExternalStore } from "react";

/*
 * Recent search *queries* — the plain strings the search panel lists under
 * "RECENT SEARCHES". Distinct from use-search-history, which stores whole
 * filter objects for the /shop/categories results page.
 *
 * Kept as a module-level external store rather than component state: the
 * server snapshot is a stable empty list, so the navbar SSRs without a
 * hydration mismatch and nothing has to setState from an effect.
 */
const STORAGE_KEY = "ebunly:recent-searches";
const MAX = 5;

const EMPTY = [];
let cache = null;
const listeners = new Set();

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((q) => typeof q === "string")
      : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  // Cached so repeated reads return a stable reference for useSyncExternalStore.
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot() {
  return EMPTY;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota — the list still works for this session.
  }
  for (const listener of listeners) listener();
}

export function useRecentSearches() {
  const recent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addRecent = useCallback((query) => {
    const q = String(query ?? "").trim();
    if (!q) return;
    commit([q, ...getSnapshot().filter((p) => p !== q)].slice(0, MAX));
  }, []);

  const removeRecent = useCallback((query) => {
    commit(getSnapshot().filter((p) => p !== query));
  }, []);

  return { recent, addRecent, removeRecent };
}

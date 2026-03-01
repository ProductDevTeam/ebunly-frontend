"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ebunly_search_history";
const MAX_HISTORY = 3;

/**
 * Builds a human-readable label from a filters object
 * e.g. { search: "cake", occasions: ["Birthday"], minPrice: 5000 }
 *   → "cake · Birthday · From ₦5,000"
 */
export function buildFilterSummary(filters = {}) {
  const parts = [];

  if (filters.search) parts.push(filters.search);

  if (filters.occasions?.length) {
    parts.push(filters.occasions.join(", "));
  }

  if (filters.giftTypes?.length) {
    parts.push(filters.giftTypes.map((g) => g.replace(/_/g, " ")).join(", "));
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    parts.push(
      `₦${Number(filters.minPrice).toLocaleString()} – ₦${Number(filters.maxPrice).toLocaleString()}`,
    );
  } else if (filters.minPrice !== undefined) {
    parts.push(`From ₦${Number(filters.minPrice).toLocaleString()}`);
  } else if (filters.maxPrice !== undefined) {
    parts.push(`Up to ₦${Number(filters.maxPrice).toLocaleString()}`);
  }

  if (filters.madeInNigeria) parts.push("Made In Naija");
  if (filters.minDiscount !== undefined)
    parts.push(`${filters.minDiscount}%+ off`);

  return parts.length > 0 ? parts : null;
}

/**
 * Checks if a filters object has any active filters (ignores page/limit)
 */
function hasActiveFilters(filters = {}) {
  return !!(
    filters.search ||
    filters.occasions?.length ||
    filters.giftTypes?.length ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.madeInNigeria ||
    filters.minDiscount !== undefined ||
    filters.category
  );
}

export function useSearchHistory() {
  const [history, setHistory] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveToHistory = useCallback((filters) => {
    if (!hasActiveFilters(filters)) return;

    const summary = buildFilterSummary(filters);
    if (!summary) return;

    const entry = {
      id: Date.now(),
      filters: { ...filters, page: 1 }, // always reset to page 1 on re-apply
      summary,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Deduplicate by summary label (avoid saving same search twice)
      const label = summary.join(" · ");
      const deduplicated = prev.filter((h) => h.summary.join(" · ") !== label);
      const next = [entry, ...deduplicated].slice(0, MAX_HISTORY);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }

      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const removeEntry = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { history, saveToHistory, clearHistory, removeEntry };
}

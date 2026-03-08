import { useState, useCallback } from 'react';

const STORAGE_KEY = 'helmies-recent-searches';
const MAX_RECENT = 8;

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const addSearch = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    setSearches(prev => {
      const next = [q, ...prev.filter(s => s !== q)].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setSearches(prev => {
      const next = prev.filter(s => s !== query);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSearches([]);
  }, []);

  return { searches, addSearch, removeSearch, clearAll };
}

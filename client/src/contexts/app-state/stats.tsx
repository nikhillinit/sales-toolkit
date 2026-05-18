/**
 * Stats context — persists to IndexedDB (fieldkit:v1:stats).
 * Debounced save: 300ms after last mutation.
 * Flushes on visibilitychange (hidden) and pagehide.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { idbGet, idbSet } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { DEFAULT_STATS, type Stats } from './types';

interface StatsActionsValue {
  modStat: (key: keyof Stats, delta: number) => void;
  restoreStats: (stats: Partial<Stats>) => void;
}

const StatsStateContext = createContext<Stats | null>(null);
const StatsActionsContext = createContext<StatsActionsValue | null>(null);

const DEBOUNCE_MS = 300;

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [isHydrated, setHydrated] = useState(false);
  const pendingRef = useRef(false);
  const statsRef = useRef(stats);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  // Hydrate from IDB
  useEffect(() => {
    idbGet<Partial<Stats>>(STORAGE_KEYS.stats, {})
      .then(stored => {
        if (stored && typeof stored === 'object') {
          setStats(prev => ({ ...prev, ...stored }));
        }
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  const flush = useCallback(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    idbSet(STORAGE_KEYS.stats, statsRef.current).catch(() => {});
  }, []);

  // Debounced save
  useEffect(() => {
    if (!isHydrated) return;
    pendingRef.current = true;
    const t = window.setTimeout(flush, DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [stats, isHydrated, flush]);

  // Flush on background / tab close
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
    };
  }, [flush]);

  const modStat = useCallback((key: keyof Stats, delta: number) => {
    setStats(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  }, []);

  const restoreStats = useCallback((nextStats: Partial<Stats>) => {
    setStats(prev => ({ ...prev, ...nextStats }));
  }, []);

  const actionsValue = useMemo(() => ({ modStat, restoreStats }), [modStat, restoreStats]);

  return (
    <StatsStateContext.Provider value={stats}>
      <StatsActionsContext.Provider value={actionsValue}>
        {children}
      </StatsActionsContext.Provider>
    </StatsStateContext.Provider>
  );
}

export function useStatsState() {
  const ctx = useContext(StatsStateContext);
  if (!ctx) throw new Error('useStatsState must be used within AppStateProvider');
  return ctx;
}

export function useStatsActions() {
  const ctx = useContext(StatsActionsContext);
  if (!ctx) throw new Error('useStatsActions must be used within AppStateProvider');
  return ctx;
}

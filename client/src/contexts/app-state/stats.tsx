import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DEFAULT_STATS, type Stats } from './types';

interface StatsActionsValue {
  modStat: (key: keyof Stats, delta: number) => void;
  restoreStats: (stats: Partial<Stats>) => void;
}

const StatsStateContext = createContext<Stats | null>(null);
const StatsActionsContext = createContext<StatsActionsValue | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);

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

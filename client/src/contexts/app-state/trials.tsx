/**
 * Trials context — persists to IndexedDB (fieldkit:v1:trials).
 * Uses idbUpdate for atomic array mutations.
 * Debounced save: 300ms after last mutation.
 * Flushes on visibilitychange (hidden) and pagehide.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { idbGet, idbSet } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { useStatsActions } from './stats';
import type { Stats, Trial } from './types';

interface TrialActionsValue {
  addTrial: (trial: Trial) => void;
  closeTrial: (id: number, outcome: string) => void;
  removeTrial: (id: number) => void;
  restoreTrials: (trials: Trial[]) => void;
  advanceCadence: (id: number) => void;
}

const TrialsStateContext = createContext<Trial[] | null>(null);
const TrialActionsContext = createContext<TrialActionsValue | null>(null);

const OUTCOME_STAT_MAP: Record<string, keyof Stats> = {
  yes_reorder: 'yes',
  yes_soft: 'yes',
  no_use: 'exit',
  no_taste: 'exit',
  no_policy: 'exit',
  retest: 'retest',
  referral: 'retest',
  blocker: 'blocker',
};

const DEBOUNCE_MS = 300;

export function TrialProvider({ children }: { children: React.ReactNode }) {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isHydrated, setHydrated] = useState(false);
  const { modStat } = useStatsActions();
  const pendingRef = useRef(false);
  const trialsRef = useRef(trials);

  useEffect(() => {
    trialsRef.current = trials;
  }, [trials]);

  // Hydrate from IDB
  useEffect(() => {
    idbGet<Trial[]>(STORAGE_KEYS.trials, [])
      .then(stored => {
        const migrated = (stored ?? []).map(t => ({
          ...t,
          cadenceStep: t.cadenceStep ?? 0,
          cadenceCompletedAt: t.cadenceCompletedAt ?? [],
          shippedAt: t.shippedAt ?? t.fuDate ?? new Date().toISOString(),
        }));
        setTrials(migrated);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  const flush = useCallback(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    idbSet(STORAGE_KEYS.trials, trialsRef.current).catch(() => {});
  }, []);

  // Debounced save
  useEffect(() => {
    if (!isHydrated) return;
    pendingRef.current = true;
    const t = window.setTimeout(flush, DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [trials, isHydrated, flush]);

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

  const addTrial = useCallback((trial: Trial) => {
    const withCadence: Trial = {
      ...trial,
      cadenceStep: trial.cadenceStep ?? 0,
      cadenceCompletedAt: trial.cadenceCompletedAt ?? [],
      shippedAt: trial.shippedAt ?? new Date().toISOString(),
    };
    setTrials(prev => [...prev, withCadence]);
  }, []);

  const removeTrial = useCallback((id: number) => {
    setTrials(prev => prev.filter(t => t.id !== id));
  }, []);

  const closeTrial = useCallback((id: number, outcome: string) => {
    const statKey = OUTCOME_STAT_MAP[outcome];
    setTrials(prev => prev.filter(t => t.id !== id));
    if (statKey) modStat(statKey, 1);
  }, [modStat]);

  const restoreTrials = useCallback((nextTrials: Trial[]) => {
    const migrated = nextTrials.map(t => ({
      ...t,
      cadenceStep: t.cadenceStep ?? 0,
      cadenceCompletedAt: t.cadenceCompletedAt ?? [],
      shippedAt: t.shippedAt ?? t.fuDate ?? new Date().toISOString(),
    }));
    setTrials(migrated);
  }, []);

  const advanceCadence = useCallback((id: number) => {
    setTrials(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStep = Math.min(t.cadenceStep + 1, 5);
      return {
        ...t,
        cadenceStep: nextStep,
        cadenceCompletedAt: [...t.cadenceCompletedAt, new Date().toISOString()],
      };
    }));
  }, []);

  const actionsValue = useMemo(
    () => ({ addTrial, closeTrial, removeTrial, restoreTrials, advanceCadence }),
    [addTrial, closeTrial, removeTrial, restoreTrials, advanceCadence],
  );

  return (
    <TrialsStateContext.Provider value={trials}>
      <TrialActionsContext.Provider value={actionsValue}>
        {children}
      </TrialActionsContext.Provider>
    </TrialsStateContext.Provider>
  );
}

export function useTrialsState() {
  const ctx = useContext(TrialsStateContext);
  if (ctx === null) throw new Error('useTrialsState must be used within AppStateProvider');
  return ctx;
}

export function useTrialActions() {
  const ctx = useContext(TrialActionsContext);
  if (!ctx) throw new Error('useTrialActions must be used within AppStateProvider');
  return ctx;
}

/**
 * AppState — Unified Signal OS
 * Central state for the Restless Field Toolkit sales OS.
 * Persists to sessionStorage under STORAGE_KEY.
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type StepId = 'prepare' | 'qualify' | 'activate' | 'followup' | 'report';

export interface Trial {
  id: number;
  acct: string;
  human: string;
  routine: string;
  window: string;
  risk: string;
  type: string;
  typeLabel: string;
  fuDate: string;
  fuChan: string;
  code: string;
  binary: string;
  yesRoute: string;
  noRoute: string;
  status: 'shipped' | 'closed';
}

export interface Stats {
  out: number;
  live: number;
  qual: number;
  ship: number;
  yes: number;
  exit: number;
  retest: number;
  blocker: number;
}

export interface AppStateData {
  currentStep: StepId;
  completedSteps: StepId[];
  gearsLocked: boolean;
  trials: Trial[];
  stats: Stats;
  formDraft: Record<string, string | boolean>;
}

interface AppContextValue {
  state: AppStateData;
  switchStep: (step: StepId) => void;
  markStepComplete: (step: StepId) => void;
  modStat: (key: keyof Stats, delta: number) => void;
  setGearsLocked: (locked: boolean) => void;
  addTrial: (trial: Trial) => void;
  closeTrial: (id: number, outcome: string) => void;
  removeTrial: (id: number) => void;
  updateFormDraft: (fields: Record<string, string | boolean>) => void;
  saveDraft: () => void;
  restoreDraft: () => boolean;
  discardDraft: () => void;
  hasDraft: boolean;
  toast: (msg: string) => void;
  toastMessage: string | null;
}

const STORAGE_KEY = 'restless_session_draft_v06';

const DEFAULT_STATE: AppStateData = {
  currentStep: 'prepare',
  completedSteps: [],
  gearsLocked: false,
  trials: [],
  stats: { out: 0, live: 0, qual: 0, ship: 0, yes: 0, exit: 0, retest: 0, blocker: 0 },
  formDraft: {},
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppStateData>(DEFAULT_STATE);
  const [hasDraft, setHasDraft] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for existing draft on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setHasDraft(true);
    } catch { /* ignore */ }
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const switchStep = useCallback((step: StepId) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const markStepComplete = useCallback((step: StepId) => {
    setState(prev => {
      if (prev.completedSteps.includes(step)) return prev;
      return { ...prev, completedSteps: [...prev.completedSteps, step] };
    });
  }, []);

  const modStat = useCallback((key: keyof Stats, delta: number) => {
    setState(prev => ({
      ...prev,
      stats: { ...prev.stats, [key]: Math.max(0, (prev.stats[key] || 0) + delta) }
    }));
  }, []);

  const setGearsLocked = useCallback((locked: boolean) => {
    setState(prev => ({ ...prev, gearsLocked: locked }));
  }, []);

  const addTrial = useCallback((trial: Trial) => {
    setState(prev => ({ ...prev, trials: [...prev.trials, trial] }));
  }, []);

  const removeTrial = useCallback((id: number) => {
    setState(prev => ({ ...prev, trials: prev.trials.filter(t => t.id !== id) }));
  }, []);

  const closeTrial = useCallback((id: number, outcome: string) => {
    const statMap: Record<string, keyof Stats> = {
      yes_reorder: 'yes', yes_soft: 'yes',
      no_use: 'exit', no_taste: 'exit', no_policy: 'exit',
      retest: 'retest', referral: 'retest',
      blocker: 'blocker',
    };
    const statKey = statMap[outcome];
    setState(prev => {
      const newStats = statKey
        ? { ...prev.stats, [statKey]: (prev.stats[statKey] || 0) + 1 }
        : prev.stats;
      return {
        ...prev,
        trials: prev.trials.filter(t => t.id !== id),
        stats: newStats,
      };
    });
  }, []);

  const updateFormDraft = useCallback((fields: Record<string, string | boolean>) => {
    setState(prev => ({ ...prev, formDraft: { ...prev.formDraft, ...fields } }));
  }, []);

  const saveDraft = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setHasDraft(true);
    } catch { /* quota error */ }
  }, [state]);

  const restoreDraft = useCallback((): boolean => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const d = JSON.parse(raw) as Partial<AppStateData>;
      setState(prev => ({
        ...prev,
        ...(d.stats && { stats: { ...prev.stats, ...d.stats } }),
        ...(d.trials && { trials: d.trials }),
        ...(d.completedSteps && { completedSteps: d.completedSteps }),
        ...(typeof d.gearsLocked === 'boolean' && { gearsLocked: d.gearsLocked }),
        ...(d.formDraft && { formDraft: d.formDraft }),
        ...(d.currentStep && { currentStep: d.currentStep }),
      }));
      setHasDraft(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const discardDraft = useCallback(() => {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setHasDraft(false);
  }, []);

  return (
    <AppContext.Provider value={{
      state, switchStep, markStepComplete, modStat, setGearsLocked,
      addTrial, closeTrial, removeTrial, updateFormDraft,
      saveDraft, restoreDraft, discardDraft, hasDraft, toast, toastMessage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

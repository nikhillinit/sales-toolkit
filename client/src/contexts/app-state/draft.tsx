import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useStatsActions, useStatsState } from './stats';
import { useTrialActions, useTrialsState } from './trials';
import { useUiActions, useUiState } from './ui';
import { STORAGE_KEY, type AppStateData } from './types';

type FormDraft = Record<string, string | boolean>;

interface DraftStateValue {
  formDraft: FormDraft;
  hasDraft: boolean;
}

interface DraftActionsValue {
  updateFormDraft: (fields: FormDraft) => void;
  saveDraft: () => void;
  restoreDraft: () => boolean;
  discardDraft: () => void;
}

const DraftStateContext = createContext<DraftStateValue | null>(null);
const DraftActionsContext = createContext<DraftActionsValue | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const uiState = useUiState();
  const { restoreUiState } = useUiActions();
  const stats = useStatsState();
  const { restoreStats } = useStatsActions();
  const trials = useTrialsState();
  const { restoreTrials } = useTrialActions();
  const [formDraft, setFormDraft] = useState<FormDraft>({});
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setHasDraft(true);
    } catch {
      /* ignore */
    }
  }, []);

  const updateFormDraft = useCallback((fields: FormDraft) => {
    setFormDraft(prev => ({ ...prev, ...fields }));
  }, []);

  const saveDraft = useCallback(() => {
    const snapshot: AppStateData = {
      ...uiState,
      trials,
      stats,
      formDraft,
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      setHasDraft(true);
    } catch {
      /* quota error */
    }
  }, [formDraft, stats, trials, uiState]);

  const restoreDraft = useCallback((): boolean => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      const snapshot = JSON.parse(raw) as Partial<AppStateData>;
      restoreUiState(snapshot);
      if (snapshot.stats) restoreStats(snapshot.stats);
      if (snapshot.trials) restoreTrials(snapshot.trials);
      if (snapshot.formDraft) setFormDraft(snapshot.formDraft);
      setHasDraft(false);
      return true;
    } catch {
      return false;
    }
  }, [restoreStats, restoreTrials, restoreUiState]);

  const discardDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setHasDraft(false);
  }, []);

  const stateValue = useMemo(() => ({ formDraft, hasDraft }), [formDraft, hasDraft]);
  const actionsValue = useMemo(
    () => ({ updateFormDraft, saveDraft, restoreDraft, discardDraft }),
    [discardDraft, restoreDraft, saveDraft, updateFormDraft],
  );

  return (
    <DraftStateContext.Provider value={stateValue}>
      <DraftActionsContext.Provider value={actionsValue}>
        {children}
      </DraftActionsContext.Provider>
    </DraftStateContext.Provider>
  );
}

export function useDraftState() {
  const ctx = useContext(DraftStateContext);
  if (!ctx) throw new Error('useDraftState must be used within AppStateProvider');
  return ctx;
}

export function useDraftActions() {
  const ctx = useContext(DraftActionsContext);
  if (!ctx) throw new Error('useDraftActions must be used within AppStateProvider');
  return ctx;
}

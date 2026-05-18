/**
 * Draft context — persists formDraft to IndexedDB (fieldkit:v1:formDraft).
 * Replaces sessionStorage. Debounced save: 300ms.
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
import { idbGet, idbSet, idbDel } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { useStatsActions, useStatsState } from './stats';
import { useTrialActions, useTrialsState } from './trials';
import { useUiActions, useUiState } from './ui';
import { DEFAULT_RING_STATS, type AppStateData } from './types';

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

const DEBOUNCE_MS = 300;

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const uiState = useUiState();
  const { restoreUiState } = useUiActions();
  const stats = useStatsState();
  const { restoreStats } = useStatsActions();
  const trials = useTrialsState();
  const { restoreTrials } = useTrialActions();

  const [formDraft, setFormDraft] = useState<FormDraft>({});
  const [hasDraft, setHasDraft] = useState(false);
  const [isHydrated, setHydrated] = useState(false);
  const pendingRef = useRef(false);
  const formDraftRef = useRef(formDraft);

  useEffect(() => {
    formDraftRef.current = formDraft;
  }, [formDraft]);

  // Hydrate: check if a draft exists
  useEffect(() => {
    idbGet<FormDraft | null>(STORAGE_KEYS.formDraft, null)
      .then(stored => {
        if (stored && typeof stored === 'object' && Object.keys(stored).length > 0) {
          setFormDraft(stored);
          setHasDraft(true);
        }
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  const flush = useCallback(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    if (Object.keys(formDraftRef.current).length === 0) {
      idbDel(STORAGE_KEYS.formDraft).catch(() => {});
    } else {
      idbSet(STORAGE_KEYS.formDraft, formDraftRef.current).catch(() => {});
    }
  }, []);

  // Debounced save
  useEffect(() => {
    if (!isHydrated) return;
    pendingRef.current = true;
    const t = window.setTimeout(flush, DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [formDraft, isHydrated, flush]);

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

  const updateFormDraft = useCallback((fields: FormDraft) => {
    setFormDraft(prev => ({ ...prev, ...fields }));
  }, []);

  const saveDraft = useCallback(() => {
    const snapshot: AppStateData = {
      ...uiState,
      trials,
      stats,
      ringStats: DEFAULT_RING_STATS,
      formDraft,
    };
    idbSet(STORAGE_KEYS.formDraft, snapshot.formDraft).catch(() => {});
    idbSet(STORAGE_KEYS.trials, snapshot.trials).catch(() => {});
    idbSet(STORAGE_KEYS.stats, snapshot.stats).catch(() => {});
    idbSet(STORAGE_KEYS.uiProgress, {
      currentStep: snapshot.currentStep,
      completedSteps: snapshot.completedSteps,
      gearsLocked: snapshot.gearsLocked,
    }).catch(() => {});
    setHasDraft(true);
  }, [uiState, trials, stats, formDraft]);

  const restoreDraft = useCallback((): boolean => {
    // Restoration is handled by each slice's own hydration on mount.
    // This is a no-op in the IDB model — data is always restored on mount.
    return hasDraft;
  }, [hasDraft]);

  const discardDraft = useCallback(() => {
    idbDel(STORAGE_KEYS.formDraft).catch(() => {});
    setFormDraft({});
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

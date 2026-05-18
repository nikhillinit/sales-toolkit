import React, { useMemo } from 'react';
import { DraftProvider, useDraftActions, useDraftState } from './draft';
import { StatsProvider, useStatsActions, useStatsState } from './stats';
import { TrialProvider, useTrialActions, useTrialsState } from './trials';
import { UiStateProvider, useToastActions, useToastMessage, useUiActions, useUiState } from './ui';
import { DEFAULT_RING_STATS } from './types';
import type { AppStateData } from './types';

export * from './draft';
export * from './stats';
export * from './trials';
export * from './types';
export * from './ui';

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <UiStateProvider>
      <StatsProvider>
        <TrialProvider>
          <DraftProvider>{children}</DraftProvider>
        </TrialProvider>
      </StatsProvider>
    </UiStateProvider>
  );
}

export function useAppState() {
  const uiState = useUiState();
  const uiActions = useUiActions();
  const stats = useStatsState();
  const statsActions = useStatsActions();
  const trials = useTrialsState();
  const trialActions = useTrialActions();
  const draftState = useDraftState();
  const draftActions = useDraftActions();
  const toastMessage = useToastMessage();
  const { toast } = useToastActions();

  const state = useMemo<AppStateData>(
    () => ({
      ...uiState,
      stats,
      trials,
      ringStats: DEFAULT_RING_STATS,
      formDraft: draftState.formDraft,
    }),
    [draftState.formDraft, stats, trials, uiState],
  );

  return {
    state,
    ...uiActions,
    ...statsActions,
    ...trialActions,
    ...draftActions,
    hasDraft: draftState.hasDraft,
    toast,
    toastMessage,
  };
}

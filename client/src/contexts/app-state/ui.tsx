import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AppStateData, StepId } from './types';

interface UiStateValue {
  currentStep: StepId;
  completedSteps: StepId[];
  gearsLocked: boolean;
}

interface UiActionsValue {
  switchStep: (step: StepId) => void;
  markStepComplete: (step: StepId) => void;
  setGearsLocked: (locked: boolean) => void;
  restoreUiState: (snapshot: Partial<AppStateData>) => void;
}

interface ToastActionsValue {
  toast: (msg: string) => void;
}

const UiStateContext = createContext<UiStateValue | null>(null);
const UiActionsContext = createContext<UiActionsValue | null>(null);
const ToastMessageContext = createContext<string | null | undefined>(undefined);
const ToastActionsContext = createContext<ToastActionsValue | null>(null);

export function UiStateProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<StepId>('prepare');
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [gearsLocked, setGearsLockedState] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const switchStep = useCallback((step: StepId) => {
    setCurrentStep(step);
  }, []);

  const markStepComplete = useCallback((step: StepId) => {
    setCompletedSteps(prev => {
      if (prev.includes(step)) return prev;
      return [...prev, step];
    });
  }, []);

  const setGearsLocked = useCallback((locked: boolean) => {
    setGearsLockedState(locked);
  }, []);

  const restoreUiState = useCallback((snapshot: Partial<AppStateData>) => {
    if (snapshot.currentStep) setCurrentStep(snapshot.currentStep);
    if (snapshot.completedSteps) setCompletedSteps(snapshot.completedSteps);
    if (typeof snapshot.gearsLocked === 'boolean') setGearsLockedState(snapshot.gearsLocked);
  }, []);

  const stateValue = useMemo(
    () => ({ currentStep, completedSteps, gearsLocked }),
    [completedSteps, currentStep, gearsLocked],
  );
  const actionsValue = useMemo(
    () => ({ switchStep, markStepComplete, setGearsLocked, restoreUiState }),
    [markStepComplete, restoreUiState, setGearsLocked, switchStep],
  );
  const toastActionsValue = useMemo(() => ({ toast }), [toast]);

  return (
    <UiStateContext.Provider value={stateValue}>
      <UiActionsContext.Provider value={actionsValue}>
        <ToastMessageContext.Provider value={toastMessage}>
          <ToastActionsContext.Provider value={toastActionsValue}>
            {children}
          </ToastActionsContext.Provider>
        </ToastMessageContext.Provider>
      </UiActionsContext.Provider>
    </UiStateContext.Provider>
  );
}

export function useUiState() {
  const ctx = useContext(UiStateContext);
  if (!ctx) throw new Error('useUiState must be used within AppStateProvider');
  return ctx;
}

export function useUiActions() {
  const ctx = useContext(UiActionsContext);
  if (!ctx) throw new Error('useUiActions must be used within AppStateProvider');
  return ctx;
}

export function useToastMessage() {
  const ctx = useContext(ToastMessageContext);
  if (ctx === undefined) throw new Error('useToastMessage must be used within AppStateProvider');
  return ctx;
}

export function useToastActions() {
  const ctx = useContext(ToastActionsContext);
  if (!ctx) throw new Error('useToastActions must be used within AppStateProvider');
  return ctx;
}

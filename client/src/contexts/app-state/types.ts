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

export const DEFAULT_STATS: Stats = {
  out: 0,
  live: 0,
  qual: 0,
  ship: 0,
  yes: 0,
  exit: 0,
  retest: 0,
  blocker: 0,
};

export const STORAGE_KEY = 'restless_session_draft_v06';

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
  // Feature 5: Follow-Up Cadence
  cadenceStep: number; // 0=shipped, 1=D+1, 2=D+3, 3=D+7, 4=D+14, 5=D+30 done
  cadenceCompletedAt: string[]; // ISO timestamps per completed step
  shippedAt: string; // ISO timestamp when trial was shipped
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

// Feature 6: Ring Scorecard
export type RingKey = 'r1' | 'r2' | 'r3' | 'r4';
export interface RingMetrics {
  contacts: number;
  trials: number;
  yesNo: number;
  reorders: number;
}
export type RingStats = Record<RingKey, RingMetrics>;

export const DEFAULT_RING_STATS: RingStats = {
  r1: { contacts: 0, trials: 0, yesNo: 0, reorders: 0 },
  r2: { contacts: 0, trials: 0, yesNo: 0, reorders: 0 },
  r3: { contacts: 0, trials: 0, yesNo: 0, reorders: 0 },
  r4: { contacts: 0, trials: 0, yesNo: 0, reorders: 0 },
};

export const RING_TARGETS: RingStats = {
  r1: { contacts: 10, trials: 3, yesNo: 1, reorders: 0 },
  r2: { contacts: 8,  trials: 2, yesNo: 1, reorders: 0 },
  r3: { contacts: 5,  trials: 1, yesNo: 0, reorders: 1 },
  r4: { contacts: 5,  trials: 1, yesNo: 0, reorders: 1 },
};

export interface AppStateData {
  currentStep: StepId;
  completedSteps: StepId[];
  gearsLocked: boolean;
  trials: Trial[];
  stats: Stats;
  ringStats: RingStats;
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

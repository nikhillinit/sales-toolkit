/**
 * Export / Import schema — Zod validation for the full FieldKit data bundle.
 *
 * Export format: JSON file with schema version, timestamp, and all IDB slices.
 * Import: validated against this schema before any writes, so corrupt files
 * never touch the database.
 */
import { z } from 'zod';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const StoryCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  character: z.string(),
  context: z.string(),
  conflict: z.string(),
  climax: z.string(),
  closure: z.string(),
  timestamp: z.number(),
});

const TrialSchema = z.object({
  id: z.number(),
  acct: z.string(),
  human: z.string(),
  routine: z.string(),
  window: z.string(),
  risk: z.string(),
  type: z.string(),
  typeLabel: z.string(),
  fuDate: z.string(),
  fuChan: z.string(),
  code: z.string(),
  binary: z.string(),
  yesRoute: z.string(),
  noRoute: z.string(),
  status: z.enum(['shipped', 'closed']),
  cadenceStep: z.number().default(0),
  cadenceCompletedAt: z.array(z.string()).default([]),
  shippedAt: z.string().default(''),
});

const StatsSchema = z.object({
  out: z.number().default(0),
  live: z.number().default(0),
  qual: z.number().default(0),
  ship: z.number().default(0),
  yes: z.number().default(0),
  exit: z.number().default(0),
  retest: z.number().default(0),
  blocker: z.number().default(0),
});

const LaneSelectorSchema = z.object({
  laneScores: z.array(z.object({
    segment: z.string(),
    scores: z.array(z.number()),
    storyId: z.string().optional(),
  })),
  plan: z.object({
    primaryLane: z.string(),
    activationTarget: z.string(),
    namedTargets: z.string(),
    callBlocks: z.string(),
    fieldVisits: z.string(),
    development: z.string(),
    objections: z.string(),
    sayNoTo: z.string(),
    codesReady: z.string(),
    successCondition: z.string(),
    savedAt: z.string().nullable(),
  }),
}).nullable();

const NetworkLogSchema = z.object({
  id: z.string(),
  gear: z.string(),
  contactName: z.string(),
  community: z.string(),
  createdAt: z.string(),
});

const UiProgressSchema = z.object({
  currentStep: z.enum(['prepare', 'qualify', 'activate', 'followup', 'report']).optional(),
  completedSteps: z.array(z.string()).optional(),
  gearsLocked: z.boolean().optional(),
});

const RoleplayDebriefSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  scenario: z.string(),
  transcript: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  grade: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Root export schema ───────────────────────────────────────────────────────

export const EXPORT_SCHEMA_VERSION = 1;

export const FieldKitExportSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  appVersion: z.string().optional(),
  data: z.object({
    storyVault: z.array(StoryCardSchema).default([]),
    trials: z.array(TrialSchema).default([]),
    stats: StatsSchema.default({ out: 0, live: 0, qual: 0, ship: 0, yes: 0, exit: 0, retest: 0, blocker: 0 }),
    laneSelector: LaneSelectorSchema.default(null),
    networkLogs: z.array(NetworkLogSchema).default([]),
    uiProgress: UiProgressSchema.default({}),
    roleplayDebriefs: z.array(RoleplayDebriefSchema).default([]),
  }),
});

export type FieldKitExport = z.infer<typeof FieldKitExportSchema>;
export type StoryCard = z.infer<typeof StoryCardSchema>;
export type ExportedTrial = z.infer<typeof TrialSchema>;
export type ExportedStats = z.infer<typeof StatsSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validate and parse an imported JSON blob.
 * Returns { ok: true, data } or { ok: false, error }.
 */
export function parseExport(raw: unknown):
  | { ok: true; data: FieldKitExport }
  | { ok: false; error: string } {
  const result = FieldKitExportSchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };
  const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
  return { ok: false, error: `Invalid export file: ${issues}` };
}

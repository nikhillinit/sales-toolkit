/**
 * Non-destructive migrations from legacy localStorage keys to IndexedDB.
 *
 * Rules:
 * - NEVER overwrite non-empty IDB data.
 * - NEVER delete legacy keys during the first release after migration.
 * - App must boot even if migration fails.
 * - Per-slice migration status is written to IDB for observability.
 */
import { idbGet, idbSet } from './idb';
import { LEGACY_KEYS, STORAGE_KEYS } from './keys';

export type MigrationResult =
  | 'migrated'
  | 'skipped-existing-idb'
  | 'missing-legacy'
  | 'failed';

export interface MigrationStatus {
  version: 1;
  completedAt: string;
  slices: {
    storyVault: MigrationResult;
    laneSelector: MigrationResult;
    networkLogs: MigrationResult;
    appState: MigrationResult;
  };
}

async function migrateIfEmpty<T>({
  targetKey,
  legacyValue,
  isValid,
}: {
  targetKey: string;
  legacyValue: T | null;
  isValid: (value: T | null) => boolean;
}): Promise<MigrationResult> {
  try {
    const existing = await idbGet<unknown | null>(targetKey, null);

    const idbHasData = Array.isArray(existing)
      ? existing.length > 0
      : existing !== null && existing !== undefined;

    if (idbHasData) return 'skipped-existing-idb';
    if (!isValid(legacyValue)) return 'missing-legacy';

    await idbSet(targetKey, legacyValue);
    return 'migrated';
  } catch {
    return 'failed';
  }
}

function readLocalStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readSessionStorage<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function runMigrations(): Promise<MigrationStatus> {
  // Story Vault
  const legacyStories = readLocalStorage<unknown[]>(LEGACY_KEYS.storyVault);
  const storyVault = await migrateIfEmpty({
    targetKey: STORAGE_KEYS.storyVault,
    legacyValue: legacyStories,
    isValid: v => Array.isArray(v) && v.length > 0,
  });

  // Lane Selector
  const legacyLane = readLocalStorage<unknown>(LEGACY_KEYS.laneSelector);
  const laneSelector = await migrateIfEmpty({
    targetKey: STORAGE_KEYS.laneSelector,
    legacyValue: legacyLane,
    isValid: v => v !== null && typeof v === 'object',
  });

  // Network Logs
  const legacyNetwork = readLocalStorage<unknown[]>(LEGACY_KEYS.networkLogs);
  const networkLogs = await migrateIfEmpty({
    targetKey: STORAGE_KEYS.networkLogs,
    legacyValue: legacyNetwork,
    isValid: v => Array.isArray(v) && v.length > 0,
  });

  // AppState — read from sessionStorage, split into four IDB slices
  // The legacy key stores the entire AppStateData snapshot as a single object.
  // We read it once and migrate each slice independently.
  const legacyAppState = readSessionStorage<Record<string, unknown>>(LEGACY_KEYS.sessionDraft);

  let appState: MigrationResult = 'missing-legacy';
  if (legacyAppState && typeof legacyAppState === 'object') {
    const results = await Promise.all([
      migrateIfEmpty({
        targetKey: STORAGE_KEYS.formDraft,
        legacyValue: legacyAppState.formDraft ?? null,
        isValid: v => v !== null && typeof v === 'object',
      }),
      migrateIfEmpty({
        targetKey: STORAGE_KEYS.trials,
        legacyValue: legacyAppState.trials ?? null,
        isValid: v => Array.isArray(v),
      }),
      migrateIfEmpty({
        targetKey: STORAGE_KEYS.stats,
        legacyValue: legacyAppState.stats ?? null,
        isValid: v => v !== null && typeof v === 'object',
      }),
      migrateIfEmpty({
        targetKey: STORAGE_KEYS.uiProgress,
        legacyValue: {
          currentStep: legacyAppState.currentStep ?? 'prepare',
          completedSteps: legacyAppState.completedSteps ?? [],
          gearsLocked: legacyAppState.gearsLocked ?? false,
        },
        isValid: v => v !== null,
      }),
    ]);
    // If any slice migrated, report 'migrated'; if all skipped, report skipped
    if (results.includes('migrated')) appState = 'migrated';
    else if (results.every(r => r === 'skipped-existing-idb')) appState = 'skipped-existing-idb';
    else if (results.includes('failed')) appState = 'failed';
    else appState = 'missing-legacy';
  }

  const status: MigrationStatus = {
    version: 1,
    completedAt: new Date().toISOString(),
    slices: { storyVault, laneSelector, networkLogs, appState },
  };

  await idbSet(STORAGE_KEYS.migrationStatus, status);
  return status;
}

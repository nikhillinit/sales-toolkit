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
  version: 1 | 2;
  completedAt: string;
  slices: {
    storyVault: MigrationResult;
    laneSelector: MigrationResult;
    networkLogs: MigrationResult;
    repCaptures: MigrationResult;
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

  // Network Logs (v1 → IDB v1 key, kept for backward compat)
  const legacyNetwork = readLocalStorage<unknown[]>(LEGACY_KEYS.networkLogs);
  const networkLogs = await migrateIfEmpty({
    targetKey: STORAGE_KEYS.networkLogs,
    legacyValue: legacyNetwork,
    isValid: v => Array.isArray(v) && v.length > 0,
  });

  // Rep Captures (v2 migration: copy v1:networkLogs IDB data → v2:repCaptures)
  // Non-destructive: only writes if v2 key is empty.
  const repCaptures = await (async (): Promise<MigrationResult> => {
    try {
      const v2Existing = await idbGet<unknown[] | null>(STORAGE_KEYS.repCaptures, null);
      const v2HasData = Array.isArray(v2Existing) && v2Existing.length > 0;
      if (v2HasData) return 'skipped-existing-idb';
      // Read from v1 IDB key (already migrated above or pre-existing)
      const v1Data = await idbGet<unknown[] | null>(STORAGE_KEYS.networkLogs, null);
      if (!Array.isArray(v1Data) || v1Data.length === 0) return 'missing-legacy';
      await idbSet(STORAGE_KEYS.repCaptures, v1Data);
      return 'migrated';
    } catch {
      return 'failed';
    }
  })();

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
    version: 2,
    completedAt: new Date().toISOString(),
    slices: { storyVault, laneSelector, networkLogs, repCaptures, appState },
  };

  await idbSet(STORAGE_KEYS.migrationStatus, status);
  return status;
}

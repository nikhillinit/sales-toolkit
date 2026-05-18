/**
 * Shared helpers for exporting all FieldKit data to a JSON file.
 * Used by Settings and StorageWarningBanner.
 */
import { idbGet } from './idb';
import { STORAGE_KEYS } from './keys';
import { EXPORT_SCHEMA_VERSION, type FieldKitExport } from '@/lib/exportSchema';

export async function gatherExportData(): Promise<FieldKitExport> {
  const [storyVault, trials, stats, laneSelector, repCaptures, uiProgress, roleplayDebriefs] =
    await Promise.all([
      idbGet(STORAGE_KEYS.storyVault, []),
      idbGet(STORAGE_KEYS.trials, []),
      idbGet(STORAGE_KEYS.stats, {}),
      idbGet(STORAGE_KEYS.laneSelector, null),
      idbGet(STORAGE_KEYS.repCaptures, []),
      idbGet(STORAGE_KEYS.uiProgress, {}),
      idbGet(STORAGE_KEYS.roleplayDebriefs, []),
    ]);

  return {
    schemaVersion: EXPORT_SCHEMA_VERSION as 1,
    exportedAt: new Date().toISOString(),
    appVersion: '2.0.0',
    data: {
      storyVault: storyVault as FieldKitExport['data']['storyVault'],
      trials: trials as FieldKitExport['data']['trials'],
      stats: stats as FieldKitExport['data']['stats'],
      laneSelector: laneSelector as FieldKitExport['data']['laneSelector'],
      repCaptures: repCaptures as FieldKitExport['data']['repCaptures'],
      networkLogs: [] as FieldKitExport['data']['networkLogs'],
      uiProgress: uiProgress as FieldKitExport['data']['uiProgress'],
      roleplayDebriefs: roleplayDebriefs as FieldKitExport['data']['roleplayDebriefs'],
    },
  };
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAllData(): Promise<void> {
  const data = await gatherExportData();
  const date = new Date().toISOString().slice(0, 10);
  downloadJson(data, `fieldkit-backup-${date}.json`);
}

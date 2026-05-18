/**
 * Storage keys — single source of truth for all IndexedDB and legacy keys.
 * IndexedDB is the source of truth for all domain data.
 * localStorage is allowed only for tiny UI preferences (theme, panel state).
 */

export const FIELDKIT_SCHEMA_VERSION = 1;

export const STORAGE_KEYS = {
  storyVault: 'fieldkit:v1:storyVault',
  laneSelector: 'fieldkit:v1:laneSelector',
  networkLogs: 'fieldkit:v1:networkLogs',
  formDraft: 'fieldkit:v1:formDraft',
  trials: 'fieldkit:v1:trials',
  stats: 'fieldkit:v1:stats',
  uiProgress: 'fieldkit:v1:uiProgress',
  roleplayDebriefs: 'fieldkit:v1:roleplayDebriefs',
  migrationStatus: 'fieldkit:v1:migrationStatus',
  meta: 'fieldkit:v1:meta',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const LEGACY_KEYS = {
  sessionDraft: 'restless_session_draft_v06',
  laneSelector: 'restless_lane_selector_v01',
  storyVault: 'restless_story_vault_v01',
  networkLogs: 'restless_network_logs_v01',
} as const;

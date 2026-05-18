/**
 * BroadcastChannel cross-tab sync with revision metadata.
 *
 * broadcastSliceUpdate is the ONLY call site for slice-updated events.
 * It atomically bumps the revision in IDB and broadcasts the event.
 */
import { idbUpdate } from './idb';
import { STORAGE_KEYS } from './keys';

export type FieldkitSlice =
  | 'storyVault'
  | 'laneSelector'
  | 'networkLogs'
  | 'formDraft'
  | 'trials'
  | 'stats'
  | 'uiProgress'
  | 'roleplayDebriefs';

export type FieldkitBroadcastEvent =
  | {
      type: 'slice-updated';
      slice: FieldkitSlice;
      revision: number;
      sentAt: number;
      tabId: string;
    }
  | {
      type: 'data-imported' | 'data-cleared';
      revision: number;
      sentAt: number;
      tabId: string;
    };

export const FIELDKIT_CHANNEL_NAME = 'fieldkit-sync';

/** Generate a stable per-tab ID for self-message filtering. */
export function makeTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function bumpRevision(slice: FieldkitSlice): Promise<number> {
  let nextRevision = 1;

  await idbUpdate<Record<string, number>>(STORAGE_KEYS.meta, meta => {
    const next = { ...(meta ?? {}) };
    nextRevision = (next[`${slice}Revision`] ?? 0) + 1;
    next[`${slice}Revision`] = nextRevision;
    return next;
  });

  return nextRevision;
}

/**
 * Atomically bump revision and broadcast a slice-updated event.
 * This is the ONLY correct way to broadcast a slice mutation.
 */
export async function broadcastSliceUpdate(
  channel: BroadcastChannel,
  slice: FieldkitSlice,
  tabId: string,
): Promise<void> {
  const revision = await bumpRevision(slice);
  channel.postMessage({
    type: 'slice-updated',
    slice,
    revision,
    sentAt: Date.now(),
    tabId,
  } satisfies FieldkitBroadcastEvent);
}

export function broadcastDataEvent(
  channel: BroadcastChannel,
  type: 'data-imported' | 'data-cleared',
  tabId: string,
): void {
  channel.postMessage({
    type,
    revision: Date.now(),
    sentAt: Date.now(),
    tabId,
  } satisfies FieldkitBroadcastEvent);
}

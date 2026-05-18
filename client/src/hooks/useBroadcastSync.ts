/**
 * useBroadcastSync — subscribe to FieldKit cross-tab sync events.
 *
 * Filters out messages from the current tab using tabId to avoid
 * self-triggered re-renders.
 */
import { useEffect, useRef } from 'react';
import {
  FIELDKIT_CHANNEL_NAME,
  makeTabId,
  type FieldkitBroadcastEvent,
  type FieldkitSlice,
} from '@/lib/storage/broadcast';

// Stable tab ID for the lifetime of this page load
const TAB_ID = makeTabId();

export function getTabId(): string {
  return TAB_ID;
}

export function useBroadcastSync(
  onEvent: (event: FieldkitBroadcastEvent) => void,
  watchSlices?: FieldkitSlice[],
): void {
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const channel = new BroadcastChannel(FIELDKIT_CHANNEL_NAME);

    const handler = (msg: MessageEvent<FieldkitBroadcastEvent>) => {
      const event = msg.data;

      // Ignore messages from this tab
      if (event.tabId === TAB_ID) return;

      // If watchSlices is specified, only react to those slices
      if (
        watchSlices &&
        event.type === 'slice-updated' &&
        !watchSlices.includes(event.slice)
      ) {
        return;
      }

      onEventRef.current(event);
    };

    channel.addEventListener('message', handler);
    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

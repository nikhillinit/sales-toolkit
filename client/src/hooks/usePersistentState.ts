/**
 * usePersistentState — debounced IDB persistence with flush-on-background.
 *
 * Flushes pending saves on visibilitychange (hidden) and pagehide so data
 * is not lost when the user backgrounds the app or closes the tab.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { idbGet, idbSet } from '@/lib/storage/idb';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UsePersistentStateOptions<T> {
  key: string;
  initialValue: T;
  debounceMs?: number;
  onError?: (error: unknown) => void;
}

export interface UsePersistentStateResult<T> {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  isHydrated: boolean;
  saveStatus: SaveStatus;
  flush: () => void;
}

export function usePersistentState<T>({
  key,
  initialValue,
  debounceMs = 250,
  onError,
}: UsePersistentStateOptions<T>): UsePersistentStateResult<T> {
  const [state, setState] = useState<T>(initialValue);
  const [isHydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const hydratedRef = useRef(false);
  const pendingRef = useRef(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const flush = useCallback(() => {
    if (!hydratedRef.current || !pendingRef.current) return;

    pendingRef.current = false;

    idbSet(key, stateRef.current)
      .then(() => setSaveStatus('saved'))
      .catch(error => {
        pendingRef.current = true;
        setSaveStatus('error');
        onError?.(error);
      });
  }, [key, onError]);

  // Hydrate from IDB on mount
  useEffect(() => {
    let mounted = true;

    idbGet<T>(key, initialValue)
      .then(value => {
        if (!mounted) return;
        setState(value);
        stateRef.current = value;
        hydratedRef.current = true;
        setHydrated(true);
      })
      .catch(error => {
        if (!mounted) return;
        onError?.(error);
        hydratedRef.current = true;
        setHydrated(true);
        setSaveStatus('error');
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Debounced save on state change
  useEffect(() => {
    if (!hydratedRef.current) return;

    pendingRef.current = true;
    setSaveStatus('saving');

    const timeout = window.setTimeout(flush, debounceMs);
    return () => window.clearTimeout(timeout);
  }, [state, debounceMs, flush]);

  // Flush on backgrounding / tab close
  useEffect(() => {
    const flushIfHidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    document.addEventListener('visibilitychange', flushIfHidden);
    window.addEventListener('pagehide', flush);

    return () => {
      document.removeEventListener('visibilitychange', flushIfHidden);
      window.removeEventListener('pagehide', flush);
    };
  }, [flush]);

  return { state, setState, isHydrated, saveStatus, flush };
}

/**
 * StoryVaultContext — shared vault state across Story Card Builder,
 * Roleplay Simulator, and Lane Selector.
 *
 * Storage: IndexedDB via idb-keyval (fieldkit:v1:storyVault).
 * Cross-tab sync: BroadcastChannel (replaces legacy storage event).
 * Hydration: exposes isHydrated and storageError for AppDataGate.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { broadcastSliceUpdate, FIELDKIT_CHANNEL_NAME, type FieldkitBroadcastEvent } from '@/lib/storage/broadcast';
import { idbGet, idbUpdate } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { makeStoryId, type StoryCard } from '@/lib/storyVault';
import { getTabId } from '@/hooks/useBroadcastSync';

export interface StoryVaultContextValue {
  vault: StoryCard[];
  isHydrated: boolean;
  storageError: string | null;
  addStory: (story: Omit<StoryCard, 'id' | 'timestamp'>) => Promise<StoryCard>;
  updateStory: (id: string, updates: Partial<Omit<StoryCard, 'id'>>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
}

const StoryVaultContext = createContext<StoryVaultContextValue | undefined>(undefined);

export function StoryVaultProvider({ children }: { children: ReactNode }) {
  const [vault, setVault] = useState<StoryCard[]>([]);
  const [isHydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Hydrate from IDB on mount
  useEffect(() => {
    idbGet<StoryCard[]>(STORAGE_KEYS.storyVault, [])
      .then(stored => {
        setVault(stored);
        setHydrated(true);
      })
      .catch(err => {
        setStorageError(String(err));
        setHydrated(true);
      });
  }, []);

  // BroadcastChannel cross-tab sync
  useEffect(() => {
    const channel = new BroadcastChannel(FIELDKIT_CHANNEL_NAME);
    channelRef.current = channel;

    const handler = (msg: MessageEvent<FieldkitBroadcastEvent>) => {
      const event = msg.data;
      if (event.tabId === getTabId()) return;
      if (
        event.type === 'slice-updated' && event.slice === 'storyVault' ||
        event.type === 'data-imported' ||
        event.type === 'data-cleared'
      ) {
        idbGet<StoryCard[]>(STORAGE_KEYS.storyVault, []).then(setVault).catch(() => {});
      }
    };

    channel.addEventListener('message', handler);
    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const addStory = useCallback(async (story: Omit<StoryCard, 'id' | 'timestamp'>): Promise<StoryCard> => {
    const newStory: StoryCard = {
      ...story,
      id: makeStoryId(),
      timestamp: Date.now(),
    };
    await idbUpdate<StoryCard[]>(STORAGE_KEYS.storyVault, existing => [
      newStory,
      ...(existing ?? []),
    ]);
    setVault(prev => [newStory, ...prev]);
    if (channelRef.current) {
      await broadcastSliceUpdate(channelRef.current, 'storyVault', getTabId());
    }
    return newStory;
  }, []);

  const updateStory = useCallback(async (id: string, updates: Partial<Omit<StoryCard, 'id'>>): Promise<void> => {
    await idbUpdate<StoryCard[]>(STORAGE_KEYS.storyVault, existing =>
      (existing ?? []).map(s => (s.id === id ? { ...s, ...updates, id: s.id } : s)),
    );
    setVault(prev => prev.map(s => (s.id === id ? { ...s, ...updates, id: s.id } : s)));
    if (channelRef.current) {
      await broadcastSliceUpdate(channelRef.current, 'storyVault', getTabId());
    }
  }, []);

  const deleteStory = useCallback(async (id: string): Promise<void> => {
    await idbUpdate<StoryCard[]>(STORAGE_KEYS.storyVault, existing =>
      (existing ?? []).filter(s => s.id !== id),
    );
    setVault(prev => prev.filter(s => s.id !== id));
    if (channelRef.current) {
      await broadcastSliceUpdate(channelRef.current, 'storyVault', getTabId());
    }
  }, []);

  return (
    <StoryVaultContext.Provider value={{ vault, isHydrated, storageError, addStory, updateStory, deleteStory }}>
      {children}
    </StoryVaultContext.Provider>
  );
}

export function useStoryVaultContext(): StoryVaultContextValue {
  const ctx = useContext(StoryVaultContext);
  if (!ctx) {
    throw new Error('useStoryVaultContext must be used within a StoryVaultProvider');
  }
  return ctx;
}

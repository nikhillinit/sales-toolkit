/**
 * StoryVaultContext — shared vault state across Story Card Builder,
 * Roleplay Simulator, and Lane Selector.
 *
 * A Context is required (not just a hook) so sibling consumers stay in sync:
 * mutations in the Builder must immediately appear in Roleplay/Lane pickers.
 *
 * Cross-tab sync: subscribes to the `storage` event so stories saved in another
 * browser tab appear here without a refresh.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  loadVault,
  makeStoryId,
  saveVault,
  STORY_VAULT_STORAGE_KEY,
  type StoryCard,
} from '@/lib/storyVault';

interface StoryVaultContextValue {
  vault: StoryCard[];
  addStory: (story: Omit<StoryCard, 'id' | 'timestamp'>) => StoryCard;
  updateStory: (id: string, updates: Partial<Omit<StoryCard, 'id'>>) => void;
  deleteStory: (id: string) => void;
}

const StoryVaultContext = createContext<StoryVaultContextValue | undefined>(undefined);

export function StoryVaultProvider({ children }: { children: ReactNode }) {
  const [vault, setVault] = useState<StoryCard[]>(() => loadVault());

  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key !== STORY_VAULT_STORAGE_KEY) return;
      if (!e.newValue) {
        setVault([]);
        return;
      }
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) setVault(parsed);
      } catch {
        // Ignore malformed cross-tab payloads.
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const addStory = useCallback<StoryVaultContextValue['addStory']>(story => {
    const newStory: StoryCard = {
      ...story,
      id: makeStoryId(),
      timestamp: Date.now(),
    };
    setVault(prev => {
      const next = [newStory, ...prev];
      saveVault(next);
      return next;
    });
    return newStory;
  }, []);

  const updateStory = useCallback<StoryVaultContextValue['updateStory']>((id, updates) => {
    setVault(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updates, id: s.id } : s));
      saveVault(next);
      return next;
    });
  }, []);

  const deleteStory = useCallback<StoryVaultContextValue['deleteStory']>(id => {
    setVault(prev => {
      const next = prev.filter(s => s.id !== id);
      saveVault(next);
      return next;
    });
  }, []);

  return (
    <StoryVaultContext.Provider value={{ vault, addStory, updateStory, deleteStory }}>
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

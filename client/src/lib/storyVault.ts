/**
 * Story Vault — persistence, types, and script generation for the Story Card Builder.
 *
 * Pattern mirrors NetworkTracker's localStorage helpers (client/src/pages/NetworkTracker.tsx:15-29).
 * Storage key follows the codebase's `restless_<feature>_v01` convention (see LaneSelector.tsx:75).
 */

export interface StoryCard {
  id: string;
  title: string;
  character: string;
  context: string;
  conflict: string;
  climax: string;
  closure: string;
  timestamp: number;
}

export const STORY_VAULT_STORAGE_KEY = 'restless_story_vault_v01';

export function loadVault(): StoryCard[] {
  try {
    const raw = localStorage.getItem(STORY_VAULT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVault(vault: StoryCard[]): void {
  try {
    localStorage.setItem(STORY_VAULT_STORAGE_KEY, JSON.stringify(vault));
  } catch {
    // Quota exceeded or storage unavailable; in-memory state still updates.
  }
}

export function makeStoryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `story-${crypto.randomUUID()}`;
  }
  return `story-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type StoryNarrative = Pick<StoryCard, 'character' | 'context' | 'conflict' | 'climax' | 'closure'>;

export interface StoryScripts {
  fifteen: string;
  fortyFive: string;
}

export function generateScripts(story: Partial<StoryNarrative>): StoryScripts {
  const c = story.character?.trim() || '[Character]';
  const ctx = story.context?.trim() || '[Context]';
  const con = story.conflict?.trim() || '[Conflict]';
  const clx = story.climax?.trim() || '[Climax]';
  const clo = story.closure?.trim() || '[Closure]';

  const fifteen = `${c} was dealing with ${ctx}. The real hurdle was ${con}, so ${clx}. The takeaway: ${clo}.`;
  const fortyFive = `I was just working with ${c}. They were dealing with ${ctx}.\n\nThe real issue wasn't just the product — it was that ${con}.\n\nWe realized that, so ${clx}. The takeaway here is that ${clo}.`;

  return { fifteen, fortyFive };
}

export function buildStoryContextPrefix(story: StoryNarrative): string {
  return `[BELOW IS ADDITIONAL BUYER BACKGROUND CONTEXT — USE THIS TO FLAVOR THE RESPONSES]
The buyer is ${story.character}. They have been dealing with ${story.context}. The key frustration is ${story.conflict}. They recently experienced a turning point: ${story.climax}. The underlying principle they care about is ${story.closure}.`;
}

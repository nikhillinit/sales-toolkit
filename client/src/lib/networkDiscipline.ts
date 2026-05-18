export const NETWORK_LOG_STORAGE_KEY = 'restless_network_logs_v01';

export const NETWORK_GEARS = [
  { id: 'oldWarm', day: 'Mon', label: 'Old Warm', target: 3, prompt: 'Dormant contacts. Text, no ask.' },
  { id: 'newWarm', day: 'Tue', label: 'New Warm', target: 2, prompt: 'Recent intros within 72 hours.' },
  { id: 'coldIn', day: 'Wed', label: 'Cold In', target: 5, prompt: 'Named, researched by hand.' },
  { id: 'giveFirst', day: 'Thu', label: 'Give First', target: 1, prompt: 'Send something useful before asking.' },
  { id: 'inPerson', day: 'Fri', label: 'In Person', target: 1, prompt: 'One live room, visit, or face-to-face moment.' },
] as const;

export type NetworkGearId = (typeof NETWORK_GEARS)[number]['id'];

export interface NetworkLog {
  id: string;
  gear: NetworkGearId;
  contactName: string;
  community: string;
  createdAt: string;
}

export type NetworkCounts = Record<NetworkGearId, number>;

export function makeNetworkLogId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `network-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getWeekStart(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);

  return start;
}

export function isCurrentWeekLog(log: NetworkLog, now = new Date()): boolean {
  const createdAt = new Date(log.createdAt);
  if (Number.isNaN(createdAt.getTime())) return false;

  const weekStart = getWeekStart(now);
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(weekStart.getDate() + 7);

  return createdAt >= weekStart && createdAt < nextWeekStart;
}

export function getCurrentWeekLogs(logs: NetworkLog[], now = new Date()): NetworkLog[] {
  return logs
    .filter(log => isCurrentWeekLog(log, now))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getNetworkCounts(logs: NetworkLog[]): NetworkCounts {
  return NETWORK_GEARS.reduce((counts, gear) => {
    counts[gear.id] = logs.filter(log => log.gear === gear.id).length;
    return counts;
  }, {} as NetworkCounts);
}

export function parseNetworkLogs(raw: string | null): NetworkLog[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is NetworkLog => {
      if (!item || typeof item !== 'object') return false;

      const log = item as Partial<NetworkLog>;
      return (
        typeof log.id === 'string' &&
        NETWORK_GEARS.some(gear => gear.id === log.gear) &&
        typeof log.contactName === 'string' &&
        typeof log.community === 'string' &&
        typeof log.createdAt === 'string'
      );
    });
  } catch {
    return [];
  }
}

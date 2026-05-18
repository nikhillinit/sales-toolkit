import { describe, expect, it } from 'vitest';
import {
  getCurrentWeekLogs,
  getNetworkCounts,
  getWeekStart,
  parseNetworkLogs,
  type NetworkLog,
} from './networkDiscipline';

describe('networkDiscipline', () => {
  it('uses Monday as the start of the week', () => {
    const start = getWeekStart(new Date('2026-05-20T12:00:00.000Z'));

    expect(start.getDay()).toBe(1);
    expect(start.toISOString().slice(0, 10)).toBe('2026-05-18');
  });

  it('filters logs to the current Monday-Sunday week and sorts newest first', () => {
    const logs: NetworkLog[] = [
      { id: 'old', gear: 'oldWarm', contactName: 'Old', community: 'A', createdAt: '2026-05-17T12:00:00.000Z' },
      { id: 'mon', gear: 'oldWarm', contactName: 'Monday', community: 'B', createdAt: '2026-05-18T12:00:00.000Z' },
      { id: 'fri', gear: 'inPerson', contactName: 'Friday', community: 'C', createdAt: '2026-05-22T12:00:00.000Z' },
      { id: 'next', gear: 'newWarm', contactName: 'Next', community: 'D', createdAt: '2026-05-25T12:00:00.000Z' },
    ];

    expect(getCurrentWeekLogs(logs, new Date('2026-05-20T12:00:00.000Z')).map(log => log.id)).toEqual([
      'fri',
      'mon',
    ]);
  });

  it('counts logs by gear', () => {
    const logs: NetworkLog[] = [
      { id: '1', gear: 'oldWarm', contactName: 'A', community: 'X', createdAt: '2026-05-18T12:00:00.000Z' },
      { id: '2', gear: 'oldWarm', contactName: 'B', community: 'Y', createdAt: '2026-05-18T13:00:00.000Z' },
      { id: '3', gear: 'coldIn', contactName: 'C', community: 'Z', createdAt: '2026-05-20T13:00:00.000Z' },
    ];

    expect(getNetworkCounts(logs)).toMatchObject({
      oldWarm: 2,
      newWarm: 0,
      coldIn: 1,
      giveFirst: 0,
      inPerson: 0,
    });
  });

  it('falls back to an empty list for corrupt storage', () => {
    expect(parseNetworkLogs('{bad json')).toEqual([]);
    expect(parseNetworkLogs(JSON.stringify({ logs: [] }))).toEqual([]);
  });
});

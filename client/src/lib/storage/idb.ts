/**
 * IDB primitives — thin wrappers around idb-keyval for atomic, error-safe
 * IndexedDB access. All array mutations MUST use idbUpdate to avoid
 * read-modify-write races within a single tab.
 *
 * NOTE: idb-keyval's update() is atomic within a single tab (single IDB
 * transaction). Two concurrent tabs writing the same key will have the second
 * write win. This is acceptable for a solo-user, local-first app. The
 * BroadcastChannel sync in useBroadcastSync mitigates most multi-tab cases.
 * Document this in ARCHITECTURE.md.
 */
import { del, entries, get, set, update } from 'idb-keyval';

export async function idbGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await get<T>(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  await set(key, value);
}

export async function idbUpdate<T>(
  key: string,
  updater: (value: T | undefined) => T,
): Promise<void> {
  await update(key, updater);
}

export async function idbDel(key: string): Promise<void> {
  await del(key);
}

export async function idbExport(prefix = 'fieldkit:v1:'): Promise<Record<string, unknown>> {
  const allEntries = await entries();
  return Object.fromEntries(
    allEntries.filter(([key]) => typeof key === 'string' && (key as string).startsWith(prefix)),
  );
}

export async function idbClear(prefix = 'fieldkit:v1:'): Promise<void> {
  const allEntries = await entries();
  await Promise.all(
    allEntries
      .filter(([key]) => typeof key === 'string' && (key as string).startsWith(prefix))
      .map(([key]) => del(key)),
  );
}

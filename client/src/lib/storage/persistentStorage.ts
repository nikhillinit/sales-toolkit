/**
 * Persistent storage request helper.
 *
 * IMPORTANT: Call this ONLY from a user-triggered action (e.g., Settings button click).
 * Browsers require a user gesture for navigator.storage.persist().
 *
 * On iOS Safari, browser storage may be cleared after ~7 days of inactivity
 * (Intelligent Tracking Prevention). This is best-effort. Export data periodically.
 */
export async function requestPersistentStorage(): Promise<{
  supported: boolean;
  persisted: boolean;
  requested: boolean;
}> {
  if (!navigator.storage?.persisted || !navigator.storage?.persist) {
    return { supported: false, persisted: false, requested: false };
  }

  const alreadyPersisted = await navigator.storage.persisted();
  if (alreadyPersisted) {
    return { supported: true, persisted: true, requested: false };
  }

  const granted = await navigator.storage.persist();

  return {
    supported: true,
    persisted: granted,
    requested: true,
  };
}

export async function getStorageEstimate(): Promise<{
  quota: number | null;
  usage: number | null;
  percentUsed: number | null;
}> {
  if (!navigator.storage?.estimate) {
    return { quota: null, usage: null, percentUsed: null };
  }
  try {
    const { quota, usage } = await navigator.storage.estimate();
    const q = quota ?? null;
    const u = usage ?? null;
    const pct = q && u ? Math.round((u / q) * 100) : null;
    return { quota: q, usage: u, percentUsed: pct };
  } catch {
    return { quota: null, usage: null, percentUsed: null };
  }
}

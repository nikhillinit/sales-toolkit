/**
 * AppDataGate — blocks rendering until all IDB slices have hydrated.
 *
 * This prevents a flash of default state before persisted data loads.
 * Shows a minimal loading indicator while waiting.
 *
 * Usage: wrap the Router inside AppDataGate in App.tsx.
 */
import { useEffect, useState } from 'react';
import { idbGet } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { runMigrations } from '@/lib/storage/migrations';

interface AppDataGateProps {
  children: React.ReactNode;
}

export function AppDataGate({ children }: AppDataGateProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // Run migrations (non-destructive, idempotent)
        await runMigrations();

        // Warm the IDB cache for the most critical slices
        await Promise.all([
          idbGet(STORAGE_KEYS.storyVault, []),
          idbGet(STORAGE_KEYS.trials, []),
          idbGet(STORAGE_KEYS.stats, {}),
          idbGet(STORAGE_KEYS.uiProgress, {}),
        ]);

        setReady(true);
      } catch (err) {
        // Degrade gracefully — app still works without IDB
        console.warn('[AppDataGate] IDB init failed, running in degraded mode:', err);
        setError(String(err));
        setReady(true);
      }
    }

    void init();
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100dvh',
          background: '#F4F1EA',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#4A5159',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    // Degraded mode banner — app still renders
    return (
      <>
        <div
          style={{
            background: '#FFF8E1',
            borderBottom: '2px solid #B45309',
            padding: '8px 16px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 700,
            color: '#B45309',
            letterSpacing: '0.06em',
          }}
        >
          STORAGE UNAVAILABLE — Data will not persist this session.
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}

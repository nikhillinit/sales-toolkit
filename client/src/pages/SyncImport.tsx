/**
 * SyncImport — receives a base64-encoded activation payload from the offline
 * HTML toolkit and lets the rep review + import into IndexedDB Trials.
 *
 * Inbound URL shape (built by scripts/offline-runtime.html → buildSyncUrl):
 *   /api/sync?payload=<base64url(JSON)>
 *
 * Payload shape (v1):
 *   {
 *     v: 1,
 *     source: 'offline-html',
 *     generatedAt: <ISO string>,
 *     activations: Array<{
 *       id: number, savedAt: string,
 *       namedHuman?, currentRoutine?, realUseWindow?, buyerNamedRisk?,
 *       trialReviewType?, uniqueCode?, followup?, binaryRoute?: string
 *     }>
 *   }
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { idbGet, idbSet } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { Trial } from '@/contexts/app-state/types';

interface OfflineActivation {
  id?: number;
  savedAt?: string;
  namedHuman?: string;
  currentRoutine?: string;
  realUseWindow?: string;
  buyerNamedRisk?: string;
  trialReviewType?: string;
  uniqueCode?: string;
  followup?: string;
  binaryRoute?: string;
}

interface SyncPayload {
  v: number;
  source?: string;
  generatedAt?: string;
  activations: OfflineActivation[];
}

type ParseState =
  | { kind: 'idle' }
  | { kind: 'parsing' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; payload: SyncPayload }
  | { kind: 'done'; imported: number };

function b64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function activationToTrial(a: OfflineActivation, index: number): Trial {
  const now = new Date().toISOString();
  // Stable id: prefer the offline-generated timestamp id; fall back to a
  // deterministic offset so two activations imported in the same batch never
  // collide.
  const id = typeof a.id === 'number' ? a.id : Date.now() + index;
  return {
    id,
    acct: '',
    human: a.namedHuman ?? '',
    routine: a.currentRoutine ?? '',
    window: a.realUseWindow ?? '',
    risk: a.buyerNamedRisk ?? '',
    type: '',
    typeLabel: a.trialReviewType ?? '',
    fuDate: a.followup ?? '',
    fuChan: '',
    code: a.uniqueCode ?? '',
    binary: a.binaryRoute ?? '',
    yesRoute: '',
    noRoute: '',
    status: 'shipped',
    cadenceStep: 0,
    cadenceCompletedAt: [],
    shippedAt: a.savedAt ?? now,
  };
}

export default function SyncImport() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<ParseState>({ kind: 'idle' });

  // Parse the payload once on mount.
  useEffect(() => {
    setState({ kind: 'parsing' });
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('payload');
      if (!raw) {
        setState({ kind: 'error', message: 'Missing ?payload= parameter. Open this URL from the Sync link in the offline FieldKit.' });
        return;
      }
      const json = b64UrlDecode(raw);
      const parsed = JSON.parse(json) as SyncPayload;
      if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.activations)) {
        setState({ kind: 'error', message: 'Payload format not recognised (expected v1 schema).' });
        return;
      }
      setState({ kind: 'ready', payload: parsed });
    } catch (e) {
      setState({ kind: 'error', message: 'Payload could not be decoded. The sync link may be truncated.' });
    }
  }, []);

  const activations = useMemo(
    () => (state.kind === 'ready' ? state.payload.activations : []),
    [state],
  );

  async function handleImport() {
    if (state.kind !== 'ready') return;
    const existing = await idbGet<Trial[]>(STORAGE_KEYS.trials, []);
    const existingIds = new Set(existing.map(t => t.id));
    const incoming = activations
      .map((a, i) => activationToTrial(a, i))
      .filter(t => !existingIds.has(t.id));
    const next = [...existing, ...incoming];
    await idbSet(STORAGE_KEYS.trials, next);
    setState({ kind: 'done', imported: incoming.length });
  }

  return (
    <div style={{
      maxWidth: 640, margin: '40px auto', padding: '0 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#1A1D22',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase',
        color: '#A82820', marginBottom: 8,
      }}>
        Restless FieldKit · Cloud sync
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 16px' }}>Import offline activations</h1>

      {state.kind === 'parsing' && <p>Decoding payload…</p>}

      {state.kind === 'error' && (
        <div style={{
          background: '#F6DAD6', border: '1px solid #A82820', color: '#1A1D22',
          padding: '14px 16px', borderRadius: 6, lineHeight: 1.5,
        }}>
          <strong style={{ color: '#A82820' }}>Could not read sync link</strong>
          <p style={{ margin: '6px 0 0' }}>{state.message}</p>
        </div>
      )}

      {state.kind === 'ready' && (
        <>
          <p style={{ color: '#3F4A55', lineHeight: 1.5 }}>
            {activations.length} activation{activations.length === 1 ? '' : 's'} found
            {state.payload.generatedAt ? <> · captured {new Date(state.payload.generatedAt).toLocaleString()}</> : null}.
            Review below, then import into your active trial pipeline.
          </p>

          <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activations.map((a, i) => (
              <div key={a.id ?? i} style={{
                border: '1px solid #C8CCD2', background: '#F4F1EA', borderRadius: 6,
                padding: '12px 14px',
              }}>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  color: '#A82820', letterSpacing: '.1em', textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                  {a.savedAt ? new Date(a.savedAt).toLocaleString() : `Entry ${i + 1}`}
                </div>
                <strong>{a.namedHuman || 'Unnamed buyer'}</strong>
                <div style={{ fontSize: 13, color: '#3F4A55', marginTop: 4, lineHeight: 1.5 }}>
                  {a.trialReviewType ? <>{a.trialReviewType} · </> : null}
                  {a.realUseWindow || '—'}
                  {a.uniqueCode ? <> · code <code>{a.uniqueCode}</code></> : null}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleImport}
              style={{
                background: '#A82820', color: '#fff', border: 'none', borderRadius: 4,
                padding: '10px 18px', fontWeight: 700, fontSize: 12, letterSpacing: '.06em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Import {activations.length} into trials
            </button>
            <button
              onClick={() => setLocation('/os/prepare')}
              style={{
                background: 'transparent', color: '#A82820', border: '1px solid #A82820',
                borderRadius: 4, padding: '10px 18px', fontWeight: 700, fontSize: 12,
                letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {state.kind === 'done' && (
        <div style={{
          background: '#D8ECD9', border: '1px solid #2E7D32', borderRadius: 6,
          padding: '14px 16px', lineHeight: 1.5,
        }}>
          <strong style={{ color: '#2E7D32' }}>✓ Imported {state.imported} activation{state.imported === 1 ? '' : 's'}.</strong>
          <p style={{ margin: '6px 0 14px' }}>
            They are now in your trials list. Duplicates (matching id) were skipped.
          </p>
          <button
            onClick={() => setLocation('/os/activate')}
            style={{
              background: '#A82820', color: '#fff', border: 'none', borderRadius: 4,
              padding: '10px 18px', fontWeight: 700, fontSize: 12, letterSpacing: '.06em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Open trials
          </button>
        </div>
      )}
    </div>
  );
}

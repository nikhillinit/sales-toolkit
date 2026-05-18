/**
 * DraftBanner — Unified Signal OS
 * Appears when a session draft exists. Restore or discard.
 */
import { useAppState } from '@/contexts/AppState';

export default function DraftBanner() {
  const { hasDraft, restoreDraft, discardDraft, toast } = useAppState();

  if (!hasDraft) return null;

  return (
    <div
      style={{
        background: '#FBF8F1',
        borderBottom: '1px solid #C8CCD2',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '12px',
      }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#4A5159' }}>
        📋 Unsaved session draft found
      </span>
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={() => {
            const ok = restoreDraft();
            toast(ok ? 'Draft restored.' : 'Draft corrupted. Starting fresh.');
          }}
          style={{
            padding: '5px 10px',
            background: '#A82820',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Restore
        </button>
        <button
          onClick={() => {
            discardDraft();
            toast('Draft discarded.');
          }}
          style={{
            padding: '5px 10px',
            background: 'transparent',
            color: '#A82820',
            border: '1px solid #A82820',
            borderRadius: '3px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
}

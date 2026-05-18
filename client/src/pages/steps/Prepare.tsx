/**
 * Step 01 — Prepare
 * Pre-call checklist. Rep must check all 3 boxes before proceeding.
 * Unified Signal OS design system.
 */
import { useDraftActions, useDraftState, useToastActions, useUiActions } from '@/contexts/AppState';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

const CHECKLIST = [
  { id: 'prep-obj',   label: 'Objective clear: what am I asking for today?' },
  { id: 'prep-route', label: 'Route confirmed: named human, station, or gym.' },
  { id: 'prep-exit',  label: 'Clean exit ready: I know how to walk away.' },
];

const PREP_NOTES_KEY = 'prep-notes';

export default function Prepare() {
  const { formDraft } = useDraftState();
  const { updateFormDraft, saveDraft } = useDraftActions();
  const { markStepComplete } = useUiActions();
  const { toast } = useToastActions();
  const [, setLocation] = useLocation();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Restore from draft
  useEffect(() => {
    const draft = formDraft;
    const restoredChecked: Record<string, boolean> = {};
    CHECKLIST.forEach(item => {
      if (typeof draft[item.id] === 'boolean') restoredChecked[item.id] = draft[item.id] as boolean;
    });
    setChecked(restoredChecked);
    if (typeof draft[PREP_NOTES_KEY] === 'string') setNotes(draft[PREP_NOTES_KEY] as string);
  }, []);

  const allChecked = CHECKLIST.every(item => checked[item.id]);

  const handleCheck = (id: string, val: boolean) => {
    const next = { ...checked, [id]: val };
    setChecked(next);
    updateFormDraft({ [id]: val });
  };

  const handleProceed = () => {
    if (!allChecked) return;
    markStepComplete('prepare');
    saveDraft();
    setLocation('/os/qualify');
    toast('Prepare complete. Proceeding to Qualify.');
  };

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Step 01 · Prepare</div>
        <h2
          className="os-h1"
          style={{ color: '#1A1D22', marginBottom: '4px' }}
        >
          Pre-Call <span style={{ color: '#A82820' }}>Checklist</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: 0 }}>
          Three boxes. All three checked before you dial or walk in.
        </p>
      </div>

      {/* Checklist */}
      <div style={{ marginBottom: '16px' }}>
        {CHECKLIST.map(item => (
          <label
            key={item.id}
            className="os-checkbox-row"
            htmlFor={item.id}
          >
            <input
              type="checkbox"
              id={item.id}
              checked={!!checked[item.id]}
              onChange={e => handleCheck(item.id, e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                flexShrink: 0,
                accentColor: '#A82820',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '14px', lineHeight: 1.4 }}>{item.label}</span>
          </label>
        ))}
      </div>

      {/* Progress indicator */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#4A5159',
          textAlign: 'center',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {Object.values(checked).filter(Boolean).length}/{CHECKLIST.length} complete
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '16px' }}>
        <label className="os-label" htmlFor="prep-notes">
          Call notes (optional)
        </label>
        <textarea
          id="prep-notes"
          value={notes}
          onChange={e => {
            setNotes(e.target.value);
            updateFormDraft({ [PREP_NOTES_KEY]: e.target.value });
          }}
          onBlur={() => saveDraft()}
          placeholder="Account name, contact, key context..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #C8CCD2',
            background: '#FBF8F1',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '14px',
            borderRadius: '3px',
            resize: 'vertical',
            color: '#1A1D22',
          }}
        />
      </div>

      {/* Proceed button */}
      <button
        onClick={handleProceed}
        disabled={!allChecked}
        style={{
          width: '100%',
          padding: '14px',
          background: allChecked ? '#A82820' : '#C8CCD2',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          cursor: allChecked ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s',
          minHeight: '52px',
        }}
      >
        {allChecked ? 'Proceed to Qualify →' : 'Check all three to proceed'}
      </button>

      {/* Warn box */}
      <div className="os-warn" style={{ marginTop: '16px' }}>
        <strong>Miss the floor Monday, week's behind.</strong> Report the miss — don't hide it.
      </div>
    </div>
  );
}

/**
 * Step 02 — Qualify
 * Four-Gear Protocol. Lock gears to proceed to Activation.
 * Unified Signal OS design system.
 */
import { useDraftActions, useDraftState, useStatsActions, useToastActions, useUiActions, useUiState } from '@/contexts/AppState';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

const GEARS = [
  {
    id: 'g1',
    num: '1',
    label: 'Named Pain',
    prompt: '"Where does the current routine fall short?"',
    placeholder: 'e.g. Crew hits a wall at hour 3 on overnights...',
  },
  {
    id: 'g2',
    num: '2',
    label: 'Access',
    prompt: '"Who decides what the crew tries?"',
    placeholder: 'e.g. Sgt. Ramirez, MWR coordinator...',
  },
  {
    id: 'g3',
    num: '3',
    label: 'Trial Fit',
    prompt: '"Where would a small trial be tested?"',
    placeholder: 'e.g. Station table, pre-PT, 0530 3x/week...',
  },
  {
    id: 'g4',
    num: '4',
    label: 'Feedback Loop',
    prompt: '"Who will tell me if it flopped?"',
    placeholder: 'e.g. Sgt. Ramirez will text me after weekend ruck...',
  },
];

export default function Qualify() {
  const { gearsLocked } = useUiState();
  const { setGearsLocked, markStepComplete } = useUiActions();
  const { modStat } = useStatsActions();
  const { formDraft } = useDraftState();
  const { updateFormDraft, saveDraft } = useDraftActions();
  const { toast } = useToastActions();
  const [, setLocation] = useLocation();
  const [gearValues, setGearValues] = useState<Record<string, string>>({});
  const locked = gearsLocked;

  // Restore from draft
  useEffect(() => {
    const draft = formDraft;
    const restored: Record<string, string> = {};
    GEARS.forEach(g => {
      if (typeof draft[g.id] === 'string') restored[g.id] = draft[g.id] as string;
    });
    setGearValues(restored);
  }, []);

  const handleChange = (id: string, val: string) => {
    if (locked) return;
    const next = { ...gearValues, [id]: val };
    setGearValues(next);
    updateFormDraft({ [id]: val });
  };

  const allFilled = GEARS.every(g => gearValues[g.id]?.trim());

  const handleLockGears = () => {
    if (!gearValues['g1']?.trim()) {
      toast('⚠️ Fill out Gear 1 (Named Pain) first.');
      return;
    }
    setGearsLocked(true);
    markStepComplete('prepare');
    markStepComplete('qualify');
    modStat('qual', 1);
    saveDraft();
    setLocation('/os/activate');
    toast('Gears Locked. Proceed to Activation Standard.');
  };

  const handleHonestOut = () => {
    // Clear gear fields
    const cleared: Record<string, string> = {};
    GEARS.forEach(g => { cleared[g.id] = ''; });
    setGearValues(cleared);
    updateFormDraft(cleared);
    setGearsLocked(false);
    modStat('exit', 1);
    saveDraft();
    toast('Clean Exit Logged.');
  };

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Step 02 · Qualify</div>
        <h2 className="os-h1">
          Four-Gear <span style={{ color: '#A82820' }}>Protocol</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: 0 }}>
          All four gears pass → proceed. Any "no" → honest exit.
        </p>
      </div>

      {/* Gear lock status */}
      {locked && (
        <div
          style={{
            background: '#F0FDF4',
            borderLeft: '3px solid #2E7D32',
            padding: '10px 12px',
            fontSize: '13px',
            marginBottom: '12px',
            borderRadius: '0 3px 3px 0',
          }}
        >
          <strong style={{ color: '#2E7D32' }}>✓ Gears Locked</strong> — fields are read-only. Activation Standard unlocked.
        </div>
      )}

      {/* Four gears */}
      {GEARS.map((gear, idx) => (
        <div
          key={gear.id}
          style={{
            background: '#fff',
            border: '1px solid #C8CCD2',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div
              style={{
                background: '#A82820',
                color: '#fff',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              {gear.num}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '15px',
                  textTransform: 'uppercase',
                  color: '#1A1D22',
                }}
              >
                {gear.label}
              </div>
              <div
                style={{
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: '#4A5159',
                  marginTop: '2px',
                }}
              >
                {gear.prompt}
              </div>
            </div>
          </div>
          <textarea
            id={gear.id}
            value={gearValues[gear.id] || ''}
            onChange={e => handleChange(gear.id, e.target.value)}
            onBlur={() => saveDraft()}
            disabled={locked}
            placeholder={gear.placeholder}
            rows={2}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #C8CCD2',
              background: locked ? '#EFEBE0' : '#FBF8F1',
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '13px',
              borderRadius: '3px',
              resize: 'vertical',
              color: locked ? '#4A5159' : '#1A1D22',
            }}
          />
          {idx < GEARS.length - 1 && (
            <div style={{ textAlign: 'center', color: '#8A6A14', fontSize: '14px', fontWeight: 'bold', marginTop: '6px' }}>↓</div>
          )}
        </div>
      ))}

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
        <button
          onClick={handleHonestOut}
          style={{
            padding: '12px',
            background: 'transparent',
            color: '#A82820',
            border: '1px solid #A82820',
            borderRadius: '3px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: 'pointer',
            minHeight: '48px',
          }}
        >
          Honest Exit
        </button>
        <button
          id="btn-lock-gears"
          onClick={handleLockGears}
          disabled={locked}
          style={{
            padding: '12px',
            background: locked ? '#C8CCD2' : '#A82820',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: locked ? 'not-allowed' : 'pointer',
            minHeight: '48px',
          }}
        >
          {locked ? 'Gears Locked ✓' : 'Lock Gears →'}
        </button>
      </div>

      {/* Warning */}
      <div className="os-warn" style={{ marginTop: '14px' }}>
        <strong>Four pass → complete Activation Standard.</strong> Any "no" → thank, exit clean, code it. Do not treat a good conversation as permission to send product.
      </div>
    </div>
  );
}

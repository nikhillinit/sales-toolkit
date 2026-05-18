/**
 * Step 03 — Activate
 * 8-field Activation Standard. All 8 required before ship.
 * Unified Signal OS design system.
 */
import { useAppState, type Trial } from '@/contexts/AppState';
import { useEffect, useState } from 'react';

interface FieldDef {
  id: string;
  label: string;
  example: string;
  type?: 'text' | 'textarea' | 'select' | 'date';
  options?: { value: string; label: string }[];
  required: boolean;
}

const ACTIVATION_FIELDS: FieldDef[] = [
  { id: 'act-acct',    label: 'Account / Station',     example: 'e.g. Station 12, MWR Fort Bragg',                    type: 'text',     required: true },
  { id: 'act-human',   label: 'Named Human',            example: 'e.g. Sgt. Ramirez, MWR coordinator',                type: 'text',     required: true },
  { id: 'act-routine', label: 'Current Routine',        example: 'e.g. Crew buys energy drinks out of pocket',        type: 'textarea', required: true },
  { id: 'act-window',  label: 'Real Use Window',        example: 'e.g. Pre-PT, 0530, 3x/week',                        type: 'text',     required: true },
  { id: 'act-risk',    label: 'Buyer-Named Risk',       example: 'e.g. Sgt. Ramirez worried crew will mock it',       type: 'textarea', required: true },
  {
    id: 'act-type', label: 'Trial Type', example: '',
    type: 'select',
    options: [
      { value: 'station_table', label: 'Station Table (5 sticks)' },
      { value: 'crew_box',      label: 'Crew Box (20 sticks)' },
      { value: 'coach_only',    label: 'Coach-Only Kit (5 sticks)' },
      { value: 'squad_kit',     label: 'Squad Kit (1 box / 12 crew)' },
    ],
    required: true,
  },
  { id: 'act-fudate',  label: 'Follow-Up Date',         example: 'e.g. Monday after weekend ruck',                    type: 'date',     required: true },
  { id: 'act-fuchan',  label: 'Follow-Up Channel',      example: 'e.g. Text, call, in-person',                        type: 'text',     required: true },
  { id: 'act-code',    label: 'Unique Trial Code',      example: 'e.g. MRZ-0526-A',                                   type: 'text',     required: true },
  { id: 'act-binary',  label: 'Binary Success Question', example: 'e.g. If 8+ say yes, I\'ll bring the PO.',          type: 'textarea', required: true },
];

const OPTIONAL_FIELDS: FieldDef[] = [
  { id: 'act-yes-route', label: 'Route on YES',  example: 'e.g. PO, reorder, referral to captain', type: 'text', required: false },
  { id: 'act-no-route',  label: 'Route on NO',   example: 'e.g. Thank, exit, code it, check back in 60 days', type: 'text', required: false },
];

const ALL_REQUIRED_IDS = ACTIVATION_FIELDS.filter(f => f.required).map(f => f.id);

export default function Activate() {
  const { state, addTrial, markStepComplete, modStat, setGearsLocked, updateFormDraft, saveDraft, switchStep, toast } = useAppState();
  const [values, setValues] = useState<Record<string, string>>({});

  // Restore from draft
  useEffect(() => {
    const draft = state.formDraft;
    const restored: Record<string, string> = {};
    [...ACTIVATION_FIELDS, ...OPTIONAL_FIELDS].forEach(f => {
      if (typeof draft[f.id] === 'string') restored[f.id] = draft[f.id] as string;
    });
    setValues(restored);
  }, []);

  const filledCount = ALL_REQUIRED_IDS.filter(id => values[id]?.trim()).length;
  const allFilled = filledCount === ALL_REQUIRED_IDS.length;

  const handleChange = (id: string, val: string) => {
    const next = { ...values, [id]: val };
    setValues(next);
    updateFormDraft({ [id]: val });
  };

  const handleSave = () => {
    if (!allFilled) {
      toast('⚠️ Complete all required Activation Standard fields.');
      return;
    }

    const typeField = ACTIVATION_FIELDS.find(f => f.id === 'act-type');
    const typeOption = typeField?.options?.find(o => o.value === values['act-type']);

    const trial: Trial = {
      id: Date.now(),
      acct: values['act-acct'] || '',
      human: values['act-human'] || '',
      routine: values['act-routine'] || '',
      window: values['act-window'] || '',
      risk: values['act-risk'] || '',
      type: values['act-type'] || '',
      typeLabel: typeOption?.label || values['act-type'] || '',
      fuDate: values['act-fudate'] || '',
      fuChan: values['act-fuchan'] || '',
      code: values['act-code'] || '',
      binary: values['act-binary'] || '',
      yesRoute: values['act-yes-route'] || '',
      noRoute: values['act-no-route'] || '',
      status: 'shipped',
    };

    addTrial(trial);
    markStepComplete('activate');
    modStat('ship', 1);

    // Clear form
    const cleared: Record<string, string> = {};
    [...ACTIVATION_FIELDS, ...OPTIONAL_FIELDS].forEach(f => { cleared[f.id] = ''; });
    setValues(cleared);
    updateFormDraft(cleared);

    // Unlock gears for next call
    setGearsLocked(false);
    saveDraft();
    switchStep('followup');
    toast(`✅ Code ${trial.code} Shipped & Pipeline Saved.`);
  };

  const renderField = (field: FieldDef) => {
    const val = values[field.id] || '';
    const baseStyle: React.CSSProperties = {
      width: '100%',
      padding: '10px',
      border: '1px solid #C8CCD2',
      background: '#FBF8F1',
      fontFamily: "'Source Sans 3', sans-serif",
      fontSize: '14px',
      borderRadius: '3px',
      color: '#1A1D22',
    };

    if (field.type === 'select') {
      return (
        <select
          id={field.id}
          value={val}
          onChange={e => handleChange(field.id, e.target.value)}
          onBlur={() => saveDraft()}
          style={{ ...baseStyle, cursor: 'pointer' }}
        >
          <option value="">Select trial type...</option>
          {field.options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.id}
          value={val}
          onChange={e => handleChange(field.id, e.target.value)}
          onBlur={() => saveDraft()}
          placeholder={field.example}
          rows={2}
          style={{ ...baseStyle, resize: 'vertical' }}
        />
      );
    }

    if (field.type === 'date') {
      return (
        <input
          type="date"
          id={field.id}
          value={val}
          onChange={e => handleChange(field.id, e.target.value)}
          onBlur={() => saveDraft()}
          style={baseStyle}
        />
      );
    }

    return (
      <input
        type="text"
        id={field.id}
        value={val}
        onChange={e => handleChange(field.id, e.target.value)}
        onBlur={() => saveDraft()}
        placeholder={field.example}
        style={baseStyle}
      />
    );
  };

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Step 03 · Activate</div>
        <h2 className="os-h1">
          Activation <span style={{ color: '#A82820' }}>Standard</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: '0 0 8px' }}>
          Every trial leaving the building must check these fields. No blanks. No ship.
        </p>
        {/* Progress */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: '#4A5159',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {filledCount}/{ALL_REQUIRED_IDS.length} fields complete
        </div>
        {/* Progress bar */}
        <div style={{ height: '4px', background: '#C8CCD2', borderRadius: '2px', marginTop: '6px' }}>
          <div
            style={{
              height: '100%',
              width: `${(filledCount / ALL_REQUIRED_IDS.length) * 100}%`,
              background: allFilled ? '#2E7D32' : '#A82820',
              borderRadius: '2px',
              transition: 'width 0.3s ease-out',
            }}
          />
        </div>
      </div>

      {/* Gate status */}
      {!allFilled ? (
        <div className="os-gate-stop" style={{ marginBottom: '12px' }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#A82820',
            }}
          >
            ⛔ STOP — DO NOT SHIP
          </div>
          <div style={{ fontSize: '13px', marginTop: '4px', color: '#4A5159' }}>
            Complete all {ALL_REQUIRED_IDS.length} required fields first.
          </div>
        </div>
      ) : (
        <div className="os-gate-ready" style={{ marginBottom: '12px' }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#2E7D32',
            }}
          >
            ✓ READY TO SHIP
          </div>
          <div style={{ fontSize: '13px', marginTop: '4px', color: '#4A5159' }}>
            All required fields complete. Review and confirm below.
          </div>
        </div>
      )}

      {/* Required fields */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '4px',
          padding: '14px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#8A6A14',
            borderBottom: '1px solid #C8CCD2',
            paddingBottom: '6px',
            marginBottom: '12px',
          }}
        >
          Required Fields
        </div>
        {ACTIVATION_FIELDS.map(field => (
          <div key={field.id} style={{ marginBottom: '12px' }}>
            <label className="os-label" htmlFor={field.id}>
              {field.label} <span style={{ color: '#A82820' }}>*</span>
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Optional fields */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '4px',
          padding: '14px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#8A6A14',
            borderBottom: '1px solid #C8CCD2',
            paddingBottom: '6px',
            marginBottom: '12px',
          }}
        >
          Route Planning (Optional)
        </div>
        {OPTIONAL_FIELDS.map(field => (
          <div key={field.id} style={{ marginBottom: '12px' }}>
            <label className="os-label" htmlFor={field.id}>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Ship button */}
      <button
        onClick={handleSave}
        disabled={!allFilled}
        style={{
          width: '100%',
          padding: '14px',
          background: allFilled ? '#A82820' : '#C8CCD2',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          cursor: allFilled ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s',
          minHeight: '52px',
        }}
      >
        {allFilled ? '📦 Ship Trial & Save to Pipeline →' : 'Complete all fields to ship'}
      </button>

      {/* Rule reminder */}
      <div className="os-warn" style={{ marginTop: '14px' }}>
        <strong>Rule 01:</strong> Code before product. No code — no ship. Every trial gets a unique code.
      </div>
    </div>
  );
}

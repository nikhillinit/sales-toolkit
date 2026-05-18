/**
 * Step 03 — Activate
 * Activation Standard — grouped into 4 sections.
 * Unified Signal OS design system.
 */
import {
  useDraftActions,
  useDraftState,
  useStatsActions,
  useToastActions,
  useTrialActions,
  useUiActions,
  type Trial,
} from '@/contexts/AppState';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import PreShipGate from '@/components/PreShipGate';

interface FieldDef {
  id: string;
  label: string;
  example: string;
  type?: 'text' | 'textarea' | 'select' | 'date';
  options?: { value: string; label: string }[];
  required: boolean;
}

interface Section {
  key: string;
  title: string;
  fields: FieldDef[];
}

const SECTIONS: Section[] = [
  {
    key: 'who',
    title: '01 · WHO',
    fields: [
      { id: 'act-acct',  label: 'Account / Station', example: 'e.g. Station 12, MWR Fort Bragg',       type: 'text',     required: true },
      { id: 'act-human', label: 'Named Human',        example: 'e.g. Sgt. Ramirez, MWR coordinator',   type: 'text',     required: true },
    ],
  },
  {
    key: 'what',
    title: '02 · WHAT',
    fields: [
      { id: 'act-routine', label: 'Current Routine',  example: 'e.g. Crew buys energy drinks out of pocket',  type: 'textarea', required: true },
      { id: 'act-risk',    label: 'Buyer-Named Risk',  example: 'e.g. Sgt. Ramirez worried crew will mock it', type: 'textarea', required: true },
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
    ],
  },
  {
    key: 'when',
    title: '03 · WHEN',
    fields: [
      { id: 'act-window', label: 'Real Use Window',   example: 'e.g. Pre-PT, 0530, 3x/week',         type: 'text', required: true },
      { id: 'act-fudate', label: 'Follow-Up Date',    example: 'e.g. Monday after weekend ruck',      type: 'date', required: true },
      { id: 'act-fuchan', label: 'Follow-Up Channel', example: 'e.g. Text, call, in-person',          type: 'text', required: true },
    ],
  },
  {
    key: 'commit',
    title: '04 · COMMIT',
    fields: [
      { id: 'act-code',   label: 'Unique Trial Code',       example: 'e.g. MRZ-0526-A',                           type: 'text',     required: true },
      { id: 'act-binary', label: 'Binary Success Question',  example: "e.g. If 8+ say yes, I'll bring the PO.",    type: 'textarea', required: true },
    ],
  },
];

const OPTIONAL_FIELDS: FieldDef[] = [
  { id: 'act-yes-route', label: 'Route on YES', example: 'e.g. PO, reorder, referral to captain',              type: 'text', required: false },
  { id: 'act-no-route',  label: 'Route on NO',  example: 'e.g. Thank, exit, code it, check back in 60 days',  type: 'text', required: false },
];

const ALL_FIELDS: FieldDef[] = [...SECTIONS.flatMap(s => s.fields), ...OPTIONAL_FIELDS];
const ALL_REQUIRED_IDS = ALL_FIELDS.filter(f => f.required).map(f => f.id);

function FieldDot({ filled }: { filled: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: filled ? '#2E7D32' : '#C8CCD2',
        marginLeft: 5,
        verticalAlign: 'middle',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    />
  );
}

export default function Activate() {
  const { formDraft } = useDraftState();
  const { updateFormDraft, saveDraft } = useDraftActions();
  const { addTrial } = useTrialActions();
  const { markStepComplete, setGearsLocked } = useUiActions();
  const { modStat } = useStatsActions();
  const { toast } = useToastActions();
  const [, setLocation] = useLocation();
  const [values, setValues] = useState<Record<string, string>>({});
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    const restored: Record<string, string> = {};
    ALL_FIELDS.forEach(f => {
      if (typeof formDraft[f.id] === 'string') restored[f.id] = formDraft[f.id] as string;
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
    const typeField = SECTIONS.flatMap(s => s.fields).find(f => f.id === 'act-type');
    const typeOption = typeField?.options?.find(o => o.value === values['act-type']);

    const trial: Trial = {
      id: Date.now(),
      acct:      values['act-acct']      || '',
      human:     values['act-human']     || '',
      routine:   values['act-routine']   || '',
      window:    values['act-window']    || '',
      risk:      values['act-risk']      || '',
      type:      values['act-type']      || '',
      typeLabel: typeOption?.label       || values['act-type'] || '',
      fuDate:    values['act-fudate']    || '',
      fuChan:    values['act-fuchan']    || '',
      code:      values['act-code']      || '',
      binary:    values['act-binary']    || '',
      yesRoute:  values['act-yes-route'] || '',
      noRoute:   values['act-no-route']  || '',
      status:    'shipped',
    };

    addTrial(trial);
    markStepComplete('activate');
    modStat('ship', 1);

    const cleared: Record<string, string> = {};
    ALL_FIELDS.forEach(f => { cleared[f.id] = ''; });
    setValues(cleared);
    updateFormDraft(cleared);
    setGearsLocked(false);
    saveDraft();
    setLocation('/os/followup');
    toast(`✅ Code ${trial.code} Shipped & Pipeline Saved.`);
  };

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #C8CCD2',
    background: '#FBF8F1',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '14px',
    borderRadius: '3px',
    color: '#1A1D22',
    outline: 'none',
  };

  const renderField = (field: FieldDef) => {
    const val = values[field.id] || '';
    const filled = Boolean(val?.trim());
    const filledStyle: React.CSSProperties = filled
      ? { borderColor: '#2E7D32', background: '#F0FDF4' }
      : {};

    if (field.type === 'select') {
      return (
        <select
          id={field.id}
          value={val}
          onChange={e => handleChange(field.id, e.target.value)}
          onBlur={() => saveDraft()}
          style={{ ...baseInputStyle, ...filledStyle, cursor: 'pointer' }}
        >
          <option value="">Select trial type…</option>
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
          style={{ ...baseInputStyle, ...filledStyle, resize: 'vertical' }}
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
          style={{ ...baseInputStyle, ...filledStyle }}
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
        style={{ ...baseInputStyle, ...filledStyle }}
      />
    );
  };

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Step 03 · Activate</div>
        <h2 className="os-h1">
          Activation <span style={{ color: '#A82820' }}>Standard</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: '0 0 10px' }}>
          Every trial leaving the building must check these fields. No blanks. No ship.
        </p>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 5, background: '#C8CCD2', borderRadius: 3 }}>
            <div
              style={{
                height: '100%',
                width: `${(filledCount / ALL_REQUIRED_IDS.length) * 100}%`,
                background: allFilled ? '#2E7D32' : '#A82820',
                borderRadius: 3,
                transition: 'width 0.3s ease-out, background 0.3s',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 700,
              color: allFilled ? '#2E7D32' : '#4A5159',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              flexShrink: 0,
              transition: 'color 0.3s',
            }}
          >
            {filledCount}/{ALL_REQUIRED_IDS.length}
          </div>
        </div>

        {/* Ready banner — only when all fields are done */}
        {allFilled && (
          <div className="os-gate-ready" style={{ marginTop: '10px' }}>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#2E7D32',
              }}
            >
              ✓ READY TO SHIP
            </div>
            <div style={{ fontSize: '13px', marginTop: 2, color: '#4A5159' }}>
              All fields complete — confirm self-check below.
            </div>
          </div>
        )}
      </div>

      {/* Grouped required sections */}
      {SECTIONS.map(section => (
        <div
          key={section.key}
          style={{
            background: '#fff',
            border: '1px solid #C8CCD2',
            borderRadius: '4px',
            padding: '14px',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#8A6A14',
              letterSpacing: '0.06em',
              borderBottom: '1px solid #C8CCD2',
              paddingBottom: '6px',
              marginBottom: '12px',
            }}
          >
            {section.title}
          </div>
          {section.fields.map(field => (
            <div key={field.id} style={{ marginBottom: '12px' }}>
              <label
                className="os-label"
                htmlFor={field.id}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {field.label}
                {field.required && <span style={{ color: '#A82820', marginLeft: 2 }}>*</span>}
                <FieldDot filled={Boolean(values[field.id]?.trim())} />
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      ))}

      {/* Optional — Route Planning */}
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
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#8A6A14',
            letterSpacing: '0.06em',
            borderBottom: '1px solid #C8CCD2',
            paddingBottom: '6px',
            marginBottom: '12px',
          }}
        >
          05 · ROUTE PLANNING <span style={{ fontWeight: 400, color: '#4A5159' }}>(optional)</span>
        </div>
        {OPTIONAL_FIELDS.map(field => (
          <div key={field.id} style={{ marginBottom: '12px' }}>
            <label
              className="os-label"
              htmlFor={field.id}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {field.label}
              <FieldDot filled={Boolean(values[field.id]?.trim())} />
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Rule reminder */}
      <div className="os-warn" style={{ marginBottom: '80px' }}>
        <strong>Rule 01:</strong> Code before product. No code — no ship. Every trial gets a unique code.
      </div>

      {/* Sticky ship button */}
      <div
        style={{
          position: 'fixed',
          bottom: 64,
          left: 0,
          right: 0,
          padding: '10px 16px',
          background: 'rgba(244,241,234,0.95)',
          backdropFilter: 'blur(6px)',
          borderTop: '1px solid #C8CCD2',
          zIndex: 40,
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <button
          onClick={() => {
            if (!allFilled) {
              toast('⚠️ Complete all required Activation Standard fields.');
              return;
            }
            setGateOpen(true);
          }}
          style={{
            width: '100%',
            padding: '13px',
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
            transition: 'background 0.25s',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {allFilled ? (
            <>
              <span>📦</span>
              Ship Trial & Save to Pipeline →
            </>
          ) : (
            `${filledCount} / ${ALL_REQUIRED_IDS.length} fields — complete to ship`
          )}
        </button>
      </div>

      <PreShipGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        onShip={handleSave}
        trialAcct={values['act-acct']}
        trialCode={values['act-code']}
      />
    </div>
  );
}

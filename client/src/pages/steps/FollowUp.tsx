/**
 * Step 04 — Follow-Up
 * Active trial pipeline. Select trial, log outcome, copy CRM note.
 * Unified Signal OS design system.
 */
import { useDraftActions, useToastActions, useTrialActions, useTrialsState, useUiActions, type Trial } from '@/contexts/AppState';
import { useState } from 'react';

const OUTCOMES = [
  { value: 'yes_reorder', label: '✅ Yes — Reorder / PO' },
  { value: 'yes_soft',    label: '✅ Yes — Soft (needs follow-up)' },
  { value: 'no_use',      label: '❌ No — Didn\'t use it' },
  { value: 'no_taste',    label: '❌ No — Taste / preference' },
  { value: 'no_policy',   label: '❌ No — Policy / compliance' },
  { value: 'retest',      label: '🔄 Retest — Needs more time' },
  { value: 'referral',    label: '🔄 Referral — New contact' },
  { value: 'blocker',     label: '🚧 Blocker — Escalate' },
];

export default function FollowUp() {
  const trials = useTrialsState();
  const { closeTrial } = useTrialActions();
  const { markStepComplete } = useUiActions();
  const { saveDraft } = useDraftActions();
  const { toast } = useToastActions();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');

  const selectedTrial = trials.find(t => t.id === selectedId) ?? null;

  const handleClose = () => {
    if (!selectedId || !outcome) {
      toast('⚠️ Select a trial and outcome.');
      return;
    }
    closeTrial(selectedId, outcome);
    markStepComplete('followup');
    saveDraft();
    setSelectedId(null);
    setOutcome('');
    setNotes('');
    toast('Outcome Logged & Trial Closed.');
  };

  const handleCopyCRM = () => {
    if (!selectedTrial) { toast('Select a trial first.'); return; }
    const outcomeLabel = OUTCOMES.find(o => o.value === outcome)?.label || outcome || 'N/A';
    const text = `[TRIAL REVIEW]\nCode: ${selectedTrial.code}\nAccount: ${selectedTrial.acct}\nContact: ${selectedTrial.human}\nFeedback: ${outcomeLabel}\nNotes: ${notes}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => toast('Copied to Clipboard.'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('Copied to Clipboard.'); } catch { toast('Copy failed.'); }
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Step 04 · Follow-Up</div>
        <h2 className="os-h1">
          Active <span style={{ color: '#A82820' }}>Pipeline</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: 0 }}>
          {trials.length === 0
            ? 'No active trials. Ship one in Step 03.'
            : `${trials.length} active trial${trials.length > 1 ? 's' : ''} in pipeline.`}
        </p>
      </div>

      {trials.length === 0 ? (
        <div
          style={{
            background: '#FBF8F1',
            border: '1px solid #C8CCD2',
            borderRadius: '4px',
            padding: '32px 16px',
            textAlign: 'center',
            color: '#4A5159',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Pipeline Empty
          </div>
          <div style={{ fontSize: '13px' }}>
            Complete Activation Standard (Step 03) to add a trial.
          </div>
        </div>
      ) : (
        <>
          {/* Trial selector */}
          <div style={{ marginBottom: '12px' }}>
            <label className="os-label" htmlFor="os-active-select">Select Active Trial</label>
            <select
              id="os-active-select"
              value={selectedId ?? ''}
              onChange={e => setSelectedId(e.target.value ? Number(e.target.value) : null)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #C8CCD2',
                background: '#FBF8F1',
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '14px',
                borderRadius: '3px',
                color: '#1A1D22',
                cursor: 'pointer',
              }}
            >
              <option value="">Select active trial...</option>
              {trials.map(t => (
                <option key={t.id} value={t.id}>
                  {t.acct} — {t.human} [{t.code}]
                </option>
              ))}
            </select>
          </div>

          {/* Trial preview */}
          {selectedTrial && (
            <TrialPreview trial={selectedTrial} />
          )}

          {/* Outcome */}
          {selectedTrial && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label className="os-label" htmlFor="trial-outcome">Outcome</label>
                <select
                  id="trial-outcome"
                  value={outcome}
                  onChange={e => setOutcome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #C8CCD2',
                    background: '#FBF8F1',
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '14px',
                    borderRadius: '3px',
                    color: '#1A1D22',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select outcome...</option>
                  {OUTCOMES.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="os-label" htmlFor="trial-notes">Notes (optional)</label>
                <textarea
                  id="trial-notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Buyer quote, key feedback, next step..."
                  rows={2}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={handleCopyCRM}
                  style={{
                    padding: '12px',
                    background: 'transparent',
                    color: '#1A1D22',
                    border: '1px solid #C8CCD2',
                    borderRadius: '3px',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    minHeight: '48px',
                  }}
                >
                  📋 Copy CRM
                </button>
                <button
                  onClick={handleClose}
                  disabled={!outcome}
                  style={{
                    padding: '12px',
                    background: outcome ? '#A82820' : '#C8CCD2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: outcome ? 'pointer' : 'not-allowed',
                    minHeight: '48px',
                  }}
                >
                  Close Trial →
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function TrialPreview({ trial }: { trial: Trial }) {
  const fields = [
    ['Account', trial.acct],
    ['Named Human', trial.human],
    ['Routine', trial.routine],
    ['Use Window', trial.window],
    ['Buyer-Named Risk', trial.risk],
    ['Trial Type', trial.typeLabel],
    ['Follow-Up', `${trial.fuDate} via ${trial.fuChan}`],
    ['Code', trial.code],
    ['Binary Question', trial.binary],
    ...(trial.yesRoute ? [['Route on YES', trial.yesRoute]] : []),
    ...(trial.noRoute ? [['Route on NO', trial.noRoute]] : []),
  ];

  return (
    <div
      style={{
        background: '#FBF8F1',
        border: '1px solid #C8CCD2',
        borderRadius: '4px',
        padding: '12px',
        marginBottom: '12px',
        fontSize: '12px',
        lineHeight: 1.5,
      }}
    >
      {fields.map(([dt, dd]) => (
        <div key={dt} style={{ marginBottom: '4px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#4A5159',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginRight: '6px',
            }}
          >
            {dt}:
          </span>
          <span style={{ fontWeight: 600 }}>{dd}</span>
        </div>
      ))}
    </div>
  );
}

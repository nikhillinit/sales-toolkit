/**
 * Step 04 — Follow-Up
 * Active trial pipeline. Two tabs:
 *   1. Cadence — D+1/D+3/D+7/D+14/D+30 tracker (react-chrono vertical timeline)
 *   2. Log Outcome — select trial, log result, copy CRM note
 * Unified Signal OS / tactical-brutalist design system.
 */
import { Chrono } from 'react-chrono';
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

const CADENCE_STEPS = [
  { label: 'D+1',  day: 1,  title: 'Day-After Check',  note: 'Did they try it? First impression? Any friction?' },
  { label: 'D+3',  day: 3,  title: 'Three-Day Pulse',  note: 'Routine forming? Any questions from the crew?' },
  { label: 'D+7',  day: 7,  title: 'Week-One Review',  note: 'Binary question check. Yes/No/Retest decision.' },
  { label: 'D+14', day: 14, title: 'Two-Week Debrief', note: 'Full crew feedback. Route to reorder or clean exit.' },
  { label: 'D+30', day: 30, title: 'Month Close',      note: 'Final outcome. PO, referral, or coded exit.' },
];

type TabId = 'cadence' | 'outcome';

function CadenceTab() {
  const trials = useTrialsState();
  const { advanceCadence } = useTrialActions();
  const { toast } = useToastActions();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedTrial = trials.find(t => t.id === selectedId) ?? null;

  if (trials.length === 0) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: '#4A5159' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>No Active Trials</div>
        <p style={{ fontSize: '13px', margin: 0 }}>Ship a trial in Step 03 to start tracking cadence.</p>
      </div>
    );
  }

  const buildChronoItems = (trial: Trial) =>
    CADENCE_STEPS.map((step, idx) => {
      const isDone = trial.cadenceStep > idx;
      const isActive = trial.cadenceStep === idx;
      const completedAt = trial.cadenceCompletedAt[idx];
      return {
        title: step.label,
        cardTitle: step.title,
        cardSubtitle: isDone ? `Done ${completedAt ? new Date(completedAt).toLocaleDateString() : ''}` : isActive ? 'DUE NOW' : `Day +${step.day}`,
        cardDetailedText: step.note,
      };
    });

  const handleAdvance = () => {
    if (!selectedTrial) return;
    if (selectedTrial.cadenceStep >= 5) { toast('All steps complete. Log outcome in the Outcome tab.'); return; }
    advanceCadence(selectedTrial.id);
    toast(`✅ ${CADENCE_STEPS[selectedTrial.cadenceStep]?.label ?? 'Step'} marked complete.`);
  };

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <label className="os-label">Select Trial</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {trials.map(t => {
            const isSelected = t.id === selectedId;
            const stepLabel = t.cadenceStep >= 5 ? 'COMPLETE' : CADENCE_STEPS[t.cadenceStep]?.label ?? 'D+1';
            const stepColor = t.cadenceStep >= 5 ? '#2E7D32' : '#A82820';
            return (
              <button key={t.id} onClick={() => setSelectedId(isSelected ? null : t.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: isSelected ? '#1A1D22' : '#fff', color: isSelected ? '#F4F1EA' : '#1A1D22', border: `2px solid ${isSelected ? '#A82820' : '#C8CCD2'}`, borderRadius: '3px', cursor: 'pointer', textAlign: 'left', boxShadow: isSelected ? '3px 3px 0px #A82820' : '2px 2px 0px #C8CCD2', fontFamily: "'Source Sans 3', sans-serif" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{t.acct}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{t.human} · {t.code}</div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: isSelected ? '#F4F1EA' : stepColor, padding: '2px 6px', borderRadius: '2px', border: `1px solid ${isSelected ? '#A82820' : stepColor}`, textTransform: 'uppercase' }}>
                  {stepLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTrial && (
        <div style={{ background: '#fff', border: '2px solid #1A1D22', borderRadius: '3px', padding: '14px', marginBottom: '12px', boxShadow: '4px 4px 0px #1A1D22' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#8A6A14', letterSpacing: '0.06em', marginBottom: '12px', borderBottom: '1px solid #EFEBE0', paddingBottom: '6px' }}>
            {selectedTrial.acct} — Cadence Track
          </div>
          <Chrono
            items={buildChronoItems(selectedTrial)}
            mode="VERTICAL"
            activeItemIndex={Math.min(selectedTrial.cadenceStep, 4)}
            theme={{ primary: '#A82820', secondary: '#F4F1EA', cardBgColor: '#FBF8F1', titleColor: '#A82820', titleColorActive: '#fff' }}
            fontSizes={{ cardSubtitle: '0.7rem', cardText: '0.7rem', cardTitle: '0.75rem', title: '0.7rem' }}
            cardHeight={60}
          />
          {selectedTrial.cadenceStep < 5 ? (
            <button onClick={handleAdvance}
              style={{ marginTop: '12px', width: '100%', padding: '12px', background: '#A82820', color: '#fff', border: '2px solid #1A1D22', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', boxShadow: '3px 3px 0px #1A1D22' }}>
              ✓ Mark {CADENCE_STEPS[selectedTrial.cadenceStep]?.label} Done → Advance
            </button>
          ) : (
            <div style={{ marginTop: '10px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#2E7D32', background: '#E8F5E9', padding: '8px', borderRadius: '3px', border: '1px solid #2E7D32' }}>
              ALL STEPS COMPLETE — Log outcome in Outcome tab
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OutcomeTab() {
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
    if (!selectedId || !outcome) { toast('⚠️ Select a trial and outcome.'); return; }
    closeTrial(selectedId, outcome);
    markStepComplete('followup');
    saveDraft();
    setSelectedId(null); setOutcome(''); setNotes('');
    toast('Outcome Logged & Trial Closed.');
  };

  const handleCopyCRM = () => {
    if (!selectedTrial) { toast('Select a trial first.'); return; }
    const outcomeLabel = OUTCOMES.find(o => o.value === outcome)?.label || outcome || 'N/A';
    const text = `[TRIAL REVIEW]\nCode: ${selectedTrial.code}\nAccount: ${selectedTrial.acct}\nContact: ${selectedTrial.human}\nFeedback: ${outcomeLabel}\nNotes: ${notes}`;
    if (navigator.clipboard?.writeText) { navigator.clipboard.writeText(text).then(() => toast('Copied.')); }
    else { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copied.'); } catch { toast('Copy failed.'); } document.body.removeChild(ta); }
  };

  if (trials.length === 0) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: '#4A5159' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '18px', fontWeight: 700, textTransform: 'uppercase' }}>Pipeline Empty</div>
        <p style={{ fontSize: '13px', margin: '6px 0 0' }}>No active trials. Ship one in Step 03.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label className="os-label">Select Trial</label>
        <select value={selectedId ?? ''} onChange={e => { setSelectedId(e.target.value ? Number(e.target.value) : null); setOutcome(''); setNotes(''); }}
          style={{ width: '100%', padding: '10px', border: '2px solid #C8CCD2', background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', borderRadius: '3px', color: '#1A1D22', cursor: 'pointer' }}>
          <option value="">Choose trial to close...</option>
          {trials.map(t => <option key={t.id} value={t.id}>{t.acct} — {t.human} [{t.code}]</option>)}
        </select>
      </div>
      {selectedTrial && <TrialPreview trial={selectedTrial} />}
      {selectedTrial && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <label className="os-label">Outcome</label>
            <select value={outcome} onChange={e => setOutcome(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid #C8CCD2', background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', borderRadius: '3px', color: '#1A1D22', cursor: 'pointer' }}>
              <option value="">Select outcome...</option>
              {OUTCOMES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="os-label">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Buyer quote, key feedback, next step..." rows={2}
              style={{ width: '100%', padding: '10px', border: '2px solid #C8CCD2', background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', borderRadius: '3px', resize: 'vertical', color: '#1A1D22' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={handleCopyCRM} style={{ padding: '12px', background: 'transparent', color: '#1A1D22', border: '2px solid #1A1D22', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', minHeight: '48px', boxShadow: '2px 2px 0px #C8CCD2' }}>📋 Copy CRM</button>
            <button onClick={handleClose} disabled={!outcome} style={{ padding: '12px', background: outcome ? '#A82820' : '#C8CCD2', color: '#fff', border: `2px solid ${outcome ? '#1A1D22' : '#C8CCD2'}`, borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: outcome ? 'pointer' : 'not-allowed', minHeight: '48px', boxShadow: outcome ? '3px 3px 0px #1A1D22' : 'none' }}>Close Trial →</button>
          </div>
        </>
      )}
    </div>
  );
}

function TrialPreview({ trial }: { trial: Trial }) {
  const fields = [['Account', trial.acct], ['Named Human', trial.human], ['Routine', trial.routine], ['Use Window', trial.window], ['Buyer-Named Risk', trial.risk], ['Trial Type', trial.typeLabel], ['Follow-Up', `${trial.fuDate} via ${trial.fuChan}`], ['Code', trial.code], ['Binary Question', trial.binary], ...(trial.yesRoute ? [['Route on YES', trial.yesRoute]] : []), ...(trial.noRoute ? [['Route on NO', trial.noRoute]] : [])];
  return (
    <div style={{ background: '#FBF8F1', border: '2px solid #C8CCD2', borderRadius: '3px', padding: '12px', marginBottom: '12px', fontSize: '12px', lineHeight: 1.5, boxShadow: '2px 2px 0px #C8CCD2' }}>
      {fields.map(([dt, dd]) => (
        <div key={dt} style={{ marginBottom: '4px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#4A5159', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '6px' }}>{dt}:</span>
          <span style={{ fontWeight: 600 }}>{dd}</span>
        </div>
      ))}
    </div>
  );
}

export default function FollowUp() {
  const [activeTab, setActiveTab] = useState<TabId>('cadence');
  const tabStyle = (id: TabId): React.CSSProperties => ({
    flex: 1, padding: '10px',
    background: activeTab === id ? '#1A1D22' : '#fff',
    color: activeTab === id ? '#F4F1EA' : '#4A5159',
    border: 'none',
    borderBottom: activeTab === id ? '3px solid #A82820' : '3px solid transparent',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer',
  });

  return (
    <div className="slide-up" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div className="os-kicker">Step 04 · Follow-Up</div>
        <h2 className="os-h1">Active <span style={{ color: '#A82820' }}>Pipeline</span></h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: '0 0 12px' }}>Track cadence or log outcomes. Cadence is the discipline.</p>
      </div>
      <div style={{ display: 'flex', borderBottom: '2px solid #1A1D22', background: '#fff', marginBottom: '16px' }}>
        <button style={tabStyle('cadence')} onClick={() => setActiveTab('cadence')}>⏱ Cadence Track</button>
        <button style={tabStyle('outcome')} onClick={() => setActiveTab('outcome')}>✓ Log Outcome</button>
      </div>
      <div style={{ padding: '0 16px' }}>
        {activeTab === 'cadence' ? <CadenceTab /> : <OutcomeTab />}
      </div>
    </div>
  );
}

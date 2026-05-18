/**
 * Weekly Cadence Planner — Feature 7
 * A 5-step wizard (react-use-wizard) that walks the rep through:
 *   Step 1: Set weekly intention (ring targets, top 3 priorities)
 *   Step 2: Map Monday–Friday blocks (AM/PM per day)
 *   Step 3: Assign trial follow-ups to days
 *   Step 4: Identify blockers & manager asks
 *   Step 5: Review & copy plan to clipboard
 * Tactical-brutalist design system.
 */
import { useWizard, Wizard } from 'react-use-wizard';
import { useTrialsState } from '@/contexts/AppState';
import { downloadIcs, trialsToIcsEvents } from '@/lib/icsExport';
import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const RINGS = ['R1 — Cold Station / Fire / EMS', 'R2 — Warm Intro / Event', 'R3 — Healthcare / MWR', 'R4 — Industrial / Gym'];
const PRIORITY_PLACEHOLDER = ['e.g. Close Station 14 — bring PO form', 'e.g. Qualify MWR Fort Bragg contact', 'e.g. Follow up on D+7 for MRZ-0526-A'];

// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 10px', border: '2px solid #C8CCD2',
  background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '13px', borderRadius: '3px', color: '#1A1D22', outline: 'none',
  boxSizing: 'border-box',
};
const cardStyle: React.CSSProperties = {
  background: '#fff', border: '2px solid #1A1D22', borderRadius: '3px',
  padding: '14px', marginBottom: '12px', boxShadow: '3px 3px 0px #1A1D22',
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4A5159',
  display: 'block', marginBottom: '5px',
};
const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', fontWeight: 700,
  textTransform: 'uppercase', color: '#8A6A14', letterSpacing: '0.06em',
  borderBottom: '1px solid #EFEBE0', paddingBottom: '6px', marginBottom: '12px',
};

// ─── Wizard Progress Bar ────────────────────────────────────────────────────────
function WizardHeader({ totalSteps }: { totalSteps: number }) {
  const { activeStep, goToStep } = useWizard();
  const STEP_LABELS = ['Intention', 'Time Blocks', 'Follow-Ups', 'Blockers', 'Review'];
  return (
    <div style={{ padding: '12px 16px 0', background: '#F4F1EA' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '8px' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < totalSteps - 1 ? 1 : 'none' }}>
            <button
              onClick={() => goToStep(i)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: i < activeStep ? '#2E7D32' : i === activeStep ? '#A82820' : '#C8CCD2',
                border: `2px solid ${i <= activeStep ? '#1A1D22' : '#C8CCD2'}`,
                color: i <= activeStep ? '#fff' : '#4A5159',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700,
                cursor: 'pointer', display: 'grid', placeItems: 'center',
                boxShadow: i === activeStep ? '2px 2px 0px #1A1D22' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {i < activeStep ? '✓' : i + 1}
            </button>
            {i < totalSteps - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < activeStep ? '#2E7D32' : '#C8CCD2', margin: '0 2px' }} />
            )}
          </div>
        ))}
      </div>
      {/* Current step label */}
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#A82820', letterSpacing: '0.06em', marginBottom: '4px' }}>
        Step {activeStep + 1} of {totalSteps} — {STEP_LABELS[activeStep]}
      </div>
    </div>
  );
}

// ─── Nav Buttons ────────────────────────────────────────────────────────────────
function WizardNav({ onFinish }: { onFinish?: () => void }) {
  const { previousStep, nextStep, isFirstStep, isLastStep } = useWizard();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isFirstStep ? '1fr' : '1fr 1fr', gap: '8px', marginTop: '16px' }}>
      {!isFirstStep && (
        <button onClick={previousStep} style={{ padding: '11px', background: 'transparent', color: '#1A1D22', border: '2px solid #1A1D22', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '2px 2px 0px #C8CCD2' }}>
          ← Back
        </button>
      )}
      {!isLastStep ? (
        <button onClick={nextStep} style={{ padding: '11px', background: '#1A1D22', color: '#F4F1EA', border: '2px solid #1A1D22', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '3px 3px 0px #A82820' }}>
          Next →
        </button>
      ) : (
        <button onClick={onFinish} style={{ padding: '11px', background: '#A82820', color: '#fff', border: '2px solid #1A1D22', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '3px 3px 0px #1A1D22' }}>
          📋 Copy Plan & Done
        </button>
      )}
    </div>
  );
}

// ─── Step 1: Weekly Intention ──────────────────────────────────────────────────
function StepIntention({ data, setData }: { data: any; setData: (d: any) => void }) {
  return (
    <div>
      <div style={sectionTitleStyle}>01 · Weekly Intention</div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Primary Ring Focus This Week</label>
        <select aria-label="Primary ring focus this week" value={data.ringFocus} onChange={e => setData({ ...data, ringFocus: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">Select ring...</option>
          {RINGS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Weekly Target — Coded Trials to Ship</label>
        <input type="number" min={0} max={20} value={data.trialTarget} onChange={e => setData({ ...data, trialTarget: e.target.value })} style={inputStyle} placeholder="e.g. 3" />
      </div>
      <div>
        <label style={labelStyle}>Top 3 Priorities This Week</label>
        {[0, 1, 2].map(i => (
          <input key={i} type="text" value={data.priorities[i] || ''} onChange={e => { const p = [...data.priorities]; p[i] = e.target.value; setData({ ...data, priorities: p }); }} style={{ ...inputStyle, marginBottom: '6px' }} placeholder={PRIORITY_PLACEHOLDER[i]} />
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Time Blocks ───────────────────────────────────────────────────────
function StepTimeBlocks({ data, setData }: { data: any; setData: (d: any) => void }) {
  const updateBlock = (day: string, slot: 'am' | 'pm', val: string) => {
    setData({ ...data, blocks: { ...data.blocks, [day]: { ...data.blocks[day], [slot]: val } } });
  };
  return (
    <div>
      <div style={sectionTitleStyle}>02 · Time Blocks</div>
      <p style={{ fontSize: '12px', color: '#4A5159', margin: '0 0 12px', fontStyle: 'italic' }}>Assign your AM and PM focus for each field day. Be specific — account or ring, not "prospecting".</p>
      {DAYS.map(day => (
        <div key={day} style={{ marginBottom: '10px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#1A1D22', marginBottom: '4px' }}>{day}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div>
              <label style={{ ...labelStyle, fontSize: '9px' }}>AM</label>
              <input type="text" value={data.blocks[day]?.am || ''} onChange={e => updateBlock(day, 'am', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} placeholder="e.g. Station 12 cold call" />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: '9px' }}>PM</label>
              <input type="text" value={data.blocks[day]?.pm || ''} onChange={e => updateBlock(day, 'pm', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} placeholder="e.g. MWR follow-up" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step 3: Follow-Up Assignments ────────────────────────────────────────────
function StepFollowUps({ data, setData }: { data: any; setData: (d: any) => void }) {
  const trials = useTrialsState();
  const updateAssignment = (trialId: number, day: string) => {
    setData({ ...data, fuAssignments: { ...data.fuAssignments, [trialId]: day } });
  };
  return (
    <div>
      <div style={sectionTitleStyle}>03 · Follow-Up Assignments</div>
      {trials.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#4A5159', background: '#FBF8F1', border: '1px dashed #C8CCD2', borderRadius: '3px' }}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>📭</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>No Active Trials</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>Ship trials in Step 03 to assign follow-ups here.</div>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '12px', color: '#4A5159', margin: '0 0 10px', fontStyle: 'italic' }}>Assign each active trial to the day you plan to follow up.</p>
          {trials.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EFEBE0' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>{t.acct}</div>
                <div style={{ fontSize: '11px', color: '#4A5159' }}>{t.code} · {t.human}</div>
              </div>
              <select aria-label={`Assign follow-up day for ${t.acct}`} value={data.fuAssignments[t.id] || ''} onChange={e => updateAssignment(t.id, e.target.value)}
                style={{ ...inputStyle, width: 'auto', minWidth: '110px', fontSize: '12px', padding: '6px 8px' }}>
                <option value="">Assign day...</option>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Blockers & Manager Asks ──────────────────────────────────────────
function StepBlockers({ data, setData }: { data: any; setData: (d: any) => void }) {
  return (
    <div>
      <div style={sectionTitleStyle}>04 · Blockers & Manager Asks</div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Known Blockers This Week</label>
        <textarea value={data.blockers} onChange={e => setData({ ...data, blockers: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="e.g. Waiting on OPSS certification language for MWR conversation..." />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Manager Ask (one decision only)</label>
        <textarea value={data.managerAsk} onChange={e => setData({ ...data, managerAsk: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="e.g. Need approval to offer squad kit pricing at Station 14..." />
      </div>
      <div>
        <label style={labelStyle}>Resources / Tools Needed</label>
        <textarea value={data.resources} onChange={e => setData({ ...data, resources: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="e.g. 3 crew boxes for Station 14 trial, updated OPSS one-pager..." />
      </div>
    </div>
  );
}

// ─── Step 5: Review ────────────────────────────────────────────────────────────
function StepReview({ data, onCopy }: { data: any; onCopy: () => void }) {
  const trials = useTrialsState();
  const buildPlanText = () => {
    const lines: string[] = [
      '# WEEKLY CADENCE PLAN\n',
      `## Intention`,
      `Ring Focus: ${data.ringFocus || '(not set)'}`,
      `Trial Target: ${data.trialTarget || '0'} coded trials`,
      `\nTop 3 Priorities:`,
      ...data.priorities.filter(Boolean).map((p: string, i: number) => `  ${i + 1}. ${p}`),
      `\n## Time Blocks`,
      ...DAYS.map(d => `  ${d}: AM — ${data.blocks[d]?.am || '—'} | PM — ${data.blocks[d]?.pm || '—'}`),
    ];
    const assignments = Object.entries(data.fuAssignments);
    if (assignments.length > 0) {
      lines.push('\n## Follow-Up Assignments');
      assignments.forEach(([id, day]) => {
        const trial = trials.find(t => t.id === Number(id));
        if (trial) lines.push(`  ${day}: ${trial.acct} [${trial.code}] — ${trial.human}`);
      });
    }
    if (data.blockers) lines.push(`\n## Blockers\n${data.blockers}`);
    if (data.managerAsk) lines.push(`\n## Manager Ask\n${data.managerAsk}`);
    if (data.resources) lines.push(`\n## Resources Needed\n${data.resources}`);
    return lines.join('\n');
  };

  const planText = buildPlanText();

  return (
    <div>
      <div style={sectionTitleStyle}>05 · Review Plan</div>
      <div style={{ background: '#1A1D22', border: '2px solid #1A1D22', borderRadius: '3px', padding: '12px', marginBottom: '12px', boxShadow: '3px 3px 0px #A82820' }}>
        <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          {planText}
        </pre>
      </div>
      <div style={{ fontSize: '12px', color: '#4A5159', fontStyle: 'italic', marginBottom: '4px' }}>
        Copy this plan to your notes, CRM, or manager check-in message.
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WeeklyCadencePlanner() {
  const trials = useTrialsState();
  const [planData, setPlanData] = useState({
    ringFocus: '',
    trialTarget: '',
    priorities: ['', '', ''],
    blocks: Object.fromEntries(DAYS.map(d => [d, { am: '', pm: '' }])),
    fuAssignments: {} as Record<number, string>,
    blockers: '',
    managerAsk: '',
    resources: '',
  });
  const [done, setDone] = useState(false);

  const buildPlanText = () => {
    const lines: string[] = [
      '# WEEKLY CADENCE PLAN\n',
      `## Intention`,
      `Ring Focus: ${planData.ringFocus || '(not set)'}`,
      `Trial Target: ${planData.trialTarget || '0'} coded trials`,
      `\nTop 3 Priorities:`,
      ...planData.priorities.filter(Boolean).map((p, i) => `  ${i + 1}. ${p}`),
      `\n## Time Blocks`,
      ...DAYS.map(d => `  ${d}: AM — ${planData.blocks[d]?.am || '—'} | PM — ${planData.blocks[d]?.pm || '—'}`),
    ];
    const assignments = Object.entries(planData.fuAssignments);
    if (assignments.length > 0) {
      lines.push('\n## Follow-Up Assignments');
      assignments.forEach(([id, day]) => {
        const trial = trials.find(t => t.id === Number(id));
        if (trial) lines.push(`  ${day}: ${trial.acct} [${trial.code}] — ${trial.human}`);
      });
    }
    if (planData.blockers) lines.push(`\n## Blockers\n${planData.blockers}`);
    if (planData.managerAsk) lines.push(`\n## Manager Ask\n${planData.managerAsk}`);
    if (planData.resources) lines.push(`\n## Resources Needed\n${planData.resources}`);
    return lines.join('\n');
  };

  const handleCopyAndDone = () => {
    const text = buildPlanText();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => setDone(true));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* silent */ }
      document.body.removeChild(ta);
      setDone(true);
    }
  };

  const handleExportIcs = () => {
    const shippedTrials = trials.filter(t => t.status === 'shipped');
    const events = trialsToIcsEvents(shippedTrials);
    if (events.length === 0) return;
    downloadIcs(events, `fieldkit-followups-${new Date().toISOString().slice(0, 10)}.ics`);
  };

  if (done) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', color: '#2E7D32', marginBottom: '8px' }}>Plan Copied</div>
        <p style={{ fontSize: '14px', color: '#4A5159', marginBottom: '20px' }}>Your weekly cadence plan is in your clipboard. Paste it into your notes or manager message.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          {trials.filter(t => t.status === 'shipped').length > 0 && (
            <button
              onClick={handleExportIcs}
              style={{ padding: '12px 24px', background: '#1565C0', color: '#fff', border: '2px solid #1565C0', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '3px 3px 0px #0D47A1' }}
            >
              📅 Export Follow-Ups to Calendar (.ics)
            </button>
          )}
          <button onClick={() => setDone(false)} style={{ padding: '12px 24px', background: '#1A1D22', color: '#F4F1EA', border: '2px solid #1A1D22', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '3px 3px 0px #A82820' }}>
            ↺ Build New Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-up" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Page header */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="os-kicker">Feature 7 · Cadence Planner</div>
        <h2 className="os-h1">Weekly <span style={{ color: '#A82820' }}>War Plan</span></h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: '0 0 4px' }}>
          Five steps. Build your week before it builds you.
        </p>
      </div>

      <Wizard header={<WizardHeader totalSteps={5} />}>
        <div style={{ padding: '12px 16px' }}>
          <div style={cardStyle}>
            <StepIntention data={planData} setData={setPlanData} />
          </div>
          <WizardNav />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={cardStyle}>
            <StepTimeBlocks data={planData} setData={setPlanData} />
          </div>
          <WizardNav />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={cardStyle}>
            <StepFollowUps data={planData} setData={setPlanData} />
          </div>
          <WizardNav />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={cardStyle}>
            <StepBlockers data={planData} setData={setPlanData} />
          </div>
          <WizardNav />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={cardStyle}>
            <StepReview data={planData} onCopy={handleCopyAndDone} />
          </div>
          <WizardNav onFinish={handleCopyAndDone} />
        </div>
      </Wizard>
    </div>
  );
}

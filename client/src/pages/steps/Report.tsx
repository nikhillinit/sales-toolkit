/**
 * Step 05 — Report
 * Weekly scoreboard + 1:1 agenda builder + quality gate + sample report. Copy to clipboard.
 * Unified Signal OS design system.
 */
import { useAppState, type Stats } from '@/contexts/AppState';
import { useState } from 'react';

const STAT_DEFS: { key: keyof Stats; label: string; color?: string; sub: string }[] = [
  { key: 'out',     label: 'Real Outreach Attempts',              sub: 'Calls, DMs, emails, walk-ins',     color: '#1A1D22' },
  { key: 'live',    label: 'Live / Replied Conversations',        sub: 'Actual two-way exchanges',          color: '#1A1D22' },
  { key: 'qual',    label: 'Four-Gear Qualified',                 sub: 'All 4 gears present',               color: '#1A1D22' },
  { key: 'ship',    label: 'Complete Activations Shipped',        sub: 'All 8 fields complete',             color: '#A82820' },
  { key: 'yes',     label: 'Yes / PO Outcomes',                   sub: 'Confirmed buyer decisions',         color: '#2E7D32' },
  { key: 'exit',    label: 'Clean Exits',                         sub: 'Honest Out executed',               color: '#4A5159' },
  { key: 'retest',  label: 'Retest / Retime',                     sub: 'Condition set for return',          color: '#B45309' },
  { key: 'blocker', label: 'Blockers / Manager Asks',             sub: 'Needs decision or escalation',      color: '#A82820' },
];

const QUALITY_GATE = [
  'Can my manager read this in under three minutes?',
  'Does it show progress, not activity?',
  'Does it include one exact buyer phrase (verbatim)?',
  'Does it identify one decision or ask for the manager?',
  'Does it protect the company from unsupported claims?',
  'Does it make next week sharper?',
];

export default function Report() {
  const { state, modStat, saveDraft, toast } = useAppState();
  const [phrase, setPhrase] = useState('');
  const [move, setMove] = useState('');
  const [cleanNo, setCleanNo] = useState('');
  const [learn, setLearn] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [skill, setSkill] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [ask, setAsk] = useState('');
  const [gateChecked, setGateChecked] = useState<boolean[]>(QUALITY_GATE.map(() => false));
  const [showSample, setShowSample] = useState(false);

  const toggleGate = (i: number) => {
    setGateChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const gateAllPass = gateChecked.every(Boolean);

  const handleCopyWeekly = () => {
    const s = state.stats;
    const report =
      `# Restless Weekly Progress Report\n\n` +
      `## 1. Scoreboard — Six Numbers\n` +
      `- Real outreach attempts: ${s.out}\n` +
      `- Live/replied conversations: ${s.live}\n` +
      `- Four-Gear qualified: ${s.qual}\n` +
      `- Complete activations shipped/reviewed: ${s.ship}\n` +
      `- Follow-ups completed / due: ${s.exit} / ${s.out}\n` +
      `- Yes/no outcomes + clean exits: ${s.yes} yes/no, ${s.exit} clean exits\n\n` +
      `## 2. Best buyer phrase\n${phrase || '(not filled)'}\n\n` +
      `## 3. Best movement\n${move || '(not filled)'}\n\n` +
      `## 4. Cleanest no / Honest Out\n${cleanNo || '(not filled)'}\n\n` +
      `## 5. One learning\n${learn || '(not filled)'}\n\n` +
      `## 6. Knowledge / Skill / Discipline\n` +
      `K: ${knowledge || '(not filled)'}\n` +
      `S: ${skill || '(not filled)'}\n` +
      `D: ${discipline || '(not filled)'}\n\n` +
      `## 7. Manager ask\n${ask || '(not filled)'}`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(report).then(() => toast('Weekly report copied.'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = report;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('Weekly report copied.'); } catch { toast('Copy failed.'); }
      document.body.removeChild(ta);
    }
  };

  const handleResetStats = () => {
    if (!confirm('Reset all stats to zero?')) return;
    STAT_DEFS.forEach(({ key }) => {
      const current = state.stats[key] || 0;
      if (current > 0) modStat(key, -current);
    });
    saveDraft();
    toast('Stats reset.');
  };

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Step 05 · Report</div>
        <h2 className="os-h1">
          Weekly <span style={{ color: '#A82820' }}>Scoreboard</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: 0 }}>
          Six numbers, then the story. Shows progress, not activity.
        </p>
      </div>

      {/* Quality Gate */}
      <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
        <div className="os-h2" style={{ marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Quality Gate
          {gateAllPass && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#2E7D32', background: '#E8F5E9', padding: '2px 6px', borderRadius: '2px' }}>
              PASS ✓
            </span>
          )}
        </div>
        {QUALITY_GATE.map((q, i) => (
          <label key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #EFEBE0', cursor: 'pointer' }}>
            <div
              onClick={() => toggleGate(i)}
              style={{
                width: '18px', height: '18px', flexShrink: 0, marginTop: '1px',
                border: `2px solid ${gateChecked[i] ? '#2E7D32' : '#C8CCD2'}`,
                borderRadius: '2px',
                background: gateChecked[i] ? '#2E7D32' : 'transparent',
                display: 'grid', placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              {gateChecked[i] && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ fontSize: '13px', color: gateChecked[i] ? '#4A5159' : '#1A1D22', textDecoration: gateChecked[i] ? 'line-through' : 'none', lineHeight: 1.5 }}>{q}</span>
          </label>
        ))}
      </div>

      {/* Stat counters */}
      <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
        <div className="os-h2" style={{ marginTop: 0 }}>Pipeline Metrics — Six Numbers</div>
        {STAT_DEFS.map(({ key, label, color, sub }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #EFEBE0',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: color || '#1A1D22' }}>{label}</div>
              <div style={{ fontSize: '11px', color: '#4A5159', marginTop: '1px' }}>{sub}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={() => { modStat(key, -1); saveDraft(); }}
                aria-label={`Decrease ${label}`}
                style={{
                  background: '#EFEBE0', border: '1px solid #C8CCD2',
                  width: '32px', height: '32px', display: 'grid', placeItems: 'center',
                  borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700, color: '#4A5159', fontSize: '16px', cursor: 'pointer',
                }}
              >−</button>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                width: '32px', textAlign: 'center', fontSize: '16px', color: color || '#1A1D22',
              }}>
                {state.stats[key] || 0}
              </span>
              <button
                onClick={() => { modStat(key, 1); saveDraft(); }}
                aria-label={`Increase ${label}`}
                style={{
                  background: '#EFEBE0', border: '1px solid #C8CCD2',
                  width: '32px', height: '32px', display: 'grid', placeItems: 'center',
                  borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700, color: '#4A5159', fontSize: '16px', cursor: 'pointer',
                }}
              >+</button>
            </div>
          </div>
        ))}
        <button
          onClick={handleResetStats}
          style={{
            marginTop: '10px', padding: '6px 12px', background: 'transparent',
            color: '#4A5159', border: '1px solid #C8CCD2', borderRadius: '3px',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
            fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
          }}
        >↺ Reset Stats</button>
      </div>

      {/* 1:1 Agenda */}
      <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
        <div className="os-h2" style={{ marginTop: 0 }}>1:1 Agenda Builder</div>
        {[
          { id: 'w-phrase',     label: 'Best buyer phrase (verbatim)',     val: phrase,     set: setPhrase,     placeholder: 'Exact quote from a buyer — not a paraphrase...' },
          { id: 'w-move',       label: 'Best movement',                    val: move,       set: setMove,       placeholder: 'What changed and what the next step is...' },
          { id: 'w-clean-no',   label: 'Cleanest no / Honest Out',         val: cleanNo,    set: setCleanNo,    placeholder: 'What was protected and why...' },
          { id: 'w-learn',      label: 'One learning for next week',       val: learn,      set: setLearn,      placeholder: 'What changes next week\'s behavior...' },
          { id: 'w-knowledge',  label: 'Knowledge (one sentence)',         val: knowledge,  set: setKnowledge,  placeholder: 'Product, segment, or claim fact learned...' },
          { id: 'w-skill',      label: 'Skill (one sentence)',             val: skill,      set: setSkill,      placeholder: 'A rep technique practiced or improved...' },
          { id: 'w-discipline', label: 'Discipline (one sentence)',        val: discipline, set: setDiscipline, placeholder: 'A process or habit held or improved...' },
          { id: 'w-ask',        label: 'Manager ask (one decision only)',  val: ask,        set: setAsk,        placeholder: 'One thing you need the manager to decide or unblock...' },
        ].map(field => (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            <label className="os-label" htmlFor={field.id}>{field.label}</label>
            <textarea
              id={field.id}
              value={field.val}
              onChange={e => field.set(e.target.value)}
              placeholder={field.placeholder}
              rows={2}
              style={{
                width: '100%', padding: '10px', border: '1px solid #C8CCD2',
                background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '14px', borderRadius: '3px', resize: 'vertical', color: '#1A1D22',
              }}
            />
          </div>
        ))}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopyWeekly}
        style={{
          width: '100%', padding: '14px', background: '#A82820', color: '#fff',
          border: 'none', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '16px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.04em', cursor: 'pointer', minHeight: '52px',
        }}
      >
        📋 Copy Weekly Report
      </button>

      {/* Sample report toggle */}
      <button
        onClick={() => setShowSample(s => !s)}
        style={{
          width: '100%', marginTop: '8px', padding: '10px', background: 'transparent',
          color: '#4A5159', border: '1px solid #C8CCD2', borderRadius: '3px',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
          fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        {showSample ? '▲ Hide' : '▼ Show'} Sample Completed Report
      </button>

      {showSample && (
        <div style={{ background: '#1A1D22', border: '1px solid #333', borderRadius: '3px', padding: '14px', marginTop: '8px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.85)' }}>{`# Restless Weekly Progress Report — Alex R. — Week of May 12

## 1. Scoreboard
- Real outreach attempts: 42
- Live/replied conversations: 12
- Four-Gear qualified: 6
- Complete activations shipped/reviewed: 3
- Follow-ups completed / due: 5 / 5
- Yes/no outcomes + clean exits: 2 yes/no, 2 clean exits

## 2. Best buyer phrase
"The guys grab whatever's cold at 2 a.m." — station captain.

## 3. Best movement
Station 14 used the coded pack and asked for reorder pricing.
Next step: small reorder or second-shift test.

## 4. Cleanest no / Honest Out
BJJ gym wanted a full bag before coach tried it.
I offered 5 coach-only sticks; they declined.
Protected inventory and coach credibility.

## 5. One learning
Station-table placement outperformed captain speech.
Next week: ask for passive table placement first.

## 6. Knowledge / Skill / Discipline
K: OPSS is a review resource, not approval.
S: Clarified "120mg is light" with comparison trial offer.
D: No product left without canonical pre-ship approval.

## 7. Manager ask
Need current certification-status language by Tuesday
for two MWR conversations.`}</div>
        </div>
      )}

      {/* Weekly Cadence time ring */}
      <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '14px', marginTop: '14px' }}>
        <div className="os-h2" style={{ marginTop: 0 }}>Weekly Time Ring</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
          <svg viewBox="0 0 200 200" style={{ width: '110px', height: '110px', flexShrink: 0 }}>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#1e1c18" strokeWidth="30" strokeDasharray="170 257" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#A82820" strokeWidth="30" strokeDasharray="85 342" strokeDashoffset="-170" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#76736b" strokeWidth="30" strokeDasharray="77 350" strokeDashoffset="-255" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#2a2721" strokeWidth="30" strokeDasharray="51 376" strokeDashoffset="-332" transform="rotate(-90 100 100)" opacity=".9"/>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#aaa79b" strokeWidth="30" strokeDasharray="30 397" strokeDashoffset="-383" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="68" fill="none" stroke="#d0cdc4" strokeWidth="30" strokeDasharray="13 414" strokeDashoffset="-413" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="38" fill="#F4F1EA"/>
            <text x="100" y="96" textAnchor="middle" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', fill: '#1A1D22' }}>CONTACT</text>
            <text x="100" y="110" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '11px', fill: '#A82820' }}>40%</text>
          </svg>
          <div style={{ flex: 1, minWidth: '120px' }}>
            {[
              ['40%', 'Contact & forward progress', '#1e1c18'],
              ['20%', 'Development', '#A82820'],
              ['18%', 'Communication', '#76736b'],
              ['12%', 'Internal', '#2a2721'],
              ['7%',  'Tracking', '#aaa79b'],
              ['3%',  'Administrative', '#d0cdc4'],
            ].map(([pct, label, color]) => (
              <div key={label} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color, minWidth: '28px' }}>{pct}</span>
                <span style={{ fontSize: '12px', color: '#4A5159' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#4A5159', fontStyle: 'italic', borderTop: '1px solid #EFEBE0', paddingTop: '8px' }}>
          Rep honesty test: if the contact segment is not the largest part of the week, the calendar is not serving the sales motion.
        </div>
      </div>
    </div>
  );
}

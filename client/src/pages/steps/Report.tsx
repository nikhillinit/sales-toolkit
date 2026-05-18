/**
 * Step 05 — Report
 * Weekly scoreboard + 1:1 agenda builder. Copy to clipboard.
 * Unified Signal OS design system.
 */
import { useAppState, type Stats } from '@/contexts/AppState';
import { useState } from 'react';

const STAT_DEFS: { key: keyof Stats; label: string; color?: string }[] = [
  { key: 'out',     label: 'Outreach' },
  { key: 'live',    label: 'Live Calls' },
  { key: 'qual',    label: 'Qualified' },
  { key: 'ship',    label: 'Shipped',  color: '#A82820' },
  { key: 'yes',     label: 'Yes / PO', color: '#2E7D32' },
  { key: 'exit',    label: 'Clean Exit' },
  { key: 'retest',  label: 'Retest' },
  { key: 'blocker', label: 'Blocker',  color: '#B45309' },
];

export default function Report() {
  const { state, modStat, saveDraft, toast } = useAppState();
  const [phrase, setPhrase] = useState('');
  const [move, setMove] = useState('');
  const [learn, setLearn] = useState('');
  const [ask, setAsk] = useState('');

  const handleCopyWeekly = () => {
    const s = state.stats;
    const report = `[WEEKLY SCOREBOARD]\n` +
      `Outreach: ${s.out} | Live: ${s.live} | Qual: ${s.qual} | Ship: ${s.ship} | Yes: ${s.yes} | Exit: ${s.exit} | Retest: ${s.retest} | Blocker: ${s.blocker}\n\n` +
      `[1:1 AGENDA]\nPhrase: ${phrase || 'N/A'}\nMove: ${move || 'N/A'}\nLearning: ${learn || 'N/A'}\nAsk: ${ask || 'N/A'}`;

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
          Track pipeline metrics. Build your 1:1 agenda. Copy and send.
        </p>
      </div>

      {/* Stat counters */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '4px',
          padding: '14px',
          marginBottom: '14px',
        }}
      >
        <div className="os-h2" style={{ marginTop: 0 }}>Pipeline Metrics</div>
        {STAT_DEFS.map(({ key, label, color }) => (
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
            <span style={{ fontSize: '14px', fontWeight: 600, color: color || '#1A1D22' }}>
              {label}
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => { modStat(key, -1); saveDraft(); }}
                aria-label={`Decrease ${label}`}
                style={{
                  background: '#EFEBE0',
                  border: '1px solid #C8CCD2',
                  width: '32px',
                  height: '32px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '2px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#4A5159',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                −
              </button>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  width: '32px',
                  textAlign: 'center',
                  fontSize: '16px',
                  color: color || '#1A1D22',
                }}
              >
                {state.stats[key] || 0}
              </span>
              <button
                onClick={() => { modStat(key, 1); saveDraft(); }}
                aria-label={`Increase ${label}`}
                style={{
                  background: '#EFEBE0',
                  border: '1px solid #C8CCD2',
                  width: '32px',
                  height: '32px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '2px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#4A5159',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleResetStats}
          style={{
            marginTop: '10px',
            padding: '6px 12px',
            background: 'transparent',
            color: '#4A5159',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          ↺ Reset Stats
        </button>
      </div>

      {/* 1:1 Agenda */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '4px',
          padding: '14px',
          marginBottom: '14px',
        }}
      >
        <div className="os-h2" style={{ marginTop: 0 }}>1:1 Agenda Builder</div>

        {[
          { id: 'w-phrase', label: 'Phrase of the week', val: phrase, set: setPhrase, placeholder: 'The buyer phrase that moved something...' },
          { id: 'w-move',   label: 'Best move',          val: move,   set: setMove,   placeholder: 'What worked and why...' },
          { id: 'w-learn',  label: 'Learning',           val: learn,  set: setLearn,  placeholder: 'What I now know I didn\'t before...' },
          { id: 'w-ask',    label: 'Ask for manager',    val: ask,    set: setAsk,    placeholder: 'What I need help with...' },
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
        ))}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopyWeekly}
        style={{
          width: '100%',
          padding: '14px',
          background: '#A82820',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          cursor: 'pointer',
          minHeight: '52px',
        }}
      >
        📋 Copy Weekly Report
      </button>

      {/* Cadence reminder */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '4px',
          padding: '14px',
          marginTop: '14px',
        }}
      >
        <div className="os-h2" style={{ marginTop: 0 }}>Weekly Cadence</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Contact', pct: '40%', desc: 'Prospecting, meetings' },
            { label: 'Develop', pct: '20%', desc: 'Practice, feedback' },
            { label: 'Comms',   pct: '18%', desc: 'Follow-up, proposals' },
            { label: 'Admin',   pct: '22%', desc: 'CRM, reporting, prep' },
          ].map(item => (
            <div key={item.label} className="os-panel">
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                }}
              >
                {item.label} <span style={{ color: '#A82820' }}>{item.pct}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#4A5159', marginTop: '2px' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

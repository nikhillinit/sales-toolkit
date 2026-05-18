/**
 * Claim Scanner — Unified Signal OS
 * Live banned-term detection for rep-written copy.
 * Label-first, evidence-first, no overclaim.
 */
import { findBannedTerms, BANNED_TERMS } from '@/lib/claimScanner';
import { useState } from 'react';

export default function ClaimScanner() {
  const [input, setInput] = useState('');
  const matches = input.trim() ? findBannedTerms(input) : [];
  const isClean = input.trim().length > 0 && matches.length === 0;
  const isDirty = matches.length > 0;

  // Build highlighted HTML
  const getHighlighted = () => {
    if (!input.trim() || matches.length === 0) return null;
    const lower = input.toLowerCase();
    const parts: { text: string; banned: boolean }[] = [];
    let lastIdx = 0;

    matches.forEach(({ term, start }) => {
      const actualStart = lower.indexOf(term.toLowerCase(), Math.max(0, start - 2));
      if (actualStart === -1) return;
      if (actualStart > lastIdx) {
        parts.push({ text: input.slice(lastIdx, actualStart), banned: false });
      }
      parts.push({ text: input.slice(actualStart, actualStart + term.length), banned: true });
      lastIdx = actualStart + term.length;
    });
    if (lastIdx < input.length) {
      parts.push({ text: input.slice(lastIdx), banned: false });
    }
    return parts;
  };

  const highlighted = getHighlighted();

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Claim Scanner</div>
        <h2 className="os-h1">
          Copy <span style={{ color: '#A82820' }}>Compliance</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: 0 }}>
          Paste any email, pitch, or message. Banned terms highlight red.
        </p>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '12px' }}>
        <label className="os-label" htmlFor="claim-input">
          Your copy
        </label>
        <textarea
          id="claim-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste your pitch, email, or message here..."
          rows={6}
          style={{
            width: '100%',
            padding: '10px',
            border: `1px solid ${isDirty ? '#A82820' : isClean ? '#2E7D32' : '#C8CCD2'}`,
            background: '#FBF8F1',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            borderRadius: '3px',
            resize: 'vertical',
            color: '#1A1D22',
            transition: 'border-color 0.2s',
          }}
        />
      </div>

      {/* Result */}
      {input.trim() && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '3px',
            marginBottom: '12px',
            fontWeight: 600,
            fontSize: '13px',
            background: isDirty ? '#FEF2F2' : '#F0FDF4',
            border: `1px solid ${isDirty ? '#A82820' : '#2E7D32'}`,
            color: isDirty ? '#A82820' : '#2E7D32',
          }}
        >
          {isDirty ? (
            <>
              ⚠️ {matches.length} banned term{matches.length > 1 ? 's' : ''} found:{' '}
              {matches.map((m, i) => (
                <span key={i}>
                  <span className="banned-highlight">{m.term}</span>
                  {i < matches.length - 1 ? ', ' : ''}
                </span>
              ))}
            </>
          ) : (
            '✓ Clean — no banned terms detected.'
          )}
        </div>
      )}

      {/* Highlighted preview */}
      {highlighted && isDirty && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            padding: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            lineHeight: 1.6,
            marginBottom: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {highlighted.map((part, i) =>
            part.banned ? (
              <span key={i} className="banned-highlight">{part.text}</span>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </div>
      )}

      {/* Clear button */}
      {input && (
        <button
          onClick={() => setInput('')}
          style={{
            padding: '8px 14px',
            background: 'transparent',
            color: '#4A5159',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          ↺ Clear
        </button>
      )}

      {/* Banned terms reference */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '4px',
          padding: '14px',
        }}
      >
        <div className="os-h2" style={{ marginTop: 0 }}>Banned Terms Reference</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '10px' }}>
          These terms are prohibited in all rep communications. Label-first, evidence-first.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {BANNED_TERMS.map(term => (
            <span
              key={term}
              style={{
                padding: '3px 8px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '2px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#A82820',
                fontWeight: 600,
              }}
            >
              {term}
            </span>
          ))}
        </div>

        <div className="os-warn" style={{ marginTop: '12px' }}>
          <strong>Rule 06:</strong> No hero claims. Never "proven" or unverified.<br />
          <strong>Rule 07:</strong> Cite the label. Supplement Facts = truth.
        </div>
      </div>
    </div>
  );
}

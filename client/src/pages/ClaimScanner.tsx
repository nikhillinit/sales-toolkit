/**
 * Claim Scanner — Unified Signal OS
 * Dual-layer compliance scan:
 *   Layer 1: findBannedTerms (local lib) — broad banned-term list
 *   Layer 2: scanForClaims (@shared) — Hard Claim guardrails HC-01..HC-05
 * Label-first, evidence-first, no overclaim.
 */
import { findBannedTerms, BANNED_TERMS } from '@/lib/claimScanner';
import { scanForClaims, HARD_CLAIMS, type ClaimHit } from '@shared/claims';
import { readManualCTAContext } from '@shared/objections';
import { useEffect, useRef, useState } from 'react';

export default function ClaimScanner() {
  const [input, setInput] = useState('');

  // Prefill from manual CTA — fires once on mount
  const prefillApplied = useRef(false);
  useEffect(() => {
    if (prefillApplied.current) return;
    prefillApplied.current = true;
    const ctx = readManualCTAContext();
    if (!ctx?.prefill) return;
    // buyerWords → scanner input (the phrase the rep wants to check)
    if (ctx.prefill.buyerWords) {
      setInput(ctx.prefill.buyerWords);
      setTimeout(() => {
        document.getElementById('claim-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('claim-input')?.focus();
      }, 200);
    }
  }, []);

  // Layer 1: broad banned-term scan
  const matches = input.trim() ? findBannedTerms(input) : [];

  // Layer 2: hard-claim guardrails (HC-01..HC-05)
  const claimHits: ClaimHit[] = input.trim() ? scanForClaims(input) : [];
  const blockHits = claimHits.filter(h => h.severity === 'block');
  const warnHits  = claimHits.filter(h => h.severity === 'warn');

  const isClean = input.trim().length > 0 && matches.length === 0 && claimHits.length === 0;
  const isDirty = matches.length > 0 || blockHits.length > 0;
  const hasWarnings = warnHits.length > 0 && !isDirty;

  // Build highlighted parts for banned-term preview
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

  const resultBg    = isDirty ? '#FEF2F2' : hasWarnings ? '#FFFBEB' : '#F0FDF4';
  const resultBorder = isDirty ? '#A82820' : hasWarnings ? '#D97706' : '#2E7D32';
  const resultColor  = isDirty ? '#A82820' : hasWarnings ? '#92400E' : '#2E7D32';

  return (
    <div className="slide-up" style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div className="os-kicker">Claim Scanner</div>
        <h2 className="os-h1">
          Copy <span style={{ color: '#A82820' }}>Compliance</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#4A5159', margin: 0 }}>
          Paste any email, pitch, or message. Banned terms and hard-claim violations highlight red.
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

      {/* Result summary */}
      {input.trim() && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '3px',
            marginBottom: '12px',
            fontWeight: 600,
            fontSize: '13px',
            background: resultBg,
            border: `1px solid ${resultBorder}`,
            color: resultColor,
          }}
        >
          {isDirty ? (
            <>
              ⚠️ {matches.length + blockHits.length} issue{matches.length + blockHits.length !== 1 ? 's' : ''} found:{' '}
              {matches.map((m, i) => (
                <span key={`banned-${i}`}>
                  <span className="banned-highlight">{m.term}</span>
                  {i < matches.length - 1 ? ', ' : ''}
                </span>
              ))}
              {blockHits.length > 0 && matches.length > 0 && ' · '}
              {blockHits.map((h, i) => (
                <span key={`block-${i}`}>
                  <span className="banned-highlight">{h.matched}</span>
                  {i < blockHits.length - 1 ? ', ' : ''}
                </span>
              ))}
            </>
          ) : hasWarnings ? (
            <>⚡ {warnHits.length} soft-claim warning{warnHits.length !== 1 ? 's' : ''} — review before sending.</>
          ) : (
            '✓ Clean — no banned terms or hard-claim violations.'
          )}
        </div>
      )}

      {/* Highlighted banned-term preview */}
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

      {/* Hard-claim violations panel */}
      {claimHits.length > 0 && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #C8CCD2',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#8A6A14',
              marginBottom: '8px',
            }}
          >
            Hard-Claim Guardrails
          </div>
          {claimHits.map((hit, i) => (
            <div
              key={i}
              style={{
                padding: '8px 10px',
                marginBottom: '6px',
                borderLeft: `3px solid ${hit.severity === 'block' ? '#A82820' : '#D97706'}`,
                background: hit.severity === 'block' ? '#FEF2F2' : '#FFFBEB',
                borderRadius: '0 3px 3px 0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    color: hit.severity === 'block' ? '#A82820' : '#92400E',
                  }}
                >
                  {hit.code} · {hit.severity.toUpperCase()}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#4A5159',
                    background: '#EFEBE0',
                    padding: '1px 5px',
                    borderRadius: '2px',
                  }}
                >
                  "{hit.matched}"
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#1A1D22', fontFamily: "'Source Sans 3', sans-serif" }}>
                <strong>Say instead:</strong> {hit.suggestion}
              </div>
            </div>
          ))}
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
          marginBottom: '10px',
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

      {/* Hard-claim rules reference */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '4px',
          padding: '14px',
        }}
      >
        <div className="os-h2" style={{ marginTop: 0 }}>Hard-Claim Guardrails (HC-01–HC-05)</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '10px' }}>
          Structural violations that require rewrite before sending.
        </p>
        {HARD_CLAIMS.map(rule => (
          <div
            key={rule.code}
            style={{
              padding: '7px 10px',
              marginBottom: '6px',
              borderLeft: `3px solid ${rule.severity === 'block' ? '#A82820' : '#D97706'}`,
              background: '#F4F1EA',
              borderRadius: '0 3px 3px 0',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 700,
                  color: rule.severity === 'block' ? '#A82820' : '#92400E',
                  flexShrink: 0,
                }}
              >
                {rule.code}
              </span>
              <span style={{ fontSize: '12px', color: '#1A1D22', fontFamily: "'Source Sans 3', sans-serif" }}>
                {rule.say}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

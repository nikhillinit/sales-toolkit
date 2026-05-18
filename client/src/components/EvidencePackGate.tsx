/**
 * EvidencePackGate — Unified Signal OS
 * Blocks trial activation for Healthcare segment until the rep confirms
 * the evidence pack has been sent/reviewed (TrialSchema.evidencePackConfirmed gate).
 *
 * Used in Activate.tsx when act-segment === 'healthcare'.
 */
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';

const EVIDENCE_CHECKS = [
  'Evidence summary email sent before any product',
  'Label reviewed with buyer — Supplement Facts cited',
  'No efficacy claim made (no "proven", no "works")',
  'Buyer confirmed they reviewed the label',
  'Trial offer is personal-trial-first, not wholesale',
];

interface EvidencePackGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  accountName?: string;
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        flexShrink: 0,
        borderRadius: 3,
        border: `2px solid ${checked ? '#2E7D32' : '#C8CCD2'}`,
        background: checked ? '#2E7D32' : '#fff',
        display: 'grid',
        placeItems: 'center',
        transition: 'all 0.15s',
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.5L4.5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export default function EvidencePackGate({ open, onOpenChange, onConfirm, accountName }: EvidencePackGateProps) {
  const [checks, setChecks] = useState<boolean[]>(EVIDENCE_CHECKS.map(() => false));
  const allClear = checks.every(Boolean);
  const checkedCount = checks.filter(Boolean).length;

  const toggleCheck = (i: number) => {
    setChecks(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      // Reset on close so gate is fresh next time
      setChecks(EVIDENCE_CHECKS.map(() => false));
    }
    onOpenChange(nextOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader style={{ padding: '16px 16px 8px' }}>
          <DrawerTitle style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1A1D22' }}>
            Healthcare Evidence Gate
          </DrawerTitle>
          <div
            style={{
              marginTop: '6px',
              padding: '8px 10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '3px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#A82820',
              fontWeight: 600,
            }}
          >
            Appendix H · Label-First, Evidence-First
          </div>
          {accountName && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#4A5159', textTransform: 'uppercase' }}>Account:</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, color: '#A82820' }}>{accountName}</span>
            </div>
          )}
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {EVIDENCE_CHECKS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: checks[i] ? '#2E7D32' : '#C8CCD2',
                    transition: 'background 0.15s',
                  }}
                />
              ))}
            </div>
          </div>
        </DrawerHeader>

        <div style={{ padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '13px', color: '#4A5159', margin: '0 0 8px' }}>
            Healthcare accounts require evidence-first protocol before any product ships. Confirm each item.
          </p>
          {EVIDENCE_CHECKS.map((text, i) => (
            <label
              key={i}
              style={{
                margin: 0,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: 4,
                background: checks[i] ? '#F0FDF4' : '#fff',
                border: `1px solid ${checks[i] ? '#2E7D32' : '#C8CCD2'}`,
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
                minHeight: 48,
              }}
            >
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => toggleCheck(i)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
              />
              <CheckIcon checked={checks[i]} />
              <span
                style={{
                  fontSize: '14px',
                  lineHeight: 1.4,
                  color: checks[i] ? '#2E7D32' : '#4A5159',
                  textDecoration: checks[i] ? 'line-through' : 'none',
                  transition: 'color 0.15s, text-decoration 0.15s',
                }}
              >
                {text}
              </span>
            </label>
          ))}
        </div>

        <DrawerFooter style={{ padding: '8px 16px 24px' }}>
          <button
            disabled={!allClear}
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: allClear ? '#2E7D32' : '#A82820',
              opacity: allClear ? 1 : 0.45,
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: allClear ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s, opacity 0.2s',
              minHeight: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {allClear ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 8.5L6 12L13.5 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                EVIDENCE CONFIRMED — SHIP TRIAL
              </>
            ) : (
              `${checkedCount} / ${EVIDENCE_CHECKS.length} CONFIRMED`
            )}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: '#4A5159',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            Cancel
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';

const PRE_SHIP_CHECKS = [
  "Every number I used is in the Fact Bank",
  "A unique Shopify trial code exists before this ships",
  "The recipient is a named human who asked for a trial",
  "No adjectives a peer would cringe at",
  "I know exactly what I'll do if they say no in 24 hours",
  "Founder story cited once or less",
];

interface PreShipGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShip: () => void;
  trialAcct?: string;
  trialCode?: string;
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none"
        style={{
          opacity: checked ? 1 : 0,
          transform: checked ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.15s, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <path
          d="M1.5 5L4.5 8L10.5 2"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function PreShipGate({
  open,
  onOpenChange,
  onShip,
  trialAcct,
  trialCode,
}: PreShipGateProps) {
  const [checks, setChecks] = useState<boolean[]>(Array(PRE_SHIP_CHECKS.length).fill(false));
  const checkedCount = checks.filter(Boolean).length;
  const total = PRE_SHIP_CHECKS.length;
  const allClear = checkedCount === total;

  useEffect(() => {
    if (open) setChecks(Array(total).fill(false));
  }, [open]);

  const toggleCheck = (i: number) => {
    setChecks(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent style={{ background: '#F4F1EA', borderTop: '2px solid #A82820', maxHeight: '90vh', overflowY: 'auto' }}>
        <DrawerHeader style={{ textAlign: 'left', padding: '16px 16px 8px' }}>
          <div className="os-kicker">APX · REP RULES</div>
          <DrawerTitle
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '24px',
              textTransform: 'uppercase',
              color: '#1A1D22',
            }}
          >
            Pre-Ship <span style={{ color: '#A82820' }}>Self-Check</span>
          </DrawerTitle>

          {(trialAcct || trialCode) && (
            <div
              style={{
                marginTop: '8px',
                background: '#fff',
                border: '1px solid #C8CCD2',
                borderRadius: '3px',
                padding: '8px 12px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              {trialAcct && (
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#8A6A14',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Account
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1D22' }}>{trialAcct}</div>
                </div>
              )}
              {trialCode && (
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#A82820',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 2,
                    }}
                  >
                    Code
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#A82820',
                    }}
                  >
                    {trialCode}
                  </div>
                </div>
              )}
              <div style={{ marginLeft: 'auto' }}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#4A5159',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 2,
                  }}
                >
                  Progress
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: total }).map((_, i) => (
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
            </div>
          )}
        </DrawerHeader>

        <div style={{ padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {PRE_SHIP_CHECKS.map((text, i) => (
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
              onShip();
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
                SHIP TRIAL
              </>
            ) : (
              `${checkedCount} / ${total} CONFIRMED`
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

/**
 * BottomNav — Unified Signal OS
 * 5-tab bottom navigation matching the 5-step sales OS.
 * Thumb-first, 64px tall, absolute positioned within app shell.
 */
import { useUiState, type StepId } from '@/contexts/AppState';
import { useLocation } from 'wouter';

interface Tab {
  id: StepId;
  label: string;
  num: string;
}

const TABS: Tab[] = [
  { id: 'prepare',  label: 'Prepare',  num: '01' },
  { id: 'qualify',  label: 'Qualify',  num: '02' },
  { id: 'activate', label: 'Activate', num: '03' },
  { id: 'followup', label: 'Follow',   num: '04' },
  { id: 'report',   label: 'Report',   num: '05' },
];

export default function BottomNav() {
  const { currentStep, completedSteps } = useUiState();
  const [, setLocation] = useLocation();
  const completed = new Set(completedSteps);

  return (
    <nav
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #C8CCD2',
        display: 'flex',
        height: '64px',
        zIndex: 100,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}
      aria-label="Sales OS navigation"
    >
      {TABS.map(tab => {
        const isActive = currentStep === tab.id;
        const isDone = completed.has(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => setLocation(`/os/${tab.id}`)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '6px 2px',
              border: 'none',
              borderTop: `2px solid ${isActive ? '#A82820' : 'transparent'}`,
              background: isActive ? '#FBF8F1' : 'transparent',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isActive ? '#A82820' : isDone ? '#2E7D32' : '#4A5159',
              cursor: 'pointer',
              transition: 'color 0.15s ease-out, background 0.15s ease-out',
              WebkitTapHighlightColor: 'transparent',
              minWidth: 0,
              position: 'relative',
            }}
          >
            {/* Step number */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '8px',
                opacity: 0.6,
                lineHeight: 1,
              }}
            >
              {tab.num}
            </span>
            {/* Status dot */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: isActive ? '#A82820' : isDone ? '#2E7D32' : '#EFEBE0',
                border: `1px solid ${isActive ? '#A82820' : isDone ? '#2E7D32' : '#C8CCD2'}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: '9px',
                color: isActive || isDone ? '#fff' : '#4A5159',
                fontWeight: 700,
              }}
            >
              {isDone && !isActive ? '✓' : isActive ? '●' : ''}
            </div>
            {/* Label */}
            <span style={{ fontSize: '8px', letterSpacing: '0.03em', lineHeight: 1 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

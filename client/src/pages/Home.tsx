/**
 * Home — Unified Signal OS
 * Main app shell. Mobile-first: bottom nav, sticky header, safe-area aware.
 * On desktop: rendered inside a phone-frame for field-rep utility feel.
 */
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';
import DraftBanner from '@/components/DraftBanner';
import Toast from '@/components/Toast';
import { useAppState } from '@/contexts/AppState';
import { useState } from 'react';
import ClaimScanner from './ClaimScanner';
import FieldManual from './FieldManual';
import Activate from './steps/Activate';
import FollowUp from './steps/FollowUp';
import Prepare from './steps/Prepare';
import Qualify from './steps/Qualify';
import Report from './steps/Report';

type SecondaryTab = 'os' | 'manual' | 'scanner';

function AppShell() {
  const { state } = useAppState();
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>('os');

  const renderStep = () => {
    switch (state.currentStep) {
      case 'prepare':  return <Prepare />;
      case 'qualify':  return <Qualify />;
      case 'activate': return <Activate />;
      case 'followup': return <FollowUp />;
      case 'report':   return <Report />;
      default:         return <Prepare />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#F4F1EA',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sticky header */}
      <AppHeader />

      {/* Draft banner */}
      <DraftBanner />

      {/* Secondary tab bar */}
      <div
        style={{
          display: 'flex',
          background: '#fff',
          borderBottom: '1px solid #C8CCD2',
          flexShrink: 0,
        }}
      >
        {([
          { id: 'os' as SecondaryTab,      label: 'Sales OS',     icon: '⚡' },
          { id: 'manual' as SecondaryTab,  label: 'Field Manual', icon: '📖' },
          { id: 'scanner' as SecondaryTab, label: 'Claim Check',  icon: '🔍' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setSecondaryTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              borderBottom: `2px solid ${secondaryTab === tab.id ? '#A82820' : 'transparent'}`,
              background: secondaryTab === tab.id ? '#FBF8F1' : 'transparent',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: secondaryTab === tab.id ? '#A82820' : '#4A5159',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '14px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: secondaryTab === 'os' ? '72px' : '16px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {secondaryTab === 'os' && renderStep()}
        {secondaryTab === 'manual' && <FieldManual />}
        {secondaryTab === 'scanner' && <ClaimScanner />}
      </main>

      {/* Bottom navigation (only for OS tab) */}
      {secondaryTab === 'os' && <BottomNav />}

      {/* Toast */}
      <Toast />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Mobile: full screen */}
      <div
        className="mobile-app-wrapper"
        style={{
          display: 'none',
          height: '100dvh',
          flexDirection: 'column',
        }}
      >
        <AppShell />
      </div>

      {/* Desktop: phone frame */}
      <div
        className="desktop-wrapper"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1A1D22 0%, #2A2F38 50%, #1A1D22 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        {/* Watermark */}
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
          }}
        >
          Unified Signal OS · Restless Field Toolkit
        </div>

        {/* Phone frame */}
        <div
          style={{
            width: '390px',
            height: '844px',
            borderRadius: '44px',
            background: '#F4F1EA',
            boxShadow: '0 0 0 10px #2A2F38, 0 0 0 12px #3A3F48, 0 32px 80px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Status bar notch */}
          <div
            style={{
              height: '44px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              flexShrink: 0,
              borderBottom: '1px solid #C8CCD2',
            }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#1A1D22' }}>
              9:41
            </span>
            <div
              style={{
                width: '120px',
                height: '28px',
                background: '#1A1D22',
                borderRadius: '14px',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>●●●●</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#1A1D22' }}>100%</span>
            </div>
          </div>

          {/* App content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <AppShell />
          </div>

          {/* Home indicator */}
          <div
            style={{
              height: '20px',
              background: '#F4F1EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ width: '120px', height: '4px', background: '#1A1D22', borderRadius: '2px', opacity: 0.3 }} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-app-wrapper { display: flex !important; }
          .desktop-wrapper { display: none !important; }
        }
      `}</style>
    </>
  );
}

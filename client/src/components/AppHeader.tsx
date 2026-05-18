/**
 * AppHeader — Unified Signal OS
 * Sticky top header: brand, version, pipeline stats summary.
 */
import { useAppState } from '@/contexts/AppState';

export default function AppHeader() {
  const { state } = useAppState();
  const s = state.stats;

  return (
    <header
      style={{
        position: 'relative',
        zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #C8CCD2',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: 0,
            lineHeight: 1,
            color: '#1A1D22',
          }}
        >
          Restless
        </h1>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 6px',
            borderRadius: '2px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px',
            fontWeight: 700,
            background: '#A82820',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Field OS
        </span>
      </div>

      {/* Pipeline quick stats */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          fontWeight: 700,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
          <span style={{ color: '#4A5159', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Out</span>
          <span style={{ color: '#1A1D22', fontSize: '14px' }}>{s.out}</span>
        </div>
        <div style={{ width: '1px', background: '#C8CCD2', margin: '4px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
          <span style={{ color: '#4A5159', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ship</span>
          <span style={{ color: '#A82820', fontSize: '14px' }}>{s.ship}</span>
        </div>
        <div style={{ width: '1px', background: '#C8CCD2', margin: '4px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
          <span style={{ color: '#4A5159', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Yes</span>
          <span style={{ color: '#2E7D32', fontSize: '14px' }}>{s.yes}</span>
        </div>
        {state.trials.length > 0 && (
          <>
            <div style={{ width: '1px', background: '#C8CCD2', margin: '4px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
              <span style={{ color: '#4A5159', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live</span>
              <span style={{ color: '#8A6A14', fontSize: '14px' }}>{state.trials.length}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

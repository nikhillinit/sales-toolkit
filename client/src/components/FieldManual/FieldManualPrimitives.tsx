import type React from 'react';

export interface FieldManualSection {
  id: string;
  label: string;
  kicker: string;
  title: string;
  titleAccent?: string;
  Content: () => React.ReactElement;
}

export function Badge({ children, variant = 'brick' }: { children: React.ReactNode; variant?: 'brick' | 'muted' | 'gold' | 'green' }) {
  const bg = variant === 'brick' ? '#A82820' : variant === 'gold' ? '#8A6A14' : variant === 'green' ? '#2E7D32' : '#4A5159';
  return (
    <span style={{
      display: 'inline-block', padding: '2px 6px', borderRadius: '2px',
      fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
      background: bg, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em',
      marginRight: '4px',
    }}>
      {children}
    </span>
  );
}

export function Panel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{
      background: dark ? '#1A1D22' : '#FBF8F1',
      border: '1px solid #C8CCD2',
      padding: '12px',
      borderRadius: '3px',
      marginBottom: '8px',
      color: dark ? '#fff' : '#1A1D22',
    }}>
      {children}
    </div>
  );
}

export function OsTable({ headers, rows }: { headers: string[]; rows: (React.ReactNode)[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
      <table className="os-table" style={{ width: '100%' }}>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

export function Grid3({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

export function FlowStep({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div className="os-flow-step">
      <div className="os-flow-num">{num}</div>
      <div>
        <strong>{title}</strong>
        <div style={{ fontSize: '13px', color: '#4A5159', fontStyle: 'italic' }}>{sub}</div>
      </div>
    </div>
  );
}

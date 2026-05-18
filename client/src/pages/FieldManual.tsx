/**
 * Field Manual — Unified Signal OS
 * Dropdown shell for the componentized field reference tools.
 */
import { FIELD_MANUAL_SECTIONS } from '@/components/FieldManual/sections';
import { useState } from 'react';

export default function FieldManual() {
  const [activeSectionId, setActiveSectionId] = useState('start-here');
  const activeSection = FIELD_MANUAL_SECTIONS.find(s => s.id === activeSectionId) ?? FIELD_MANUAL_SECTIONS[0];
  const ActiveContent = activeSection.Content;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#F4F1EA',
          borderBottom: '1px solid #C8CCD2',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 700,
            color: '#4A5159',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}
        >
          Tool:
        </span>
        <select
          aria-label="Select field manual tool section"
          value={activeSectionId}
          onChange={e => setActiveSectionId(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: '1px solid #C8CCD2',
            background: '#fff',
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '14px',
            borderRadius: '3px',
            color: '#1A1D22',
            cursor: 'pointer',
            maxWidth: '400px',
          }}
        >
          {FIELD_MANUAL_SECTIONS.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div
        key={activeSectionId}
        className="slide-up"
        style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}
      >
        <div className="os-kicker" style={{ marginBottom: '4px' }}>{activeSection.kicker}</div>
        <h2 className="os-h1" style={{ marginBottom: '12px' }}>
          {activeSection.title}
          {activeSection.titleAccent && (
            <> <em style={{ color: '#A82820', fontStyle: 'normal' }}>{activeSection.titleAccent}</em></>
          )}
        </h2>
        <ActiveContent />
      </div>
    </div>
  );
}

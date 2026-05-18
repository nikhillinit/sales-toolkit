/**
 * Field Manual — Unified Signal OS
 * All 15 tools + appendix. Dropdown navigation. Read-only reference.
 * Unified Signal OS design system.
 */
import { useState } from 'react';

interface Section {
  id: string;
  label: string;
  kicker: string;
  title: string;
  titleAccent?: string;
  content: React.ReactNode;
}

function Badge({ children, variant = 'brick' }: { children: React.ReactNode; variant?: 'brick' | 'muted' | 'gold' | 'green' }) {
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

function Panel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
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

function OsTable({ headers, rows }: { headers: string[]; rows: (React.ReactNode)[][] }) {
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

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

function Grid3({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '12px' }}>
      {children}
    </div>
  );
}

function FlowStep({ num, title, sub }: { num: string; title: string; sub: string }) {
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

// ─── Tool 13 — Harbor Tide Table / Navigable-Window Chart ───────────────────
function Tool13Content() {
  return (
    <div style={{ fontSize: '13px' }}>

      {/* Tide-table document header */}
      <div
        style={{
          background: '#F4ECD6',
          border: '1.4px solid #8B7B5A',
          padding: '12px',
          boxShadow: 'inset 0 0 0 1px rgba(139,123,90,0.18), 0 1px 0 rgba(0,0,0,0.05)',
          marginBottom: '10px',
        }}
      >
        {/* Document header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: '1.4px solid #8B7B5A',
            paddingBottom: '4px',
            marginBottom: '8px',
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '0.12em',
            color: '#3D3625',
            fontSize: '8px',
            fontWeight: 700,
            textTransform: 'uppercase',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          <span>U.S. Harbor Authority · District 7</span>
          <span style={{ opacity: 0.7 }}>Form HA-12 · Tide Table · Posted Notice</span>
          <span>Lat 41°N · Long 71°W</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '9px',
            color: '#8B7B5A',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '2px',
          }}
        >
          The Working Window
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            color: '#3D3625',
            lineHeight: 1.2,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          Time the tide, hold the channel — one stick is designed to help the crew stay in the working window longer.
        </div>

        {/* SVG: Harbor Tide Chart */}
        <HarborTideChart />

        {/* Caption */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '6px',
            fontStyle: 'italic',
            fontSize: '11px',
            color: '#5A4E35',
            letterSpacing: '0.03em',
          }}
        >
          Solid (Restless) stays in the channel. Dashed (competitor) arrives overloaded at high tide, grounds when it falls.
        </div>
      </div>

      {/* Two-column: Reading the Chart + Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '10px' }}>

        {/* Reading the Chart */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            padding: '12px',
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#1A1D22',
              marginBottom: '8px',
            }}
          >
            Reading the Chart
          </div>
          {[
            { n: '1', text: <>Three water-level zones — <strong>above safe approach</strong> (overload), <strong>navigable window</strong> (the only place a vessel can transit), <strong>below navigable draft</strong> (grounded).</> },
            { n: '2', text: <>The <strong style={{ color: '#5A6B78' }}>dashed vessel</strong> arrives overloaded at high tide, then falls out of the window when the tide drops.</> },
            { n: '3', text: <>The <strong style={{ color: '#B86E00' }}>solid vessel</strong> times the tide — stays inside the navigable channel for the whole 12-hour passage.</> },
            { n: '4', text: <>Ask the buyer: <em>"When in the passage does your crew currently fall below draft — and what are they reaching for to stay in the channel?"</em></> },
            { n: '5', text: <>Hand them the chart. The right window, at the right depth, for the whole passage.</> },
          ].map(item => (
            <div key={item.n} style={{ display: 'flex', gap: '8px', marginBottom: '6px', lineHeight: 1.4 }}>
              <span
                style={{
                  flexShrink: 0,
                  width: '18px',
                  height: '18px',
                  background: '#A82820',
                  color: '#fff',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '11px',
                }}
              >
                {item.n}
              </span>
              <span style={{ fontSize: '12px' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Chart Legend */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            padding: '12px',
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#1A1D22',
              marginBottom: '8px',
            }}
          >
            Chart Legend
          </div>
          {[
            { color: '#B86E00', dash: false, label: <><strong>Solid</strong> — Vessel that times the tide (Restless)</> },
            { color: '#5A6B78', dash: true,  label: <><strong>Dashed</strong> — Vessel that misses the window (spike, then ground)</> },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <svg width="28" height="10" style={{ flexShrink: 0 }}>
                <line
                  x1="0" y1="5" x2="28" y2="5"
                  stroke={item.color}
                  strokeWidth="2.5"
                  strokeDasharray={item.dash ? '4 3' : undefined}
                />
              </svg>
              <span style={{ fontSize: '12px' }}>{item.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '12px',
                background: 'rgba(184,110,0,0.12)',
                border: '1px solid #C8CCD2',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '12px' }}><strong>Channel band</strong> — Navigable window (the only safe water)</span>
          </div>
        </div>
      </div>

      {/* Segment Tide Tables */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #C8CCD2',
          borderRadius: '3px',
          padding: '12px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#1A1D22',
            marginBottom: '8px',
          }}
        >
          Segment Tide Tables
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="os-table" style={{ width: '100%', fontSize: '11px' }}>
            <thead>
              <tr>
                <th>Segment / Port</th>
                <th>Passage Length</th>
                <th>Tide-Out Window</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['First Responder', '24-hour passage', 'Hour 14–18 · overnight ebb'],
                ['Military / MWR',  'Field-exercise day', 'Hour 10–12 · ruck-march drawdown'],
                ['Healthcare',      '12-hour shift', 'Hour 6–8 · afternoon ebb'],
                ['Industrial',      '10-hour hot shift', 'Hour 7–9 · heat + fatigue'],
                ['Gym / Combat',    'Training session', 'Hour 2–3 · endurance wall'],
              ].map(([seg, len, win]) => (
                <tr key={seg}>
                  <td><strong>{seg}</strong></td>
                  <td>{len}</td>
                  <td style={{ color: '#A82820', fontWeight: 600 }}>{win}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Companion Sketches */}
      <div
        style={{
          background: '#FBF8F1',
          border: '1px solid #C8CCD2',
          borderRadius: '3px',
          padding: '10px 12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '8px',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#4A5159',
            }}
          >
            Companion Sketches
          </div>
          <div style={{ fontSize: '10px', color: '#4A5159', fontStyle: 'italic' }}>Full reference · Bonus 1/4 (page 24)</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { num: '1', label: 'One Stick vs. Stack', svg: <OneStickSvg /> },
            { num: '2', label: 'Three Gates',         svg: <ThreeGatesSvg /> },
            { num: '3', label: 'Activation Loop',     svg: <ActivationLoopSvg /> },
            { num: '4', label: 'Champion Protection', svg: <ChampionSvg /> },
          ].map(item => (
            <div
              key={item.num}
              style={{
                background: '#fff',
                border: '1px solid #C8CCD2',
                borderRadius: '3px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {item.svg}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#1A1D22',
                  marginTop: '4px',
                }}
              >
                {item.num} · {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Harbor Tide Chart SVG ────────────────────────────────────────────────────
function HarborTideChart() {
  const W = 340;
  const H = 200;
  const padL = 36;
  const padR = 12;
  const padT = 24;
  const padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Y zones (0 = top = high tide)
  const yTop = padT;                          // top of chart
  const yOverloadLine = padT + chartH * 0.18; // "above safe approach" line
  const yChannelTop = padT + chartH * 0.28;   // top of navigable channel
  const yChannelBot = padT + chartH * 0.68;   // bottom of navigable channel
  const yGroundLine = padT + chartH * 0.80;   // "below navigable draft" line
  const yBot = padT + chartH;                 // bottom of chart

  // X: 13 hours (0–12)
  const hours = 13;
  const xAt = (h: number) => padL + (h / 12) * chartW;

  // Tide curve: sinusoidal, period 12h, high at h=0, low at h=6
  const tideY = (h: number) => {
    const norm = (Math.cos((h / 12) * Math.PI * 2) + 1) / 2; // 1 at h=0, 0 at h=6
    return padT + (1 - norm) * chartH;
  };

  // Solid vessel (Restless): stays inside navigable window
  // Starts at channel midpoint, gently rides the tide within bounds
  const solidY = (h: number) => {
    const mid = (yChannelTop + yChannelBot) / 2;
    const amp = (yChannelBot - yChannelTop) * 0.35;
    return mid + amp * Math.sin((h / 12) * Math.PI * 2);
  };

  // Dashed vessel (competitor): follows raw tide — overloaded at start, grounded at end
  const dashedY = (h: number) => tideY(h);

  // Build path strings
  const buildPath = (fn: (h: number) => number, steps = 120) => {
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const h = (i / steps) * 12;
      return `${xAt(h).toFixed(1)},${fn(h).toFixed(1)}`;
    });
    return `M ${pts.join(' L ')}`;
  };

  const solidPath  = buildPath(solidY);
  const dashedPath = buildPath(dashedY);

  // Hour tick labels
  const hourTicks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', maxWidth: '100%' }}
      aria-label="Harbor tide chart showing navigable window"
    >
      {/* Background */}
      <rect x="0" y="0" width={W} height={H} fill="#F4ECD6" />

      {/* Zone fills */}
      {/* Overload zone (above safe approach) */}
      <rect
        x={padL} y={yTop}
        width={chartW} height={yOverloadLine - yTop}
        fill="rgba(168,40,32,0.07)"
      />
      {/* Navigable channel (the working window) */}
      <rect
        x={padL} y={yChannelTop}
        width={chartW} height={yChannelBot - yChannelTop}
        fill="rgba(184,110,0,0.10)"
      />
      {/* Grounded zone (below navigable draft) */}
      <rect
        x={padL} y={yGroundLine}
        width={chartW} height={yBot - yGroundLine}
        fill="rgba(90,107,120,0.07)"
      />

      {/* Zone boundary lines */}
      <line x1={padL} y1={yOverloadLine} x2={padL + chartW} y2={yOverloadLine}
        stroke="#8B7B5A" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1={padL} y1={yChannelTop} x2={padL + chartW} y2={yChannelTop}
        stroke="#B86E00" strokeWidth="1" />
      <line x1={padL} y1={yChannelBot} x2={padL + chartW} y2={yChannelBot}
        stroke="#B86E00" strokeWidth="1" />
      <line x1={padL} y1={yGroundLine} x2={padL + chartW} y2={yGroundLine}
        stroke="#8B7B5A" strokeWidth="0.8" strokeDasharray="4 3" />

      {/* Zone labels */}
      <text x={padL + 4} y={yTop + 10}
        fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="7"
        fill="#A82820" letterSpacing="0.08em">
        ABOVE SAFE APPROACH
      </text>
      <text x={padL + 4} y={(yChannelTop + yChannelBot) / 2 + 3}
        fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="8"
        fill="#B86E00" letterSpacing="0.08em">
        NAVIGABLE WINDOW
      </text>
      <text x={padL + 4} y={yGroundLine + 12}
        fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="7"
        fill="#5A6B78" letterSpacing="0.08em">
        BELOW NAVIGABLE DRAFT
      </text>

      {/* Dashed vessel path (competitor) */}
      <path
        d={dashedPath}
        fill="none"
        stroke="#5A6B78"
        strokeWidth="1.8"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />

      {/* Solid vessel path (Restless) */}
      <path
        d={solidPath}
        fill="none"
        stroke="#B86E00"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Chart frame */}
      <rect
        x={padL} y={padT}
        width={chartW} height={chartH}
        fill="none"
        stroke="#8B7B5A"
        strokeWidth="1"
      />

      {/* X-axis hour ticks */}
      {hourTicks.map(h => (
        <g key={h}>
          <line
            x1={xAt(h)} y1={padT + chartH}
            x2={xAt(h)} y2={padT + chartH + 4}
            stroke="#8B7B5A" strokeWidth="0.8"
          />
          <text
            x={xAt(h)} y={padT + chartH + 13}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="8"
            fill="#3D3625"
          >
            {h}h
          </text>
        </g>
      ))}

      {/* Y-axis label */}
      <text
        x={padL - 4} y={padT + chartH / 2}
        textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="7"
        fill="#8B7B5A"
        transform={`rotate(-90, ${padL - 4}, ${padT + chartH / 2})`}
        letterSpacing="0.1em"
      >
        WATER LEVEL
      </text>

      {/* X-axis label */}
      <text
        x={padL + chartW / 2} y={H - 2}
        textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="7"
        fill="#8B7B5A"
        letterSpacing="0.1em"
      >
        PASSAGE TIME (HOURS)
      </text>

      {/* Vessel labels at end of paths */}
      <text
        x={xAt(12) + 2} y={solidY(12)}
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="7"
        fill="#B86E00"
        fontWeight="700"
        dominantBaseline="middle"
      >
        ●
      </text>
      <text
        x={xAt(12) + 2} y={dashedY(12)}
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="7"
        fill="#5A6B78"
        dominantBaseline="middle"
      >
        ○
      </text>
    </svg>
  );
}

// ─── Companion Sketch SVGs ────────────────────────────────────────────────────
function OneStickSvg() {
  return (
    <svg viewBox="0 0 120 60" width="100%" style={{ maxHeight: '60px' }}>
      {/* Stack (left) */}
      {[0, 12, 24].map((y, i) => (
        <rect key={i} x="6" y={6 + y} width="36" height="10" fill="none" stroke="#5A6B78" strokeWidth="1" />
      ))}
      <text x="24" y="52" textAnchor="middle" fontSize="7" fill="#5A6B78" fontFamily="sans-serif">Stack</text>
      {/* Arrow */}
      <text x="58" y="24" textAnchor="middle" fontSize="12" fill="#1A1D22">→</text>
      {/* One stick (right) */}
      <rect x="74" y="14" width="40" height="16" fill="rgba(184,110,0,0.15)" stroke="#B86E00" strokeWidth="1.4" />
      <text x="94" y="52" textAnchor="middle" fontSize="7" fill="#B86E00" fontFamily="sans-serif" fontWeight="bold">One Stick</text>
    </svg>
  );
}

function ThreeGatesSvg() {
  const gates = ['Pain', 'Access', 'Fit'];
  return (
    <svg viewBox="0 0 120 60" width="100%" style={{ maxHeight: '60px' }}>
      {gates.map((g, i) => {
        const x = 8 + i * 38;
        return (
          <g key={g}>
            <rect x={x} y="12" width="28" height="28" rx="2" fill="rgba(168,40,32,0.08)" stroke="#A82820" strokeWidth="1" />
            <text x={x + 14} y="30" textAnchor="middle" fontSize="7" fill="#A82820" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700">{g}</text>
            {i < 2 && <text x={x + 30} y="28" fontSize="9" fill="#1A1D22">→</text>}
          </g>
        );
      })}
      <text x="60" y="54" textAnchor="middle" fontSize="7" fill="#4A5159" fontFamily="sans-serif">All 3 pass → activate</text>
    </svg>
  );
}

function ActivationLoopSvg() {
  const steps = ['Code', 'Ship', 'Use', 'Yes/No', 'Route'];
  return (
    <svg viewBox="0 0 120 60" width="100%" style={{ maxHeight: '60px' }}>
      {steps.map((s, i) => {
        const x = 4 + i * 23;
        return (
          <g key={s}>
            <rect x={x} y="18" width="18" height="16" rx="2" fill="rgba(184,110,0,0.10)" stroke="#B86E00" strokeWidth="0.8" />
            <text x={x + 9} y="29" textAnchor="middle" fontSize="5.5" fill="#3D3625" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700">{s}</text>
            {i < steps.length - 1 && <text x={x + 20} y="28" fontSize="7" fill="#1A1D22">›</text>}
          </g>
        );
      })}
      {/* Loop arrow */}
      <path d="M 116 26 Q 116 8 60 8 Q 4 8 4 26" fill="none" stroke="#B86E00" strokeWidth="0.8" strokeDasharray="2 2" />
      <polygon points="4,26 2,21 7,21" fill="#B86E00" />
    </svg>
  );
}

function ChampionSvg() {
  return (
    <svg viewBox="0 0 120 60" width="100%" style={{ maxHeight: '60px' }}>
      {/* Shield */}
      <path d="M 60 8 L 80 16 L 80 34 Q 80 48 60 54 Q 40 48 40 34 L 40 16 Z"
        fill="rgba(46,125,50,0.12)" stroke="#2E7D32" strokeWidth="1.2" />
      <text x="60" y="34" textAnchor="middle" fontSize="8" fill="#2E7D32"
        fontFamily="'Barlow Condensed', sans-serif" fontWeight="700">CHAMP</text>
      {/* Arrows pointing in */}
      {[[-18, 0], [18, 0], [0, -18]].map(([dx, dy], i) => (
        <line key={i}
          x1={60 + dx * 1.8} y1={30 + dy * 1.8}
          x2={60 + dx * 0.9} y2={30 + dy * 0.9}
          stroke="#A82820" strokeWidth="1" markerEnd="url(#arr)" />
      ))}
      <defs>
        <marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <polygon points="0,0 4,2 0,4" fill="#A82820" />
        </marker>
      </defs>
      <text x="60" y="56" textAnchor="middle" fontSize="6" fill="#4A5159" fontFamily="sans-serif">Protect the champion</text>
    </svg>
  );
}

// ─── Sections array ───────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'start-here',
    label: 'Start Here · Field Entry',
    kicker: 'Start Here · Field Entry',
    title: 'V0 Live Flow',
    titleAccent: '& Activation',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>
          Every trial leaving the building must check these 8 fields. No blanks. No ship.
        </p>
        <OsTable
          headers={['Field', 'Example (Good)']}
          rows={[
            ['1. Named Human', '"Sgt. Ramirez, MWR coordinator"'],
            ['2. Current Routine', '"Crew buys energy drinks out of pocket"'],
            ['3. Real Use Window', '"Pre-PT, 0530, 3x/week"'],
            ['4. Buyer-Named Risk', '"Sgt. Ramirez worried crew will mock it"'],
            ['5. Trial Type', '1 box (20 sticks) for squad of 12'],
            ['6. Unique Code', '"MRZ-0526-A" — every trial gets a code'],
            ['7. Follow-Up Date', '"Check Monday after weekend ruck. Text me."'],
            ['8. Binary Success Q', '"If 8+ say yes, I\'ll bring the PO."'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'tool-01',
    label: 'Tool 01 · Sales Defined',
    kicker: 'Tool 01 · Sales Defined',
    title: 'What Is My Sale',
    titleAccent: 'to Be Made?',
    content: (
      <>
        <Grid3>
          <Panel><Badge>01 / What</Badge><div className="os-h3">What is my sale to be made?</div><div style={{ fontSize: '13px' }}>One clearly dosed <strong>energy-plus-hydration stick</strong> for crews that already buy energy drinks — traded for a real-shift trial and an honest yes/no.</div></Panel>
          <Panel><Badge>02 / Who</Badge><div className="os-h3">To whom?</div><div style={{ fontSize: '13px' }}><strong>P1</strong> responders &amp; military-adjacent · <strong>P2</strong> gym / combat · <strong>P3</strong> healthcare, <em>label-first</em>.</div></Panel>
          <Panel><Badge>03 / Steps</Badge><div className="os-h3">Six key steps</div><div style={{ fontSize: '13px' }}>Name the room — earn the intro — ship a <strong>coded micro-trial</strong> — real shift use — honest yes/no — route.</div></Panel>
        </Grid3>
        <div className="os-warn"><strong>Miss the floor Monday, week's behind.</strong> Report the miss — don't hide it.</div>
      </>
    ),
  },
  {
    id: 'tool-02a',
    label: 'Tool 02A · Vitamins & Painkillers',
    kicker: 'Tool 02A · Vitamins & Painkillers',
    title: 'Vitamins',
    titleAccent: '& Painkillers',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>Label-first, evidence-first, no overclaim.</p>
        <Panel>
          <div className="os-h3">What Do You Sell?</div>
          <div style={{ fontSize: '13px' }}>A portable energy-and-hydration stick for long shifts. <strong>Don't say:</strong> wellness, biohack. <strong>Do say:</strong> energy + hydration, one stick, long shifts.</div>
        </Panel>
        <OsTable
          headers={['Segment', 'Read', 'Why (Buyer Words)']}
          rows={[
            ['CFD / EMS', <Badge>Painkiller</Badge>, '"Stacking coffee and Monster on overnights"'],
            ['Healthcare', <Badge variant="muted">Vitamin</Badge>, '"Compliance asks for evidence"'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'tool-02b',
    label: 'Tool 02B · Call Router',
    kicker: 'Tool 02B · Call Router',
    title: 'Call Router',
    titleAccent: '& From–To',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>When the buyer talks, route. When they resist, reframe.</p>
        <OsTable
          headers={['Situation', 'From (Their Frame)', 'To (Our Frame)']}
          rows={[
            ['3 AM fatigue', 'Another can', 'Real-shift test'],
            ['Crew buys own', 'Budget objection', 'Crew-choice trial'],
            ['Send info', 'Lost in inbox', 'Artifact + permission'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'tool-03',
    label: 'Tool 03 · Walk & Talk',
    kicker: 'Tool 03 · Walk & Talk',
    title: 'Walk',
    titleAccent: '& Talk',
    content: (
      <>
        <Panel>
          <Badge>30 Seconds</Badge>
          <div className="os-quote" style={{ marginTop: '8px' }}>
            "Crews working overnight shifts stack coffee and Liquid I.V. to stay sharp — two products, two wrappers, no dose they can verify. Restless is <strong>one stick, one label</strong>: 120 mg caffeine, 240 mg L-theanine, and electrolytes. Can I send a <strong>coded five-stick trial</strong> for the crew to test on one real overnight?"
          </div>
        </Panel>
        <Grid2>
          <Panel dark>
            <div style={{ fontSize: '12px', color: '#A82820', marginBottom: '4px' }}>Primary Phrase</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', fontWeight: 700 }}>
              "Built for the<br /><span style={{ color: '#A82820' }}>back half."</span>
            </div>
          </Panel>
          <Panel>
            <div className="os-h3">Do · Don't</div>
            <div style={{ fontSize: '13px' }}>
              <strong style={{ color: '#2E7D32' }}>Do:</strong> Rehearse out loud. End with coded-trial ask.<br />
              <strong style={{ color: '#A82820' }}>Don't:</strong> Use "premium/clean/innovative".
            </div>
          </Panel>
        </Grid2>
      </>
    ),
  },
  {
    id: 'tool-04',
    label: 'Tool 04 · Network Discipline',
    kicker: 'Tool 04 · Network Discipline',
    title: 'Network Every Week',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>A 5-day rhythm. No cold decks. No unnamed ships.</p>
        <Grid3>
          <Panel><strong>Mon: Old Warm</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>3 dormant contacts. Text, no ask.</span></Panel>
          <Panel><strong>Tue: New Warm</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>2 recent intros within 72h.</span></Panel>
          <Panel><strong>Wed: Cold In</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Named, researched by hand.</span></Panel>
        </Grid3>
      </>
    ),
  },
  {
    id: 'tool-05',
    label: 'Tool 05 · Bullseye Targets',
    kicker: 'Tool 05 · Bullseye Targets',
    title: 'Bullseye',
    titleAccent: 'Targets',
    content: (
      <>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <BullseyeRings />
          <div style={{ flex: 1, minWidth: '180px' }}>
            <OsTable
              headers={['Ring', 'Segment']}
              rows={[
                [<Badge>R1</Badge>, <><strong>Responder station &amp; MRF.</strong></>],
                [<Badge variant="muted">R2</Badge>, <><strong>555-Firehouses &amp; base MWR.</strong></>],
                [<Badge variant="muted">R3</Badge>, <><strong>CF / BJJ / MMA.</strong> Coach-first only.</>],
              ]}
            />
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'tool-06',
    label: 'Tool 06 · Competitive Map',
    kicker: 'Tool 06 · Competitive Map',
    title: 'What They',
    titleAccent: 'Already Drink',
    content: (
      <Grid2>
        <Panel><div className="os-h3"><Badge>Restless</Badge></div><div style={{ fontSize: '13px' }}><strong>Why:</strong> One mix for 3am slump. <strong>Compared:</strong> Moderate caffeine + L-theanine (120mg / 240mg).</div></Panel>
        <Panel><div className="os-h3"><Badge variant="muted">Coffee / Monster / LI.V.</Badge></div><div style={{ fontSize: '13px' }}><strong>Coffee:</strong> Free, social. <strong>Monster:</strong> Habit, spike. <strong>LI.V:</strong> Hydration only.</div></Panel>
      </Grid2>
    ),
  },
  {
    id: 'tool-07',
    label: 'Tool 07 · Qualification Protocol',
    kicker: 'Tool 07 · Qualification Protocol',
    title: 'Four-Gear',
    titleAccent: 'Protocol',
    content: (
      <>
        <Panel>
          <FlowStep num="1" title="Named Pain" sub='"Where does the current routine fall short?"' />
          <FlowStep num="2" title="Access" sub='"Who decides what the crew tries?"' />
          <FlowStep num="3" title="Trial Fit" sub='"Where would a small trial be tested?"' />
          <FlowStep num="4" title="Feedback Loop" sub='"Who will tell me if it flopped?"' />
        </Panel>
        <div className="os-warn"><strong>Four pass → complete Activation Standard.</strong> Any "no" → thank, exit clean, code it.</div>
      </>
    ),
  },
  {
    id: 'tool-08',
    label: 'Tool 08 · Prospecting Script',
    kicker: 'Tool 08 · Prospecting Script',
    title: 'Prospecting',
    titleAccent: 'Script',
    content: (
      <OsTable
        headers={['Time', 'Script']}
        rows={[
          [<Badge>:00</Badge>, '"Hi [name], this is [your name] with Restless. I know you didn\'t expect my call — I\'ll be quick."'],
          [<Badge>:10</Badge>, '"I work with [named peer] on a simple thing: energy and hydration in one stick for long shifts."'],
          [<Badge>:25</Badge>, '"Two questions — does your crew hit a wall on the back half? And who decides if they try something new?"'],
        ]}
      />
    ),
  },
  {
    id: 'tool-09',
    label: 'Tool 09 · Written Outreach',
    kicker: 'Tool 09 · Written Outreach',
    title: 'Breakthrough',
    titleAccent: 'Email',
    content: (
      <Panel>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', marginBottom: '8px', color: '#4A5159' }}>
          Subject: <strong style={{ color: '#1A1D22' }}>Would your coaches try something new on the back half?</strong>
        </div>
        <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
          Marcus —<br /><br />
          Short note, no attachment. We make <strong>Restless</strong> — one stick, energy + hydration for long sessions. Built to sit next to the coffee pot, not replace it.<br /><br />
          One <strong>question</strong>: would your coaches be willing to try a <strong>5-stick kit</strong> for two weeks and give me an honest yes/no?<br /><br />
          One <strong>ask</strong>: if yes, I'll ship coach-only under a unique trial code. If the coaches say no, that ends it.
        </div>
      </Panel>
    ),
  },
  {
    id: 'operating-spine',
    label: 'Operating Spine · One Flow, Two Gates',
    kicker: 'Operating Spine',
    title: 'One Flow,',
    titleAccent: 'Two Gates',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>Do not treat Tools 11 and 12 as two separate call scripts. Discovery answers and objections blur together in the field. Use one flow.</p>
        <Panel dark>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', letterSpacing: '0.06em', color: '#A82820', marginBottom: '8px' }}>V0 · ONE LIVE FLOW</div>
          {[
            { num: '1', label: 'HEAR', sub: 'Ask one segment opener. Capture current routine in buyer\'s words.' },
            { num: '2', label: 'MIRROR', sub: 'Repeat the exact phrase before interpreting it.' },
            { num: '3', label: 'DIAGNOSE', sub: 'Find pain window, access, trial fit, and feedback path.' },
            { num: '4', label: 'ROUTE RESISTANCE', sub: 'If buyer pushes back: Encourage → Clarify → Confirm → Respond → Check.' },
            { num: '5', label: 'DECIDE', sub: 'Trial / Evidence route / Retime / Honest Out.' },
            { num: '6', label: 'SHIP-CHECK', sub: 'Product only leaves after canonical Activation Standard is complete.' },
          ].map(step => (
            <div key={step.num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '11px', color: '#A82820', minWidth: '18px', paddingTop: '1px' }}>{step.num}</div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em' }}>{step.label}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '1px' }}>{step.sub}</div>
              </div>
            </div>
          ))}
        </Panel>
        <OsTable
          headers={['Buyer Says', 'Treat First As', 'Rep Move']}
          rows={[
            ['"We already have coffee."', 'Discovery answer', '"That makes sense. When does coffee stop cutting it, if ever?"'],
            ['"The crew won\'t care."', 'Social-risk signal', '"Who would judge it first, and what would make it get ignored?"'],
            ['"Send me info."', 'Process friction', '"Short note, label, or both — and what follow-up is okay?"'],
            ['"Can you send 50 sticks?"', 'Trial-discipline test', 'Clarify feedback loop; use Honest Out if signal is not protected.'],
            ['"Is it certified?"', 'Institutional gate', 'Route evidence-first; do not push trial if certification is hard gate.'],
          ]}
        />
        <div className="os-warn"><strong>Rule:</strong> Ask until you know the route. Respond only after you know whether the issue is habit, proof, price, policy, social risk, format, or a real no.</div>
      </>
    ),
  },
  {
    id: 'tool-10',
    label: 'Tool 10 · Story Vault',
    kicker: 'Tool 10 · Story Vault',
    title: 'Story',
    titleAccent: 'Vault',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>Equip yourself with the <strong>right story at the right time for the right reason</strong>. The vault fills the credibility gap without forcing overclaim.</p>
        <div className="os-h2">The Four Moves</div>
        <OsTable
          headers={['Move', 'Rep Action', 'Restless Translation']}
          rows={[
            ['Curate', 'Capture raw facts and emotions.', 'Station-table moments, night-shift routines, trial outcomes, customer phrases.'],
            ['Categorize', 'Place story in a matrix before shaping it.', 'Success / Failure / Fun / Legend — and where it belongs in the motion.'],
            ['Construct', 'Turn facts into a tight story using Five C\'s.', 'Character, Context, Conflict, Climax, Closure. Keep it short and compliant.'],
            ['Convey', 'Tell the story in the right length for the moment.', '15 sec cold outreach · 45 sec discovery · 90 sec founder/community context.'],
          ]}
        />
        <Panel>
          <div className="os-h3" style={{ marginTop: 0 }}>The Restless Story Rule</div>
          <div style={{ fontSize: '13px', lineHeight: 1.6 }}>Lead with the buyer's world. Use founder or military context only when it helps credibility. Do not borrow experience the rep did not earn.</div>
          <div className="os-quote" style={{ marginTop: '8px' }}>"Daniel built Restless because he saw a gap in what was available to people working long, demanding days. The product still has to earn trust on the label and in the trial — not borrow it from his background."</div>
        </Panel>
        <div className="os-h2">Five C's Framework</div>
        <OsTable
          headers={['C', 'What It Means', 'Restless Guardrail']}
          rows={[
            ['Character', 'Who is the human?', 'Use role and world, not private details.'],
            ['Context', 'What was happening?', 'Name the real use window.'],
            ['Conflict', 'What made this difficult?', 'Name the risk: taste, label, policy, price, culture, incumbent habit.'],
            ['Climax', 'What decision or moment changed?', 'Trial accepted, label reviewed, clean no, reorder, referral.'],
            ['Closure', 'Why does this story matter?', 'End with the principle and the next action.'],
          ]}
        />
        <div className="os-h2">Story Matrix</div>
        <OsTable
          headers={['', 'Failure', 'Success']}
          rows={[
            ['Legend / heavy', 'Dead Sample · Label burned by overclaim', 'Label Before Sample · Trust the Label, Not the Logo'],
            ['Fun / light', 'Crew roasted the flavor · Member mocked powder', 'Station Table, Not Wellness · Coach uses it and members ask'],
          ]}
        />
        <div className="os-h2">Story Cards</div>
        <Panel><Badge>Failure A</Badge> <strong>"The Dead Sample"</strong><br /><span style={{ fontSize: '13px', color: '#4A5159', display: 'block', marginTop: '4px' }}>A new rep shipped to a station with no named owner, no use window, no code. At follow-up, nobody could answer. <em>Lesson: No code, no owner, no use window, no follow-up means no ship.</em></span><div className="os-quote" style={{ marginTop: '6px' }}>"We learned the hard way that sending product is not progress. If there is no named owner, use window, code, and follow-up, it is just inventory leaving the building."</div></Panel>
        <Panel><Badge variant="green">Success B</Badge> <strong>"Station Table, Not Wellness Program"</strong><br /><span style={{ fontSize: '13px', color: '#4A5159', display: 'block', marginTop: '4px' }}>Captain didn't want to push anything new. Rep reframed: "Do not sell it. Put a small coded pack on the table and let the crew decide."</span><div className="os-quote" style={{ marginTop: '6px' }}>"I'm not asking you to start a program. I'm asking for a small station-table test and one honest yes/no."</div></Panel>
        <Panel><Badge variant="green">Success C</Badge> <strong>"The Coach's Caveat"</strong><br /><span style={{ fontSize: '13px', color: '#4A5159', display: 'block', marginTop: '4px' }}>Coach asked for every recommendation came with a caveat: too much caffeine, no electrolytes, bad fit for skill work. Rep asked for coach-only trial first.</span><div className="os-quote" style={{ marginTop: '6px' }}>"I would rather have you try it yourself before I ask for shelf space. If you would not use it before training, your members should not hear about it."</div></Panel>
        <Panel><Badge variant="gold">Legend D</Badge> <strong>"Label Before Sample"</strong><br /><span style={{ fontSize: '13px', color: '#4A5159', display: 'block', marginTop: '4px' }}>Healthcare/military buyer asked for proof before trial. Rep slowed down, sent Supplement Facts, dose rationale, claim guardrails, certification status first.</span><div className="os-quote" style={{ marginTop: '6px' }}>"For your lane, I would rather be reviewed than sampled. If the label does not pass, the product should not move."</div></Panel>
        <Panel><Badge variant="gold">Legend E</Badge> <strong>"The Founder Story, Used Right"</strong><br /><span style={{ fontSize: '13px', color: '#4A5159', display: 'block', marginTop: '4px' }}>Buyer asks "Why you?" Rep uses Daniel's story once, then returns to the buyer's routine, the label, and the trial.</span><div className="os-quote" style={{ marginTop: '6px' }}>"You should not trust a new brand because of a story. Start with the label, then let one real use window decide."</div></Panel>
        <div className="os-h2">Narrative Themes</div>
        <OsTable
          headers={['Theme', 'Failure', 'Success', 'Line']}
          rows={[
            ['The Back Half', 'Coffee/cans work early; problem shows up at 3am or last hours.', 'Restless earns a test in the moment where the current routine is hardest.', '"Restless is not built to win a taste test at 10am. It has to earn a place in the back half."'],
            ['Trust the Label', 'Tactical-looking brands win attention without answering the real question.', 'Rep leads with exact doses, Supplement Facts, no proprietary-blend posture.', '"You should not trust a new brand because of a story. Start with the label."'],
            ['Crew Choice', 'Captain doesn\'t want to become the person who pushed a product the group mocks.', 'Rep protects the champion by making the trial small, optional, coded, easy to exit.', '"I\'m not asking you to sell it to the crew. I\'m asking permission for the crew to judge it."'],
            ['One Stick vs. Stack', 'ICP already creates a messy stack: coffee + LI.V. + Monster + pre-workout.', 'Restless tests whether one stick can simplify the routine.', '"Most people aren\'t buying one product. They\'re building a routine out of two or three."'],
            ['Made for My Shift', 'Wellness language feels soft, corporate, detached from demanding work.', 'Rep names the buyer\'s world before naming the formula.', '"This is not a wellness initiative. It is a small test for people already buying energy products."'],
          ]}
        />
        <div className="os-h2">Story Capture Prompts</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '8px' }}>Use after every field interaction, follow-up call, event, trial, or rejection.</p>
        <OsTable
          headers={['Prompt', 'What to Capture']}
          rows={[
            ['Who was the person?', 'Captain, nurse manager, coach, MWR lead, safety lead, athlete.'],
            ['What was the real moment?', '3am overnight, back half of a 24, last hour of a 12, post-WOD drag, heat-season floor shift.'],
            ['What were they already using?', 'Coffee, Monster, Reign, Celsius, C4, Ghost, Liquid I.V., Zyn, water, pre-workout, nothing.'],
            ['What did they fear?', 'Crew mockery, bad taste, policy violation, being sold, dead inventory, wasting budget.'],
            ['What exact phrase did they use?', '"The guys grab whatever\'s cold." "I need the label first." "Members won\'t mix powder."'],
            ['What changed?', 'Trial accepted, trial blocked, label sent, code redeemed, reorder, referral, clean exit.'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'tool-11',
    label: 'Tool 11 · Ask & Listen',
    kicker: 'Tool 11 · Ask & Listen',
    title: 'Segment',
    titleAccent: 'Pain Map',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>Use the right question at the right time to uncover the buyer's functional, social, emotional, and institutional needs. Ask, listen, mirror, and route. Do not lecture.</p>
        <div className="os-h2">The Five Types of Questions</div>
        <OsTable
          headers={['Type', 'Job', 'Restless Use']}
          rows={[
            ['Connection', 'Create a spark, build trust.', 'Show you understand the buyer\'s world without pretending to be them.'],
            ['Discovery', 'Gain information and understand functional needs.', 'Learn current routine, use window, buyer role, and what already happens.'],
            ['Qualifying', 'Determine importance, buy-in, and whether the conversation is worth having.', 'Identify authority, policy gates, trial feasibility, timing, and fit.'],
            ['Clarifying', 'Seek to understand, gain confirmation, dissipate heat.', 'Mirror the buyer\'s exact words and avoid translating too soon.'],
            ['Impact', 'Uncover insights, social needs, emotional needs, and values.', 'Reveal who could look bad, what makes adoption safe, and why the routine matters.'],
          ]}
        />
        <div className="os-h2">Listening Levels</div>
        <OsTable
          headers={['Level', 'What the Rep Hears', 'What to Log']}
          rows={[
            ['1 · Listen to respond', 'The surface answer.', 'Product used, buyer role, yes/no, email, address.'],
            ['2 · Listen for how they feel', 'The emotional current.', 'Defensive, skeptical, proud, rushed, curious, embarrassed, protective.'],
            ['3 · Listen for why it matters', 'The stakes under the words.', 'Crew credibility, clinical scrutiny, coach authority, budget risk, autonomy, policy.'],
          ]}
        />
        <Panel>
          <div className="os-h3" style={{ marginTop: 0 }}>Default Move: Mirror Before Moving</div>
          <div className="os-quote">"That makes sense — [exact phrase]. When new products show up, what usually makes people embrace them versus ignore them?"</div>
        </Panel>
        <div className="os-h2">Segment Identity Heat Map</div>
        <OsTable
          headers={['Segment', 'Functional', 'Social', 'Emotional', 'Institutional', 'Prep Move']}
          rows={[
            ['First responders', 'Med', 'High ●', 'High ●', 'Low–Med', 'Protect crew dynamics before formula.'],
            ['Military / MWR', 'Med', 'Med', 'Low–Med', 'High ●', 'Lead with autonomy, label, and review path.'],
            ['Healthcare', 'High ●', 'Low', 'Med', 'High ●', 'Prep evidence and claim restraint before sample.'],
            ['Industrial', 'High ●', 'Low', 'Med', 'Low–Med', 'Anchor on hot-shift practicality and water access.'],
            ['Gym / combat', 'Med', 'High ●', 'Low–Med', 'Low', 'Protect coach credibility before shelf talk.'],
          ]}
        />
        <div className="os-h2">Question Bank by Segment</div>
        <div className="os-h3">First Responders</div>
        <OsTable
          headers={['Type', 'Question']}
          rows={[
            ['Connection', '"Captain, what is the crew actually reaching for on overnights these days?"'],
            ['Discovery', '"What is on the station table right now — coffee, cans, hydration packets, or whatever people buy themselves?"'],
            ['Discovery', '"When the back half gets rough, do people usually reach for another hit or just grind through?"'],
            ['Qualifying', '"Who would need to be comfortable before a small station-table trial could happen?"'],
            ['Clarifying', '"When you say the crew \'buys their own,\' does that mean there is no department budget involved?"'],
            ['Impact', '"When something new appears at the station, what makes the crew embrace it versus ignore it?"'],
            ['Impact', '"Who would lose credibility if this tasted bad or felt like a wellness pitch?"'],
          ]}
        />
        <div className="os-h3">Military / MWR / Veteran</div>
        <OsTable
          headers={['Type', 'Question']}
          rows={[
            ['Connection', '"What are your folks using now for the back half of a long duty day?"'],
            ['Discovery', '"Are people running one product, or stacking caffeine, hydration, and pouches?"'],
            ['Discovery', '"Do you usually check labels against OPSS before anything gets shared?"'],
            ['Qualifying', '"Is a private single-stick test allowed, or does the label need review first?"'],
            ['Clarifying', '"When you say \'not certified,\' is that a hard gate or a review concern?"'],
            ['Impact', '"What would make a new brand feel authentic rather than like tactical costume marketing?"'],
            ['Impact', '"If you were going to recommend it, what proof would protect your credibility?"'],
          ]}
        />
        <div className="os-h3">Healthcare / Shift Worker</div>
        <OsTable
          headers={['Type', 'Question']}
          rows={[
            ['Connection', '"For overnight staff, is the hard window closer to 3:00 a.m., 5:00 a.m., or shift change?"'],
            ['Discovery', '"What do people actually use now: coffee, cans, hydration products, or nothing official?"'],
            ['Discovery', '"What documentation would a product need before anyone would even review it?"'],
            ['Qualifying', '"Is this reviewed by a nurse manager, wellness lead, pharmacy, procurement, or someone else?"'],
            ['Clarifying', '"When you say \'evidence,\' do you mean ingredient literature, product trials, certification, or internal policy?"'],
            ['Impact', '"What makes a supplement conversation lose credibility immediately in your environment?"'],
          ]}
        />
        <div className="os-h3">Industrial / Blue-Collar</div>
        <OsTable
          headers={['Type', 'Question']}
          rows={[
            ['Connection', '"What do people grab when they hit the back half on a hot shift?"'],
            ['Discovery', '"Is the routine more Monster and coffee, or more Gatorade and water?"'],
            ['Discovery', '"Where would a box have to sit for people to actually use it?"'],
            ['Qualifying', '"Who controls what can be placed in the breakroom or near the water source?"'],
            ['Impact', '"What makes a product feel useful on the floor instead of like something corporate sent?"'],
            ['Impact', '"If people mocked it, what would they mock first — the flavor, the pitch, the price, or the format?"'],
          ]}
        />
        <div className="os-h3">Gyms / Combat Sports</div>
        <OsTable
          headers={['Type', 'Question']}
          rows={[
            ['Connection', '"Coach, what are your members using before class right now — Celsius, C4, Ghost, or what they brought from home?"'],
            ['Discovery', '"What would you personally use before a long session without adding a caveat?"'],
            ['Qualifying', '"Would a coach-only kit be the right first step, or is the answer no until you try it yourself?"'],
            ['Clarifying', '"When you say members won\'t mix powder, is that a convenience issue or a product-trust issue?"'],
            ['Impact', '"What makes a supplement brand feel like it belongs in your gym versus like it is using your gym as a billboard?"'],
          ]}
        />
        <div className="os-h2">Listen-for-This Decoder</div>
        <OsTable
          headers={['Buyer Phrase', 'Level 1 Meaning', 'Level 2 Feeling', 'Route']}
          rows={[
            ['"We already have coffee."', 'Current routine exists.', 'Defensive / protective.', 'Do not attack coffee; optional trial.'],
            ['"Send me info."', 'Wants artifact.', 'Low attention or polite brush-off.', 'Ask: short version, label, or both?'],
            ['"Is it certified?"', 'Needs status.', 'Risk avoidance.', 'Evidence-first; honest status.'],
            ['"The guys won\'t care."', 'User adoption concern.', 'Fear of mockery.', 'Ask what makes them care.'],
            ['"120mg is light."', 'Dose concern.', 'Efficacy skepticism.', 'Comparison trial; no duration promise.'],
            ['"We stock Celsius."', 'Incumbent exists.', 'Brand confidence or convenience bias.', 'Ask what Celsius does well and where it falls short.'],
            ['"We can\'t take samples."', 'Policy issue.', 'Compliance concern.', 'Evidence Pack.'],
          ]}
        />
        <div className="os-h2">Turning Discovery into Impact Questions</div>
        <OsTable
          headers={['Discovery Question', 'Impact Version', 'Why It Works']}
          rows={[
            ['"What do people use now?"', '"What does the current routine say about what your people actually trust?"', 'Moves from inventory to belief.'],
            ['"Do they drink energy drinks?"', '"When the current product wears off or feels like too much, what do they do next?"', 'Finds the breaking point.'],
            ['"Who approves samples?"', '"Who could look bad if a new product gets introduced poorly?"', 'Reveals social risk.'],
            ['"What does success look like?"', '"Two weeks from now, what would make you say this deserved a second conversation?"', 'Forces concrete next step.'],
            ['"Can I send a trial?"', '"What would make a trial socially safe enough that you would not feel like you were pushing it?"', 'Protects the champion.'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'tool-12',
    label: 'Tool 12 · Objections Matrix',
    kicker: 'Tool 12 · Objections Matrix',
    title: 'Skepticism &',
    titleAccent: 'Objections',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>Objections are data. Create space, clarify the concern, confirm what you heard, respond with accurate knowledge, and check whether the buyer is ready to move.</p>
        <div className="os-h2">The Five-Step Objection Reframe</div>
        <OsTable
          headers={['Step', 'Discipline', 'Psychological Mechanism', 'Example Line']}
          rows={[
            ['1 · Encourage', 'Discipline', 'Preserve buyer autonomy. Lower defensive barriers.', '"Tell me more." / "That is a fair concern."'],
            ['2 · Clarify', 'Skill', 'Identify the real threat (status, risk, effort).', '"Is that a certification gate, a taste concern, or a crew-adoption concern?"'],
            ['3 · Confirm', 'Discipline', 'Mirror Voice of Customer. Increase self-relevance.', '"So the issue is not the idea of a trial — it is whether you can introduce it without looking like you are pushing a product. Is that right?"'],
            ['4 · Respond', 'Knowledge', 'Inject proof at the point of resistance.', '"Then I would not start with a public trial. I would start with a coach-only or label-first review."'],
            ['5 · Check', 'Discipline', 'Restore control to the buyer.', '"Does that address the concern enough to choose the next step, or is there another blocker?"'],
          ]}
        />
        <div className="os-h2">The Honest Out Is Your BATNA</div>
        <Panel>
          <div style={{ fontSize: '13px', lineHeight: 1.6 }}>The <strong>Honest Out</strong> is the rep's <strong>BATNA — Best Alternative to a Negotiated Agreement</strong>. If the prospect's requested next step would destroy the signal, inflate social risk, or turn a trial into an untracked giveaway, the rep's best alternative is to walk away cleanly and protect inventory.</div>
          <div className="os-quote" style={{ marginTop: '8px' }}>"Totally fair. I don't want to force this into a bad trial. The clean version is [small coded test / label review / coach-only trial] with one owner, one use window, one code, one follow-up, and one yes/no question. If that does not work, the honest answer is that I should protect the inventory and close this out."</div>
        </Panel>
        <OsTable
          headers={['Threshold Crossed', 'Example', 'Honest Out Line']}
          rows={[
            ['No named owner', '"Just send it to the station."', '"I can\'t ship it responsibly without one person owning the test. Who should that be, or should I close this out?"'],
            ['No feedback loop', '"Send some over and we\'ll see."', '"I\'d rather not turn product into a black hole. If we can set one use window and one follow-up, I\'m in. If not, I\'ll step back."'],
            ['Oversized free-product ask', '"Can you send 50 free sticks?"', '"I can\'t justify 50 sticks without a feedback loop. I can do a smaller coded test with a named owner. If it moves, we scale."'],
            ['Champion social risk too high', '"Put it in front of everyone and see what happens."', '"That puts too much social risk on you. I\'d rather start private or not start at all."'],
            ['Policy / certification gate is hard', '"No samples unless approved."', '"Understood. I won\'t push product around process. Label-first review or clean exit are the only right routes."'],
            ['Price demand breaks economics', '"Free case now, maybe we buy later."', '"I can support a small test. I can\'t set a precedent that turns trial into free supply."'],
          ]}
        />
        <div className="os-h2">Skepticism Profile by ICP</div>
        <OsTable
          headers={['Segment', 'Psychological Barrier', 'Common Objection', 'What the Rep Must Know']}
          rows={[
            ['Military / MWR', 'Autonomy protection; anti-costume skepticism; OPSS literacy.', '"Never heard of you." "Is it OPSS-approved?" "Is it certified?"', 'OPSS is a review resource, not an approval. Exact doses and current certification status matter.'],
            ['First responders', 'Apathy, habit, crew norms, coffee loyalty, fear of being the wellness evangelist.', '"We already have coffee." "The crew won\'t care." "No budget."', 'The Station Bag is a crew-choice test, not a department purchase. Do not attack coffee or cans.'],
            ['Healthcare', 'Clinical skepticism; evidence hierarchy; claim sensitivity.', '"Is it clinically proven?" "Does it reduce errors?" "We can\'t take samples."', 'Ingredients may have literature; the product itself has not been clinically trialed unless verified. No patient-safety claims.'],
            ['Blue-collar / industrial', 'Anti-wellness culture, price sensitivity, heat/OSHA claim risk.', '"Too expensive." "Crew won\'t use it." "Is this an OSHA thing?"', 'Use pratfall pricing. Do not call it OSHA-compliant, heat-stress mitigation, or safety control.'],
            ['Gym / combat sports', 'Pitch fatigue, coach credibility, incumbent loyalty, dead-stock fear.', '"We already stock Celsius/C4." "Members won\'t mix powder." "120mg is not enough."', 'Coach tests first. No wholesale ask until personal trial. Frame trade-offs, not superiority.'],
          ]}
        />
        <div className="os-h2">Objection Playbook — 13 Scenarios</div>
        {[
          { num: '1', title: '"We already have coffee."', steps: [
            ['Encourage', '"That makes sense — coffee is the default everywhere."'],
            ['Clarify', '"Is coffee working well for the whole shift, or does it start to fall short at some point?"'],
            ['Confirm', '"So coffee handles the first half, but the back half is where the routine gets harder."'],
            ['Respond', '"That is exactly the window Restless is designed to test. Not to replace coffee — to see if one stick helps in the hours where coffee stops being enough."'],
            ['Check', '"Would a small station-table test in that window be worth trying, or is coffee the right answer for now?"'],
          ]},
          { num: '2', title: '"The crew won\'t care."', steps: [
            ['Encourage', '"That is a real concern — crew adoption is the whole game."'],
            ['Clarify', '"Is the concern that they won\'t try it, they won\'t like it, or that you don\'t want to be the one pushing it?"'],
            ['Confirm', '"So the issue is your credibility with the crew, not just the product."'],
            ['Respond', '"That is why I would not ask you to pitch it. I would ask for a small coded pack on the station table — crew choice, no pressure. If they use it, you get the signal. If they don\'t, you protected your credibility."'],
            ['Check', '"Would a crew-choice test feel different than a program push?"'],
          ]},
          { num: '3', title: '"Send me info."', steps: [
            ['Encourage', '"Happy to."'],
            ['Clarify', '"Do you want the short note, the label, or both — and what follow-up is okay?"'],
            ['Confirm', '"So you want [specific artifact] and a [specific follow-up]."'],
            ['Respond', '"I\'ll send that specific artifact, not a deck. What follow-up, if any, is okay?"'],
            ['Check', '"Is [date/channel] reasonable, or would you prefer I wait for you to reach back out?"'],
          ]},
          { num: '4', title: '"Is it OPSS-approved?"', steps: [
            ['Encourage', '"That is the right question for this lane."'],
            ['Clarify', '"Is OPSS review a hard gate for you, or are you asking whether the ingredients are checkable?"'],
            ['Confirm', '"You need to know whether this can be reviewed without me overstating approval."'],
            ['Respond', '"OPSS does not approve or certify products in the way people sometimes say. The safe language is OPSS-checkable: you can review every ingredient against that resource. I can send the label first."'],
            ['Check', '"Would label-first review be the right route, or is certification a hard stop?"'],
          ]},
          { num: '5', title: '"Is it clinically proven?"', steps: [
            ['Encourage', '"Fair. In healthcare especially, that question matters."'],
            ['Clarify', '"Are you asking whether the product itself has clinical trials, or whether the ingredients and ratio have supporting literature?"'],
            ['Confirm', '"You do not want a supplement pitch dressed up as clinical proof."'],
            ['Respond', '"The ingredients and the L-theanine:caffeine ratio have literature we can summarize. The Restless product itself should not be described as clinically proven unless a product-specific trial exists and has been verified."'],
            ['Check', '"Is that evidence-first route worth reviewing, or should I stop here?"'],
          ]},
          { num: '6', title: '"Does it reduce errors / improve patient safety?"', steps: [
            ['Encourage', '"I understand why that is the concern."'],
            ['Clarify', '"Are you evaluating whether the formula is appropriate for staff review, or asking for a patient-outcome claim?"'],
            ['Confirm', '"You need us to stay inside what we can actually support."'],
            ['Respond', '"I will not claim it prevents errors or improves patient outcomes. What I can send is Supplement Facts, dose rationale, and ingredient-literature context so your team can evaluate whether any trial is appropriate."'],
            ['Check', '"Does that level of restraint make a review more appropriate, or is this outside your lane?"'],
          ]},
          { num: '7', title: '"Too expensive."', steps: [
            ['Encourage', '"Straight with you — it is not the cheapest way to get caffeine."'],
            ['Clarify', '"Are you comparing it to one can, or to the whole routine: caffeine plus hydration plus whatever else people add?"'],
            ['Confirm', '"So price matters, but the fair comparison is what people are already buying to solve the same job."'],
            ['Respond', '"Restless is about two dollars a serving and is designed to combine energy and hydration in one bottle. If a cheaper routine is already working, I would not force a switch. The trial simply tests whether the combined option earns its cost."'],
            ['Check', '"Is a small trial worth testing the value, or is price a hard no?"'],
          ]},
          { num: '8', title: '"120mg is not enough."', steps: [
            ['Encourage', '"That is a common reaction from people used to 200–300mg cans."'],
            ['Clarify', '"Do you want maximum hit, or a lower-dose option you can compare in a longer work or training window?"'],
            ['Confirm', '"So your concern is noticeable effect, not just the number."'],
            ['Respond', '"Restless is not trying to be a max-stim pre-workout. It is a moderate-caffeine, L-theanine-paired, energy-plus-hydration option. The right answer is not a debate — it is a side-by-side test in the window you care about."'],
            ['Check', '"Would one comparison trial answer that better than my pitch?"'],
          ]},
          { num: '9', title: '"We already use Celsius / Monster / C4."', steps: [
            ['Encourage', '"Those products work for a lot of people. I\'m not here to trash what already works."'],
            ['Clarify', '"What does that product do well for you, and where does it fall short if at all?"'],
            ['Confirm', '"So the incumbent wins on [buyer words], and the only possible gap is [buyer words]."'],
            ['Respond', '"Then I would not position Restless as a replacement. I would position it as a lower-dose, exact-label, energy-plus-hydration comparison in the window where the current option is weakest."'],
            ['Check', '"Is that comparison worth a tiny test, or is the incumbent still the right fit?"'],
          ]},
          { num: '10', title: '"Members won\'t mix powder."', steps: [
            ['Encourage', '"That is real. Cans are easier."'],
            ['Clarify', '"Do your members already mix pre-workout or electrolytes, or is the fridge the only real behavior?"'],
            ['Confirm', '"So the issue is not whether powder can work; it is whether this product is worth the extra 15 seconds."'],
            ['Respond', '"That is why I would not start with a shelf pitch. I would start with a coach-only trial. If you would not mix it before training, your members won\'t either."'],
            ['Check', '"Would coach-only be the right test, or is powder a hard stop for your gym?"'],
          ]},
          { num: '11', title: '"We can\'t take samples."', steps: [
            ['Encourage', '"Understood. I\'m not trying to bypass process."'],
            ['Clarify', '"Is there an approved route: label review, vendor file, safety documents, wellness committee, or no product review at all?"'],
            ['Confirm', '"So the first step is process review, not product in hand."'],
            ['Respond', '"I\'ll route to an Evidence Pack only: Supplement Facts, dose rationale, claim guardrails, and current certification status. No product leaves unless the process clears it."'],
            ['Check', '"Who should receive that, or should I close this account out?"'],
          ]},
          { num: '12', title: '"Never heard of you."', steps: [
            ['Encourage', '"Fair. We are early, and you should be skeptical of unknown brands."'],
            ['Clarify', '"When you evaluate a new brand, what matters first — who built it, what is on the label, who else uses it, or whether it works for you personally?"'],
            ['Confirm', '"So trust has to be earned through [buyer answer], not assumed."'],
            ['Respond', '"Then let\'s start there. I can send the label first, or a tiny coded trial for one use window. You judge it without a big ask."'],
            ['Check', '"Which route, if any, earns a fair look?"'],
          ]},
          { num: '13', title: '"Can you just send 50 free sticks?"', steps: [
            ['Encourage', '"I get why you would ask. If the crew is going to judge it, you want enough product to make the test real."'],
            ['Clarify', '"Who would own the feedback, when would they use it, and what would tell us whether it worked?"'],
            ['Confirm', '"So right now this would be broad distribution without a named owner, use window, code discipline, or follow-up signal."'],
            ['Respond', '"My BATNA here is the Honest Out. I would rather protect inventory than send 50 sticks into a room where no one owes us a signal. I can do a smaller coded test with a named owner and one follow-up. If it moves, we scale."'],
            ['Check', '"Does the smaller clean trial work, or should I close this out cleanly?"'],
          ]},
        ].map(obj => (
          <div key={obj.num} style={{ marginBottom: '12px', background: '#fff', border: '1px solid #C8CCD2', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ background: '#1A1D22', padding: '8px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820' }}>OBJ {obj.num}</span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#fff' }}>{obj.title}</span>
            </div>
            <div style={{ padding: '8px 12px' }}>
              {obj.steps.map(([step, line]) => (
                <div key={step} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: '1px solid #EFEBE0', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820', minWidth: '70px', paddingTop: '2px' }}>{step}</span>
                  <span style={{ fontSize: '13px', color: '#1A1D22', lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="os-h2">Neutral Competitor Trap Questions</div>
        <OsTable
          headers={['Competitor / Routine', 'Trap Question', 'Route']}
          rows={[
            ['Coffee', '"When coffee stops cutting it, what do people add?"', 'If they add cans or hydration: one-stick test. If coffee works: clean exit or optional table-top review.'],
            ['Monster / Reign / high-stim', '"What do people like about the hit, and what do they dislike about the back side of it?"', 'Wrong-tool-for-window comparison.'],
            ['Celsius', '"When you use Celsius for energy, what are you doing for hydration later?"', 'Stack consolidation.'],
            ['C4 / Bang / pre-workout', '"Is that for max output, or for staying useful over a longer work window?"', 'Position Restless as not max-stim.'],
            ['Liquid I.V.', '"If hydration is covered, where does the energy come from?"', 'Energy + hydration in one bottle.'],
            ['Jocko', '"Is the can format or per-shift cost ever a friction point?"', 'Powder economics and portability, without challenging brand trust.'],
            ['Zyn', '"Is that an alertness habit, a stress habit, or just part of the routine?"', 'Do not moralize. Position Restless as non-nicotine energy-plus-hydration.'],
          ]}
        />
        <div className="os-h2">Product Knowledge Cheat Sheet</div>
        <OsTable
          headers={['Area', 'Rep Must Be Able to Say', 'Rep Must NOT Say']}
          rows={[
            ['Formula', '"One stick: 120mg caffeine, 240mg L-theanine, electrolytes. Confirm current Supplement Facts before quoting mineral breakdown."', '"Guaranteed crash-free." "Clinically proven Restless."'],
            ['Caffeine posture', '"Lower-dose than many 200–300mg cans, paired with L-theanine to smooth the caffeine curve."', '"It lasts six hours." "It keeps you safe."'],
            ['L-theanine', '"Theanine is used to modulate the caffeine experience; the 2:1 ratio has supporting ingredient literature."', '"It eliminates anxiety." "It guarantees steady hands."'],
            ['Electrolytes', '"It adds hydration support in the same bottle as caffeine."', '"It treats dehydration." "It is a heat-stress control."'],
            ['Certification', '"Let me confirm current certification status before I answer. If certification is a hard gate, we should not push a trial."', '"NSF approved." "OPSS approved." "Drug-test safe."'],
            ['Trial mechanics', '"Every trial has a named owner, code, use window, follow-up date, binary question, and route."', '"I\'ll just send a box." "I can send 50 free sticks without a feedback loop."'],
          ]}
        />
        <div className="os-warn"><strong>Hard Claim Guardrails — Never Say:</strong> clinically proven Restless · prevents medical errors · improves patient safety · treats fatigue, dehydration, PTSD, anxiety, or burnout · eliminates crash or jitters · OPSS-approved · NSF-certified · drug-test safe · OSHA-compliant · purpose-built for a specific medical, safety, or operational outcome · dangerous or unsafe when describing competitors.</div>
      </>
    ),
  },
  {
    id: 'tool-13',
    label: 'Tool 13 · Presentation',
    kicker: 'Tool 13 · Presentation',
    title: 'Visual',
    titleAccent: 'Impact',
    content: <Tool13Content />,
  },
  {
    id: 'tool-14',
    label: 'Tool 14 · Progress Report',
    kicker: 'Tool 14 · Progress Report',
    title: 'Progress',
    titleAccent: 'Report',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>The weekly progress report is the rep's accountability document, coaching artifact, and market intelligence feed. It is not a call log. It shows progress, not activity.</p>
        <div className="os-h2">Quality Gate — Ask Before Sending</div>
        <OsTable
          headers={['#', 'Question', 'Pass Condition']}
          rows={[
            ['1', 'Can my manager read this in under three minutes?', 'No walls of text. Six numbers, then the story.'],
            ['2', 'Does it show progress, not activity?', 'Qualified conversations, activations, outcomes — not "made calls."'],
            ['3', 'Does it include one exact buyer phrase?', 'Verbatim quote, not paraphrase.'],
            ['4', 'Does it identify one decision or ask?', 'One thing the manager needs to decide or unblock.'],
            ['5', 'Does it protect the company from unsupported claims?', 'No overclaim, no unverified certification language.'],
            ['6', 'Does it make next week sharper?', 'One learning that changes next week\'s behavior.'],
          ]}
        />
        <div className="os-h2">Friday Scoreboard — Six Numbers Only</div>
        <OsTable
          headers={['#', 'Metric', 'What to Count']}
          rows={[
            ['1', 'Real outreach attempts', 'Calls, DMs, emails, walk-ins where a rep made a real attempt.'],
            ['2', 'Live / replied conversations', 'Actual two-way exchanges. Not voicemails.'],
            ['3', 'Four-Gear qualified conversations', 'Named pain + access + trial fit + feedback loop all present.'],
            ['4', 'Complete activations shipped/reviewed', 'All 8 fields of Activation Standard complete.'],
            ['5', 'Follow-ups completed / due', 'Format: completed / total due. Example: 5 / 5.'],
            ['6', 'Yes/no outcomes + clean exits', 'Honest outcomes. Clean exits count as productive learning.'],
          ]}
        />
        <Panel dark>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', color: '#A82820', marginBottom: '8px' }}>V12/V13 · FRIDAY SCOREBOARD</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {['Outreach', 'Live / Replied', 'Four-Gear', 'Activations', 'Follow-Ups', 'Yes / No + Exits'].map((label, i) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '18px', color: '#A82820' }}>{i + 1}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', marginTop: '2px' }}>{label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px' }}>______</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>→ Use lane-adjusted targets; do not hard-code one funnel math.</div>
        </Panel>
        <div className="os-h2">1:1 Agenda Builder</div>
        <OsTable
          headers={['Field', 'What to Write', 'Limit']}
          rows={[
            ['Best buyer phrase', 'Exact verbatim quote. Not a paraphrase.', '1 line'],
            ['Best movement', 'What changed and what the next step is.', '2 lines'],
            ['Clean no / Honest Out', 'What was protected and why.', '2 lines'],
            ['One learning', 'What changes next week\'s behavior.', '1 line'],
            ['Knowledge / Skill / Discipline', 'One sentence each. Not a full self-review.', '3 lines'],
            ['Manager ask', 'One decision or blocker only.', '1 line'],
          ]}
        />
        <div className="os-h2">Required vs. Optional</div>
        <OsTable
          headers={['Category', 'Required Weekly?', 'Where It Lives']}
          rows={[
            ['Six-number scoreboard', 'Yes', 'Progress Report'],
            ['Best buyer phrase', 'Yes', 'Progress Report + playbook if useful'],
            ['Best movement', 'Yes', 'Progress Report'],
            ['Clean no / Honest Out', 'Yes', 'Progress Report + BATNA review if needed'],
            ['One learning', 'Yes', 'Progress Report'],
            ['Knowledge / Skill / Discipline', 'Yes, one sentence each', 'Progress Report'],
            ['Manager ask', 'Yes', 'Progress Report'],
            ['Full call notes', 'No', 'CRM'],
            ['Full objection library updates', 'No', 'Monthly playbook review'],
            ['Evidence and claim questions', 'No, unless urgent', 'Fact bank / compliance log'],
            ['Network additions', 'No, unless actionable', 'CRM / monthly network report'],
            ['Story cards', 'No, one best story only', 'Story Vault'],
          ]}
        />
        <div className="os-h2">Sample Completed Report</div>
        <Panel dark>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.85)' }}>{`# Restless Weekly Progress Report — Alex R. — Week of May 12

## 1. Scoreboard
- Real outreach attempts: 42
- Live/replied conversations: 12
- Four-Gear qualified: 6
- Complete activations shipped/reviewed: 3
- Follow-ups completed / due: 5 / 5
- Yes/no outcomes + clean exits: 2 yes/no, 2 clean exits

## 2. Best buyer phrase
"The guys grab whatever's cold at 2 a.m." — station captain.

## 3. Best movement
Station 14 used the coded pack and asked for reorder pricing.
Next step: small reorder or second-shift test.

## 4. Cleanest no / Honest Out
BJJ gym wanted a full bag before coach tried it. I offered
5 coach-only sticks; they declined. Protected inventory.

## 5. One learning
Station-table placement outperformed captain speech.
Next week: ask for passive table placement first.

## 6. Knowledge / Skill / Discipline
K: OPSS is a review resource, not approval.
S: Clarified "120mg is light" with comparison trial offer.
D: No product left without canonical pre-ship approval.

## 7. Manager ask
Need current certification-status language by Tuesday
for two MWR conversations.`}</div>
        </Panel>
        <div className="os-h2">Rep Development Rubric</div>
        <OsTable
          headers={['Level', 'Knowledge', 'Skill', 'Discipline']}
          rows={[
            ['1 · New', 'Can recite product facts and banned claims.', 'Can use one opener and one trial ask.', 'Logs calls when reminded.'],
            ['2 · Field-ready', 'Can adapt language by segment and answer basic objections.', 'Mirrors buyer language and asks risk pre-probe.', 'No product ships without canonical pre-ship approval.'],
            ['3 · Trusted', 'Can explain competitors as trade-offs and use visuals.', 'Handles objections with five-step process.', 'Runs follow-up cadence without manager rescue.'],
            ['4 · Peer-level', 'Sounds like a useful insider without pretending to be the buyer.', 'Creates new story cards, question cards, and objection responses.', 'Turns market learning into playbook improvements weekly.'],
          ]}
        />
        <div className="os-h2">Credibility Baselines — 8 Modules</div>
        {[
          { num: '1', title: 'Product & Label Fluency', must: ['Restless is a powder stick mixed in water; energy plus hydration.', 'Formula basics: 120mg caffeine, 240mg L-theanine, electrolytes, Rhodiola rosea, B-vitamins if current label confirms.', 'Label is source of truth; if label and deck differ, label wins.', 'No proprietary blend / hidden-dose posture if verified on current label.', 'Certification status must be confirmed before use.'], test: 'Explain Restless in 15 seconds without using "wellness," "biohack," "clinically proven," "guaranteed no crash," or "certified."' },
          { num: '2', title: 'Energy Drink Landscape', must: ['Legacy RTD: Monster, Reign, Red Bull, Rip It — familiar, available, cheap, habit-forming.', 'Fitness RTD: Celsius, C4, Ghost — strong brand awareness, often higher caffeine, not hydration-first.', 'Hydration powders: Liquid I.V., LMNT — strong hydration, often no meaningful energy stack.', 'Tactical / military: Jocko, Strike Force, MTN OPS, Bulkhead — credibility, format, pricing, trust trade-offs.', 'Behavioral competitors: coffee and Zyn — socially embedded, cheap, familiar.'], test: 'Ask one neutral trade-off question for each competitor without insulting it.' },
          { num: '3', title: 'Supplement Regulations & Claim Hygiene', must: ['Dietary supplements are not drugs. Avoid disease, treatment, prevention, mitigation, diagnosis claims.', 'OPSS is a review resource, not product approval.', 'NSF / Informed Sport certification language must be current and verified before use.', 'Ingredient literature is not the same as product-specific clinical proof.', 'OSHA language must be avoided: Restless is not an OSHA solution.'], test: 'Handle "Does this prevent errors?" and "Is it OPSS-approved?" with zero overclaim.' },
          { num: '4', title: 'Human Performance Basics', must: ['Long shifts create fatigue windows, but reps must not make medical or safety claims.', 'Caffeine dose, timing, and individual tolerance vary.', 'L-theanine is positioned as a caffeine-smoothing ingredient, not a treatment.', 'Hydration and electrolytes support work routines, but Restless does not treat dehydration.', 'Rhodiola is an adaptogen; explain as ingredient-category context, not as a medical promise.'], test: 'Explain caffeine/L-theanine to a firefighter, a nurse, and a coach using different levels of vocabulary.' },
          { num: '5', title: 'Segment Culture', must: ['First responders: Do not attack coffee or lecture the crew.', 'Military / MWR: Preserve autonomy. Avoid tactical costume language.', 'Healthcare: Evidence before sample. Anti-claim restraint builds trust.', 'Blue-collar: Avoid wellness language. Put the product near the water source and admit price.', 'Gym / combat sports: Coach credibility first. No shelf pitch until coach personally tests.'], test: 'Open a call in each segment without leading with formula.' },
          { num: '6', title: 'Trial Mechanics', must: ['Four-Gear Qualification is for live conversation.', 'The canonical Activation Standard is for pre-ship approval.', 'No code, no owner, no use window, no follow-up = no ship.', 'A clean no is useful data.', 'Verified use matters more than samples shipped.'], test: 'Inspect a proposed shipment and decide ship / no-ship in 60 seconds.' },
          { num: '7', title: 'Storytelling', must: ['Curate, categorize, construct, convey.', 'Success, failure, fun, legend.', 'Character, context, conflict, climax, closure.', 'Story must create the next step, not entertain the rep.'], test: 'Tell "Dead Sample" in 15 seconds and "Label Before Sample" in 45 seconds.' },
          { num: '8', title: 'Visual Impact', must: ['Draw Spike vs Smoother Curve, One Stick vs Stack, Three Gates, Activation Loop.', 'Use healthcare visuals differently from station-table visuals.', 'Slides are for high-stakes meetings, not cold calls.'], test: 'Draw the buyer\'s current routine and ask for the next step without a slide deck.' },
        ].map(mod => (
          <div key={mod.num} style={{ marginBottom: '10px', background: '#fff', border: '1px solid #C8CCD2', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ background: '#F4F1EA', padding: '6px 12px', borderBottom: '1px solid #C8CCD2', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820' }}>MOD {mod.num}</span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#1A1D22' }}>{mod.title}</span>
            </div>
            <div style={{ padding: '8px 12px' }}>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#4A5159', lineHeight: 1.6 }}>
                {mod.must.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <div style={{ marginTop: '6px', padding: '6px 8px', background: '#FBF8F1', border: '1px solid #EFEBE0', borderRadius: '2px', fontSize: '12px', color: '#1A1D22' }}>
                <strong>Skill test:</strong> {mod.test}
              </div>
            </div>
          </div>
        ))}
      </>
    ),
  },
  {
    id: 'tool-15',
    label: 'Tool 15 · Weekly Cadence',
    kicker: 'Tool 15 · Weekly Cadence',
    title: 'Field',
    titleAccent: 'Rhythm',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>Turn the week into a concrete plan that prioritizes selling activities, rep development, follow-up, and measurable progress. Restless is a young company. The week must produce named conversations, qualified activations, verified use, clean exits, and market learning.</p>
        <div className="os-h2">Order of Priority</div>
        <OsTable
          headers={['Priority', 'Category', 'Restless Activities', 'Target Share']}
          rows={[
            ['1', 'Contact & Forward Progress', 'Prospecting calls, walk-ins, station visits, coach DMs, live meetings, follow-up calls, referral asks.', '40%'],
            ['2', 'Development', 'Roleplay, objection practice, story practice, product/label study, segment research, call review.', '20%'],
            ['3', 'Communication', 'Follow-up emails/texts, evidence packs, label sends, proposals, thank-yous, story capture.', '18%'],
            ['4', 'Internal', 'Manager check-ins, ops handoff, founder escalations, fulfillment coordination, collateral updates.', '12%'],
            ['5', 'Tracking', 'CRM, codes, pipeline review, activation fields, outcomes, revenue projection.', '7%'],
            ['6', 'Administrative', 'Scheduling, organizing, reporting, file cleanup, non-selling meetings.', '3%'],
          ]}
        />
        <Panel dark>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', color: '#A82820', marginBottom: '8px' }}>V15 · WEEKLY TIME RING</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <svg viewBox="0 0 200 200" style={{ width: '120px', height: '120px', flexShrink: 0 }}>
              <circle cx="100" cy="100" r="68" fill="none" stroke="#1e1c18" strokeWidth="30" strokeDasharray="170 257" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="68" fill="none" stroke="#A82820" strokeWidth="30" strokeDasharray="85 342" strokeDashoffset="-170" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="68" fill="none" stroke="#76736b" strokeWidth="30" strokeDasharray="77 350" strokeDashoffset="-255" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="68" fill="none" stroke="#2a2721" strokeWidth="30" strokeDasharray="51 376" strokeDashoffset="-332" transform="rotate(-90 100 100)" opacity=".9"/>
              <circle cx="100" cy="100" r="68" fill="none" stroke="#aaa79b" strokeWidth="30" strokeDasharray="30 397" strokeDashoffset="-383" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="68" fill="none" stroke="#d0cdc4" strokeWidth="30" strokeDasharray="13 414" strokeDashoffset="-413" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="38" fill="#1A1D22"/>
              <text x="100" y="96" textAnchor="middle" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', fill: '#fff' }}>CONTACT</text>
              <text x="100" y="110" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '11px', fill: '#A82820' }}>40%</text>
            </svg>
            <div style={{ flex: 1, minWidth: '120px' }}>
              {[['40%', 'Contact & forward progress', '#A82820'], ['20%', 'Development', '#4A5159'], ['18%', 'Communication', '#76736b'], ['12%', 'Internal', '#2a2721'], ['7%', 'Tracking', '#aaa79b'], ['3%', 'Administrative', '#d0cdc4']].map(([pct, label, color]) => (
                <div key={label} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color as string, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: color as string, minWidth: '28px' }}>{pct}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>Rep honesty test: if the contact segment is not the largest part of the week, the calendar is not serving the sales motion.</div>
        </Panel>
        <div className="os-h2">Lane Selector — Score Before You Choose</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '8px' }}>Score the lane before choosing it. Pick the highest-scoring lane for the week. Do not split focus unless manager approves.</p>
        <OsTable
          headers={['Lane Question', 'Score 0–2']}
          rows={[
            ['Do we have 25 named targets in this segment?', ''],
            ['Do we have the right proof pack ready?', ''],
            ['Are codes and fulfillment ready to ship?', ''],
            ['Is there a timely trigger: event, heat season, overnight staffing change, class schedule?', ''],
            ['Can we get in-person or warm-intro access this week?', ''],
            ['Can the rep run this lane independently, or is founder help required?', ''],
            ['Total', '/12'],
          ]}
        />
        <Panel>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.8 }}>
            <span style={{ color: '#2E7D32', fontWeight: 700 }}>GREEN CENTER · Score 8–12</span> → choose as the week's primary lane<br />
            <span style={{ color: '#B45309', fontWeight: 700 }}>AMBER RING · Score 6–7</span> → build proof pack, warm intros, or evidence route<br />
            <span style={{ color: '#A82820', fontWeight: 700 }}>RED OUTER · Score 0–5</span> → development week; do not force outreach
          </div>
        </Panel>
        <div className="os-h2">Sunday Planning — 15 Minutes</div>
        <OsTable
          headers={['#', 'Question']}
          rows={[
            ['1', 'What segment is the primary lane this week?'],
            ['2', 'What is the weekly activation target?'],
            ['3', 'Which 25 named targets are loaded?'],
            ['4', 'Which call blocks are protected?'],
            ['5', 'Which field visits or in-person moments are scheduled?'],
            ['6', 'What knowledge, skill, and discipline will I develop?'],
            ['7', 'What objections will I practice?'],
            ['8', 'What will I say no to?'],
            ['9', 'Which samples might leave, and are codes ready?'],
            ['10', 'What must be true by Friday for this to be a good week?'],
          ]}
        />
        <div className="os-h2">Weekly Operating Rhythm</div>
        <OsTable
          headers={['Day', 'Field Priority', 'Development Priority', 'Output']}
          rows={[
            ['Monday', 'Build and clean 25 named targets. Run first call block.', 'Rehearse segment opener and trial ask 5x out loud.', '25 targets, 20 touches, 3 exact phrases.'],
            ['Tuesday', 'Heavy outreach: calls, DMs, emails, callbacks.', 'Practice one objection set.', '30 touches, 5 live/replied, 1–2 qualified.'],
            ['Wednesday', 'In-person or high-quality warm outreach.', 'Draw one hip-pocket visual from memory.', '25 touches, 1 in-person or warm intro, 1 clean no-ship save.'],
            ['Thursday', 'Follow-up day: labels, evidence packs, trial confirmations.', 'Convert one interaction into a story card.', '100% follow-ups current, approved shipments complete.'],
            ['Friday', 'Close loops: yes/no outcomes, reorders, referrals, clean exits.', 'Complete progress report and call review.', 'Weekly report, next week\'s top 10, scorecard.'],
          ]}
        />
        <div className="os-h2">Sample Selling-Day Block Schedule</div>
        <Panel dark>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.85)' }}>{`09:00-11:00  Contact block: calls / walk-ins / DMs
11:00-11:20  Tracking: log buyer phrases, routes, follow-ups
11:20-12:00  Communication: send labels, short notes, calendar holds
13:00-14:00  Development: objection drill or story practice
14:00-16:00  Contact block: callbacks / warm intros / field visits
16:00-16:30  Tracking + ops handoff`}</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>Use as a spatial check, not a universal schedule: the contact blocks must be visually bigger than admin.</div>
        </Panel>
        <div className="os-h2">Daily Call Block Rule</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '8px' }}>Choose one lane per block. Do not mix healthcare, gyms, stations, and industrial in the same block. Language, objections, and next steps are different.</p>
        <OsTable
          headers={['Block Type', 'Segment', 'Minimum Prep', 'Default Ask']}
          rows={[
            ['Station block', 'Fire / EMS / police', 'Captain/shift lead, station address, likely coffee/can routine.', 'Station Bag or callback.'],
            ['Military / MWR block', 'MWR, veteran org, unit-adjacent', 'Role, review bar, OPSS/certification sensitivity.', 'Label-first or single-stick private test.'],
            ['Healthcare block', 'Nurse manager, wellness, HR', 'Evidence Pack ready, no sample assumption.', 'Label + evidence summary.'],
            ['Industrial block', 'EHS, foreman, ops', 'Heat/window context, water source, placement.', 'Break Room Box only if process allows.'],
            ['Gym / combat block', 'Owner, head coach', 'Class schedule, current products, coach credibility angle.', 'Coach-only trial.'],
          ]}
        />
        <div className="os-h2">First 14-Day Sprint — Lane Targets</div>
        <OsTable
          headers={['Lane', 'Named Targets', 'Outreach Attempts', 'Live/Replied', 'Four-Gear', 'Activations', 'Expected Yes/No by Day 14']}
          rows={[
            ['Cold station / gym / industrial', '50', '80–120', '8–18', '4–10', '2–5', '1–3'],
            ['Warm intro / event / founder-adjacent', '30–40', '40–60', '12–25', '6–15', '4–8', '2–5'],
            ['Healthcare / MWR evidence-first', '25–35', '30–50', '6–12', '3–6', '0–3 product; 3–5 evidence reviews', '0–2, often scheduled later'],
          ]}
        />
        <div className="os-h2">Buddy Check — Friday Shutdown</div>
        <OsTable
          headers={['#', 'Question']}
          rows={[
            ['1', 'Did we protect selling time first?'],
            ['2', 'Did any product leave without code, owner, use window, and follow-up?'],
            ['3', 'What did we learn this week that changes next week?'],
            ['4', 'Which buyer phrase should be added to the playbook?'],
            ['5', 'Which objection needs a better response?'],
            ['6', 'Which story did we earn?'],
            ['7', 'Which opportunity needs founder help?'],
            ['8', 'Which opportunity should be closed out?'],
            ['9', 'What are next week\'s first three calls?'],
            ['10', 'What are we saying no to next week?'],
          ]}
        />
        <div className="os-h2">What to Say No To</div>
        <Panel>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#4A5159', lineHeight: 1.8 }}>
            <li>Full-bag or large-stick giveaways without named owner, code, use window, and feedback loop.</li>
            <li>"Send me info" without artifact choice and follow-up permission.</li>
            <li>Healthcare samples before label/evidence review.</li>
            <li>Wholesale pitch before coach trial in gyms.</li>
            <li>Any claim the rep cannot source to the current label, founder-verified fact bank, or approved evidence summary.</li>
            <li>Founder escalations that rescue incomplete discovery.</li>
            <li>CRM catch-up at the expense of live selling time.</li>
            <li>Mixing segments inside a single call block.</li>
            <li>Debating competitors instead of asking neutral trade-off questions.</li>
          </ul>
        </Panel>
      </>
    ),
  },
  {
    id: 'bonus',
    label: 'Bonus · Clean Activation',
    kicker: 'Bonus · Threshold',
    title: 'Clean',
    titleAccent: 'Activation',
    content: (
      <Grid3>
        <Panel><div className="os-h3" style={{ marginTop: 0 }}>Named Owner</div><div style={{ fontSize: '13px', color: '#4A5159' }}>Can you text them?</div></Panel>
        <Panel><div className="os-h3" style={{ marginTop: 0 }}>Feedback Loop</div><div style={{ fontSize: '13px', color: '#4A5159' }}>Stranger knows what to check?</div></Panel>
        <Panel><div className="os-h3" style={{ marginTop: 0 }}>Trial Discipline</div><div style={{ fontSize: '13px', color: '#4A5159' }}>Champion survives fail?</div></Panel>
      </Grid3>
    ),
  },
  {
    id: 'apx',
    label: 'Appendix · Rep Rules',
    kicker: 'Appendix · Rep Rules',
    title: 'The Ten',
    titleAccent: 'Rep Rules',
    content: (
      <Grid2>
        <Panel>
          <div style={{ fontSize: '13px', lineHeight: 1.7 }}>
            <strong>01 · Code before product.</strong> No code — no ship.<br />
            <strong>02 · Trials, not gifts.</strong> 3–10 sticks, yes/no at end.<br />
            <strong>03 · Named recipient only.</strong> No "the station".<br />
            <strong>04 · Coach-only first.</strong> No member-facing until yes.<br />
            <strong>05 · Honest yes/no.</strong> "Chuck it" is clean.
          </div>
        </Panel>
        <Panel>
          <div style={{ fontSize: '13px', lineHeight: 1.7 }}>
            <strong>06 · No hero claims.</strong> Never "proven" or unverified.<br />
            <strong>07 · Cite the label.</strong> Supplement Facts = truth.<br />
            <strong>08 · "I don't know" wins.</strong> + deadline.<br />
            <strong>09 · Founder story = backdrop.</strong><br />
            <strong>10 · Walk away clean.</strong> Pressure kills next convo.
          </div>
        </Panel>
      </Grid2>
    ),
  },
];

function BullseyeRings() {
  return (
    <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
      {/* R4 */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid #4A5159' }} />
      {/* R3 */}
      <div style={{ position: 'absolute', inset: '18px', borderRadius: '50%', border: '1px solid #4A5159' }} />
      {/* R2 */}
      <div style={{ position: 'absolute', inset: '36px', borderRadius: '50%', border: '1px solid #A82820', background: '#F6DAD6' }} />
      {/* R1 */}
      <div style={{
        position: 'absolute', inset: '54px', borderRadius: '50%',
        background: '#A82820', color: '#fff',
        display: 'grid', placeItems: 'center', textAlign: 'center',
        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', lineHeight: 1.1,
      }}>
        R1<br />FIRE+MRF
      </div>
      {/* Cross */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed #4A5159' }} />
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dashed #4A5159' }} />
      {/* Labels */}
      <div style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#4A5159', whiteSpace: 'nowrap' }}>R4 · Health/Shops</div>
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#4A5159', whiteSpace: 'nowrap' }}>R3 · CF/BJJ/MMA</div>
      <div style={{ position: 'absolute', top: '38px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#A82820', fontWeight: 700, whiteSpace: 'nowrap' }}>R2 · 555+MWR</div>
    </div>
  );
}

export default function FieldManual() {
  const [activeSectionId, setActiveSectionId] = useState('start-here');
  const activeSection = SECTIONS.find(s => s.id === activeSectionId) ?? SECTIONS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sticky header with dropdown */}
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
          {SECTIONS.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Section content */}
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
        {activeSection.content}
      </div>
    </div>
  );
}

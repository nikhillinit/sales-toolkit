// ─── Tool 13 — Harbor Tide Table / Navigable-Window Chart ───────────────────
export default function Tool13Presentation() {
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

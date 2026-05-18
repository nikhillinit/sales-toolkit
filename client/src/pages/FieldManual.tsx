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
    id: 'tool-10',
    label: 'Tool 10 · Story Vault',
    kicker: 'Tool 10 · Story Vault',
    title: 'Story',
    titleAccent: 'Vault',
    content: (
      <Grid2>
        <Panel><Badge>Failure A</Badge> <strong>The Dead Sample</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>"Sending product is not progress. Without a named owner, use window, code, and follow-up, it's inventory leaving."</span></Panel>
        <Panel><Badge variant="green">Success B</Badge> <strong>Station Table</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>"I'm not asking you to start a program. I'm asking for a small station-table test and one honest yes/no."</span></Panel>
      </Grid2>
    ),
  },
  {
    id: 'tool-11',
    label: 'Tool 11 · Discovery',
    kicker: 'Tool 11 · Discovery',
    title: 'Ask',
    titleAccent: '& Listen',
    content: (
      <OsTable
        headers={['Frame', 'Example']}
        rows={[
          [<strong>Ask Why</strong>, '"Why does coffee stop working at hour 3?"'],
          [<strong>Time Travel</strong>, '"Two years from now, what do you wish you\'d tried?"'],
          [<strong>Change Context</strong>, '"If a captain handed your crew this, what would they ask?"'],
        ]}
      />
    ),
  },
  {
    id: 'tool-12',
    label: 'Tool 12 · Defense',
    kicker: 'Tool 12 · Defense',
    title: 'Master',
    titleAccent: 'Objections',
    content: (
      <>
        <div className="os-h2">5-Step Reframe</div>
        <Panel>
          <div style={{ fontWeight: 700, fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", color: '#A82820' }}>
            Encourage → Clarify → Confirm → Respond → Check
          </div>
        </Panel>
        <OsTable
          headers={['Buyer Says', 'Decode', 'Safe Route (Ask)']}
          rows={[
            ['"We have coffee."', 'Habit defense', '"When does coffee stop working?"'],
            ['"Send me info."', 'Stall', '"What info changes trial to yes?"'],
            ['"Is it OPSS-approved?"', 'Military check', '"I won\'t claim certs I can\'t verify. Here\'s the label."'],
          ]}
        />
        <div className="os-warn"><strong>Honest Out:</strong> "I want to be straight — this doesn't meet our trial standard right now. Can I check back when [condition]?"</div>
      </>
    ),
  },
  {
    id: 'tool-13',
    label: 'Tool 13 · Presentation',
    kicker: 'Tool 13 · Presentation',
    title: 'Visual',
    titleAccent: 'Impact',
    content: (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>Draw before you tell. Draw this on a napkin.</p>
        <Grid2>
          <Panel>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <svg viewBox="0 0 140 56" style={{ width: '100%', maxWidth: '180px', height: 'auto' }}>
                <rect x="6" y="6" width="38" height="10" fill="none" stroke="#1A1D22" strokeWidth="1"/>
                <rect x="6" y="18" width="38" height="10" fill="none" stroke="#1A1D22" strokeWidth="1"/>
                <rect x="6" y="30" width="38" height="10" fill="none" stroke="#1A1D22" strokeWidth="1"/>
                <text x="62" y="26" fontSize="11" fill="#1A1D22">→</text>
                <rect x="80" y="14" width="54" height="20" fill="none" stroke="#1A1D22" strokeWidth="1.4"/>
                <text x="25" y="52" fontSize="7" fill="#4A5159" fontFamily="sans-serif">Stack</text>
                <text x="107" y="52" fontSize="7" fill="#A82820" fontFamily="sans-serif" fontWeight="bold">One Stick</text>
              </svg>
            </div>
            <div style={{ fontSize: '12px', textAlign: 'center' }}><strong>1. One Stick vs Stack</strong></div>
          </Panel>
          <Panel>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <svg viewBox="0 0 140 56" style={{ width: '100%', maxWidth: '180px', height: 'auto' }}>
                <path d="M 122 22 Q 122 6 70 6 Q 18 6 18 22" fill="none" stroke="#6B7280" strokeWidth="0.8" strokeDasharray="2 2"/>
                <polygon points="18,22 15,17 21,17" fill="#6B7280"/>
                {[4, 30, 56, 82, 108].map((x, i) => (
                  <rect key={i} x={x} y="22" width="22" height="20" fill="none" stroke="#1A1D22" strokeWidth="1"/>
                ))}
              </svg>
            </div>
            <div style={{ fontSize: '12px', textAlign: 'center' }}><strong>2. Activation Loop</strong></div>
          </Panel>
        </Grid2>
      </>
    ),
  },
  {
    id: 'tool-14',
    label: 'Tool 14 · Progress Report',
    kicker: 'Tool 14 · Progress Report',
    title: 'Progress',
    titleAccent: 'Report',
    content: (
      <OsTable
        headers={['Field', 'Write This', 'Limit']}
        rows={[
          ['Subject', 'What changed + why it matters', '10 words'],
          ['Headline', 'Buyer phrase or defining motion', '1 line'],
          ['Movement', 'Trials, activations, reorders, clean no\'s', '3 bullets'],
          ['Proof', 'One quote · one number · one named place', '3 lines'],
        ]}
      />
    ),
  },
  {
    id: 'tool-15',
    label: 'Tool 15 · Cadence',
    kicker: 'Tool 15 · Cadence',
    title: 'Weekly',
    titleAccent: 'Cadence',
    content: (
      <Grid3>
        <Panel><strong>1. Contact (40%)</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Prospecting, meetings</span></Panel>
        <Panel><strong>2. Develop (20%)</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Practice, feedback</span></Panel>
        <Panel><strong>3. Comms (18%)</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Follow-up, proposals</span></Panel>
      </Grid3>
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

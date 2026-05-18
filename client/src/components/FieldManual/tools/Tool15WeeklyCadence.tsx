import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool15WeeklyCadence() {
  return (
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
    );
}


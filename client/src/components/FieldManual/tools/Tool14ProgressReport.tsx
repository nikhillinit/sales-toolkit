import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool14ProgressReport() {
  return (
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
    );
}


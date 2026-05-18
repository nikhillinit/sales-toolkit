import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool10StoryVault() {
  return (
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
    );
}


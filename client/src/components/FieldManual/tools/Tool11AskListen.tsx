import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool11AskListen() {
  return (
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
    );
}


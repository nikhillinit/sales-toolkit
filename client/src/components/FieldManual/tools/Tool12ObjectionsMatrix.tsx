import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';
import { OBJECTIONS, buildRoleplayPrefill, type ObjectionCode } from '@shared/objections';
import { useLocation } from 'wouter';

// Map OBJ card num (1-13) to the closest @shared OBJ code
// OBJ-01..08 map directly; OBJ 9-13 use the closest semantic match
const OBJ_CODE_MAP: Record<string, ObjectionCode> = {
  '1':  'OBJ-01', // coffee
  '2':  'OBJ-02', // crew won't care
  '3':  'OBJ-03', // send me info
  '4':  'OBJ-04', // OPSS
  '5':  'OBJ-04', // clinically proven → closest is OPSS/certification
  '6':  'OBJ-04', // patient safety → certification lane
  '7':  'OBJ-05', // too expensive
  '8':  'OBJ-06', // 120mg not enough
  '9':  'OBJ-07', // Celsius/Monster
  '10': 'OBJ-07', // members won't mix → incumbent loyalty
  '11': 'OBJ-04', // can't take samples → certification/process gate
  '12': 'OBJ-08', // never heard of you
  '13': 'OBJ-03', // 50 free sticks → stall/oversize ask
};

export default function Tool12ObjectionsMatrix() {
  const [, setLocation] = useLocation();
  return (
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
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#fff', flex: 1 }}>{obj.title}</span>
              {OBJ_CODE_MAP[obj.num] && (
                <button
                  onClick={() => {
                    const code = OBJ_CODE_MAP[obj.num];
                    const prefill = buildRoleplayPrefill(code);
                    setLocation('/roleplay', {
                      state: {
                        __roleplayPrefill: prefill,
                      },
                    });
                  }}
                  style={{
                    padding: '3px 8px',
                    background: '#A82820',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '2px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  title={`Drill this objection in Roleplay Simulator`}
                >
                  ▶ Drill
                </button>
              )}
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
    );
}


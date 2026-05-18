import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function OperatingSpine() {
  return (
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
    );
}


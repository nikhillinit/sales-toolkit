import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool09WrittenOutreach() {
  return (
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
    );
}


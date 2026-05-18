import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool03WalkTalk() {
  return (
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
    );
}


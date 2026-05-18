import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool02AVitaminsPainkillers() {
  return (
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
    );
}


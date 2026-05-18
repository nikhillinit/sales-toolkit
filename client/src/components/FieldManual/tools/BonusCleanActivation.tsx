import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function BonusCleanActivation() {
  return (
      <Grid3>
        <Panel><div className="os-h3" style={{ marginTop: 0 }}>Named Owner</div><div style={{ fontSize: '13px', color: '#4A5159' }}>Can you text them?</div></Panel>
        <Panel><div className="os-h3" style={{ marginTop: 0 }}>Feedback Loop</div><div style={{ fontSize: '13px', color: '#4A5159' }}>Stranger knows what to check?</div></Panel>
        <Panel><div className="os-h3" style={{ marginTop: 0 }}>Trial Discipline</div><div style={{ fontSize: '13px', color: '#4A5159' }}>Champion survives fail?</div></Panel>
      </Grid3>
    );
}


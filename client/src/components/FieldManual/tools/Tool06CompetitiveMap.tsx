import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool06CompetitiveMap() {
  return (
      <Grid2>
        <Panel><div className="os-h3"><Badge>Restless</Badge></div><div style={{ fontSize: '13px' }}><strong>Why:</strong> One mix for 3am slump. <strong>Compared:</strong> Moderate caffeine + L-theanine (120mg / 240mg).</div></Panel>
        <Panel><div className="os-h3"><Badge variant="muted">Coffee / Monster / LI.V.</Badge></div><div style={{ fontSize: '13px' }}><strong>Coffee:</strong> Free, social. <strong>Monster:</strong> Habit, spike. <strong>LI.V:</strong> Hydration only.</div></Panel>
      </Grid2>
    );
}


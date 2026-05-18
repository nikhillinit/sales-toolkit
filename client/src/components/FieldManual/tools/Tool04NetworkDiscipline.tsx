import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool04NetworkDiscipline() {
  return (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>A 5-day rhythm. No cold decks. No unnamed ships.</p>
        <Grid3>
          <Panel><strong>Mon: Old Warm</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>3 dormant contacts. Text, no ask.</span></Panel>
          <Panel><strong>Tue: New Warm</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>2 recent intros within 72h.</span></Panel>
          <Panel><strong>Wed: Cold In</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Named, researched by hand.</span></Panel>
        </Grid3>
      </>
    );
}


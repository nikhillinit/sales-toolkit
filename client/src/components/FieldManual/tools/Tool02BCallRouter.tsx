import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool02BCallRouter() {
  return (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>When the buyer talks, route. When they resist, reframe.</p>
        <OsTable
          headers={['Situation', 'From (Their Frame)', 'To (Our Frame)']}
          rows={[
            ['3 AM fatigue', 'Another can', 'Real-shift test'],
            ['Crew buys own', 'Budget objection', 'Crew-choice trial'],
            ['Send info', 'Lost in inbox', 'Artifact + permission'],
          ]}
        />
      </>
    );
}


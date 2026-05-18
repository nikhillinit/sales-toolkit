import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function StartHere() {
  return (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>
          Every trial leaving the building must check these 8 fields. No blanks. No ship.
        </p>
        <OsTable
          headers={['Field', 'Example (Good)']}
          rows={[
            ['1. Named Human', '"Sgt. Ramirez, MWR coordinator"'],
            ['2. Current Routine', '"Crew buys energy drinks out of pocket"'],
            ['3. Real Use Window', '"Pre-PT, 0530, 3x/week"'],
            ['4. Buyer-Named Risk', '"Sgt. Ramirez worried crew will mock it"'],
            ['5. Trial Type', '1 box (20 sticks) for squad of 12'],
            ['6. Unique Code', '"MRZ-0526-A" — every trial gets a code'],
            ['7. Follow-Up Date', '"Check Monday after weekend ruck. Text me."'],
            ['8. Binary Success Q', '"If 8+ say yes, I\'ll bring the PO."'],
          ]}
        />
      </>
    );
}


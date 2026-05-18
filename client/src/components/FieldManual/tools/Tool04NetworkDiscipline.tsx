import { Grid3, Panel } from '../FieldManualPrimitives';

export default function Tool04NetworkDiscipline() {
  return (
      <>
        <p style={{ fontSize: '14px', marginBottom: '12px' }}>A 5-day rhythm. No cold decks. No unnamed ships.</p>
        <Grid3>
          <Panel><strong>Gear 1 / Mon: Old Warm</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Target: 3 dormant contacts. Text, no ask.</span></Panel>
          <Panel><strong>Gear 2 / Tue: New Warm</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Target: 2 recent intros within 72 hours.</span></Panel>
          <Panel><strong>Gear 3 / Wed: Cold In</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Target: 5 named, researched contacts by hand.</span></Panel>
          <Panel><strong>Gear 4 / Thu: Give First</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Target: 1 useful send before asking.</span></Panel>
          <Panel><strong>Gear 5 / Fri: In Person</strong><br /><span style={{ fontSize: '13px', color: '#4A5159' }}>Target: 1 live room, visit, or face-to-face moment.</span></Panel>
        </Grid3>
      </>
    );
}

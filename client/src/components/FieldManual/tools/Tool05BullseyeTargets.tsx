import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool05BullseyeTargets() {
  return (
      <>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <BullseyeRings />
          <div style={{ flex: 1, minWidth: '180px' }}>
            <OsTable
              headers={['Ring', 'Segment']}
              rows={[
                [<Badge>R1</Badge>, <><strong>Responder station &amp; MRF.</strong></>],
                [<Badge variant="muted">R2</Badge>, <><strong>555-Firehouses &amp; base MWR.</strong></>],
                [<Badge variant="muted">R3</Badge>, <><strong>CF / BJJ / MMA.</strong> Coach-first only.</>],
              ]}
            />
          </div>
        </div>
      </>
    );
}


function BullseyeRings() {
  return (
    <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
      {/* R4 */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid #4A5159' }} />
      {/* R3 */}
      <div style={{ position: 'absolute', inset: '18px', borderRadius: '50%', border: '1px solid #4A5159' }} />
      {/* R2 */}
      <div style={{ position: 'absolute', inset: '36px', borderRadius: '50%', border: '1px solid #A82820', background: '#F6DAD6' }} />
      {/* R1 */}
      <div style={{
        position: 'absolute', inset: '54px', borderRadius: '50%',
        background: '#A82820', color: '#fff',
        display: 'grid', placeItems: 'center', textAlign: 'center',
        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', lineHeight: 1.1,
      }}>
        R1<br />FIRE+MRF
      </div>
      {/* Cross */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed #4A5159' }} />
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dashed #4A5159' }} />
      {/* Labels */}
      <div style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#4A5159', whiteSpace: 'nowrap' }}>R4 · Health/Shops</div>
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#4A5159', whiteSpace: 'nowrap' }}>R3 · CF/BJJ/MMA</div>
      <div style={{ position: 'absolute', top: '38px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#A82820', fontWeight: 700, whiteSpace: 'nowrap' }}>R2 · 555+MWR</div>
    </div>
  );
}

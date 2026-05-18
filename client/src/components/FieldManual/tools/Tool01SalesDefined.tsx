import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool01SalesDefined() {
  return (
      <>
        <Grid3>
          <Panel><Badge>01 / What</Badge><div className="os-h3">What is my sale to be made?</div><div style={{ fontSize: '13px' }}>One clearly dosed <strong>energy-plus-hydration stick</strong> for crews that already buy energy drinks — traded for a real-shift trial and an honest yes/no.</div></Panel>
          <Panel><Badge>02 / Who</Badge><div className="os-h3">To whom?</div><div style={{ fontSize: '13px' }}><strong>P1</strong> responders &amp; military-adjacent · <strong>P2</strong> gym / combat · <strong>P3</strong> healthcare, <em>label-first</em>.</div></Panel>
          <Panel><Badge>03 / Steps</Badge><div className="os-h3">Six key steps</div><div style={{ fontSize: '13px' }}>Name the room — earn the intro — ship a <strong>coded micro-trial</strong> — real shift use — honest yes/no — route.</div></Panel>
        </Grid3>
        <div className="os-warn"><strong>Miss the floor Monday, week's behind.</strong> Report the miss — don't hide it.</div>
      </>
    );
}


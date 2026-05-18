import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool07QualificationProtocol() {
  return (
      <>
        <Panel>
          <FlowStep num="1" title="Named Pain" sub='"Where does the current routine fall short?"' />
          <FlowStep num="2" title="Access" sub='"Who decides what the crew tries?"' />
          <FlowStep num="3" title="Trial Fit" sub='"Where would a small trial be tested?"' />
          <FlowStep num="4" title="Feedback Loop" sub='"Who will tell me if it flopped?"' />
        </Panel>
        <div className="os-warn"><strong>Four pass → complete Activation Standard.</strong> Any "no" → thank, exit clean, code it.</div>
      </>
    );
}


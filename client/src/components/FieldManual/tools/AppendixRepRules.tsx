import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function AppendixRepRules() {
  return (
      <Grid2>
        <Panel>
          <div style={{ fontSize: '13px', lineHeight: 1.7 }}>
            <strong>01 · Code before product.</strong> No code — no ship.<br />
            <strong>02 · Trials, not gifts.</strong> 3–10 sticks, yes/no at end.<br />
            <strong>03 · Named recipient only.</strong> No "the station".<br />
            <strong>04 · Coach-only first.</strong> No member-facing until yes.<br />
            <strong>05 · Honest yes/no.</strong> "Chuck it" is clean.
          </div>
        </Panel>
        <Panel>
          <div style={{ fontSize: '13px', lineHeight: 1.7 }}>
            <strong>06 · No hero claims.</strong> Never "proven" or unverified.<br />
            <strong>07 · Cite the label.</strong> Supplement Facts = truth.<br />
            <strong>08 · "I don't know" wins.</strong> + deadline.<br />
            <strong>09 · Founder story = backdrop.</strong><br />
            <strong>10 · Walk away clean.</strong> Pressure kills next convo.
          </div>
        </Panel>
      </Grid2>
    );
}


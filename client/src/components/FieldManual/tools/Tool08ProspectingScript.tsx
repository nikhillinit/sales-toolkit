import { Badge, FlowStep, Grid2, Grid3, OsTable, Panel } from '../FieldManualPrimitives';

export default function Tool08ProspectingScript() {
  return (
      <OsTable
        headers={['Time', 'Script']}
        rows={[
          [<Badge>:00</Badge>, '"Hi [name], this is [your name] with Restless. I know you didn\'t expect my call — I\'ll be quick."'],
          [<Badge>:10</Badge>, '"I work with [named peer] on a simple thing: energy and hydration in one stick for long shifts."'],
          [<Badge>:25</Badge>, '"Two questions — does your crew hit a wall on the back half? And who decides if they try something new?"'],
        ]}
      />
    );
}


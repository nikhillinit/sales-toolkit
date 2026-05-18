/**
 * ICS calendar export — generates RFC 5545-compliant .ics files for follow-up cadence steps.
 *
 * Used by WeeklyCadencePlanner and the follow-up step to export trial follow-ups to the
 * device calendar.
 */

export interface IcsEvent {
  uid: string;
  summary: string;
  description?: string;
  dtstart: Date;
  dtend?: Date;
  location?: string;
}

function formatDate(d: Date): string {
  // Format as YYYYMMDDTHHMMSSZ (UTC)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function foldLine(line: string): string {
  // RFC 5545: lines > 75 octets must be folded
  const MAX = 75;
  if (line.length <= MAX) return line;
  const parts: string[] = [];
  let pos = 0;
  while (pos < line.length) {
    if (pos === 0) {
      parts.push(line.slice(0, MAX));
      pos = MAX;
    } else {
      parts.push(' ' + line.slice(pos, pos + MAX - 1));
      pos += MAX - 1;
    }
  }
  return parts.join('\r\n');
}

export function buildIcs(events: IcsEvent[]): string {
  const now = formatDate(new Date());
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Restless FieldKit//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const ev of events) {
    const dtstart = formatDate(ev.dtstart);
    const dtend = formatDate(ev.dtend ?? new Date(ev.dtstart.getTime() + 30 * 60 * 1000));
    lines.push('BEGIN:VEVENT');
    lines.push(foldLine(`UID:${escapeIcs(ev.uid)}`));
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    lines.push(foldLine(`SUMMARY:${escapeIcs(ev.summary)}`));
    if (ev.description) {
      lines.push(foldLine(`DESCRIPTION:${escapeIcs(ev.description)}`));
    }
    if (ev.location) {
      lines.push(foldLine(`LOCATION:${escapeIcs(ev.location)}`));
    }
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcs(events: IcsEvent[], filename = 'fieldkit-followups.ics'): void {
  const ics = buildIcs(events);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Build ICS events from a list of trials with cadence steps.
 * Generates one event per pending cadence step.
 */
export interface TrialForIcs {
  id: number;
  acct: string;
  human: string;
  shippedAt: string;
  cadenceStep: number;
}

const CADENCE_DAYS = [1, 3, 7, 14, 30];
const CADENCE_LABELS = ['D+1 Check-in', 'D+3 Follow-up', 'D+7 Review', 'D+14 Decision', 'D+30 Reorder'];

export function trialsToIcsEvents(trials: TrialForIcs[]): IcsEvent[] {
  const events: IcsEvent[] = [];
  for (const trial of trials) {
    const shipped = new Date(trial.shippedAt);
    for (let step = trial.cadenceStep; step < CADENCE_DAYS.length; step++) {
      const daysOffset = CADENCE_DAYS[step];
      const dtstart = new Date(shipped.getTime() + daysOffset * 24 * 60 * 60 * 1000);
      // Set to 9am local time
      dtstart.setHours(9, 0, 0, 0);
      events.push({
        uid: `fieldkit-trial-${trial.id}-step-${step}@restless`,
        summary: `${CADENCE_LABELS[step]}: ${trial.human} @ ${trial.acct}`,
        description: `FieldKit cadence follow-up — Trial #${trial.id}`,
        dtstart,
      });
    }
  }
  return events;
}

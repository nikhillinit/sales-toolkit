import type { FieldManualSection } from './FieldManualPrimitives';
import StartHere from './tools/StartHere';
import Tool01SalesDefined from './tools/Tool01SalesDefined';
import Tool02AVitaminsPainkillers from './tools/Tool02AVitaminsPainkillers';
import Tool02BCallRouter from './tools/Tool02BCallRouter';
import Tool03WalkTalk from './tools/Tool03WalkTalk';
import Tool04NetworkDiscipline from './tools/Tool04NetworkDiscipline';
import Tool05BullseyeTargets from './tools/Tool05BullseyeTargets';
import Tool06CompetitiveMap from './tools/Tool06CompetitiveMap';
import Tool07QualificationProtocol from './tools/Tool07QualificationProtocol';
import Tool08ProspectingScript from './tools/Tool08ProspectingScript';
import Tool09WrittenOutreach from './tools/Tool09WrittenOutreach';
import OperatingSpine from './tools/OperatingSpine';
import Tool10StoryVault from './tools/Tool10StoryVault';
import Tool11AskListen from './tools/Tool11AskListen';
import Tool12ObjectionsMatrix from './tools/Tool12ObjectionsMatrix';
import Tool13Presentation from './tools/Tool13Presentation';
import Tool14ProgressReport from './tools/Tool14ProgressReport';
import Tool15WeeklyCadence from './tools/Tool15WeeklyCadence';
import BonusCleanActivation from './tools/BonusCleanActivation';
import AppendixRepRules from './tools/AppendixRepRules';

export const FIELD_MANUAL_SECTIONS: FieldManualSection[] = [
  {
    id: 'start-here',
    label: 'Start Here · Field Entry',
    kicker: 'Start Here · Field Entry',
    title: 'V0 Live Flow',
    titleAccent: '& Activation',
    Content: StartHere,
  },
  {
    id: 'tool-01',
    label: 'Tool 01 · Sales Defined',
    kicker: 'Tool 01 · Sales Defined',
    title: 'What Is My Sale',
    titleAccent: 'to Be Made?',
    Content: Tool01SalesDefined,
  },
  {
    id: 'tool-02a',
    label: 'Tool 02A · Vitamins & Painkillers',
    kicker: 'Tool 02A · Vitamins & Painkillers',
    title: 'Vitamins',
    titleAccent: '& Painkillers',
    Content: Tool02AVitaminsPainkillers,
  },
  {
    id: 'tool-02b',
    label: 'Tool 02B · Call Router',
    kicker: 'Tool 02B · Call Router',
    title: 'Call Router',
    titleAccent: '& From–To',
    Content: Tool02BCallRouter,
  },
  {
    id: 'tool-03',
    label: 'Tool 03 · Walk & Talk',
    kicker: 'Tool 03 · Walk & Talk',
    title: 'Walk',
    titleAccent: '& Talk',
    Content: Tool03WalkTalk,
  },
  {
    id: 'tool-04',
    label: 'Tool 04 · Network Discipline',
    kicker: 'Tool 04 · Network Discipline',
    title: 'Network Every Week',
    Content: Tool04NetworkDiscipline,
  },
  {
    id: 'tool-05',
    label: 'Tool 05 · Bullseye Targets',
    kicker: 'Tool 05 · Bullseye Targets',
    title: 'Bullseye',
    titleAccent: 'Targets',
    Content: Tool05BullseyeTargets,
  },
  {
    id: 'tool-06',
    label: 'Tool 06 · Competitive Map',
    kicker: 'Tool 06 · Competitive Map',
    title: 'What They',
    titleAccent: 'Already Drink',
    Content: Tool06CompetitiveMap,
  },
  {
    id: 'tool-07',
    label: 'Tool 07 · Qualification Protocol',
    kicker: 'Tool 07 · Qualification Protocol',
    title: 'Four-Gear',
    titleAccent: 'Protocol',
    Content: Tool07QualificationProtocol,
  },
  {
    id: 'tool-08',
    label: 'Tool 08 · Prospecting Script',
    kicker: 'Tool 08 · Prospecting Script',
    title: 'Prospecting',
    titleAccent: 'Script',
    Content: Tool08ProspectingScript,
  },
  {
    id: 'tool-09',
    label: 'Tool 09 · Written Outreach',
    kicker: 'Tool 09 · Written Outreach',
    title: 'Breakthrough',
    titleAccent: 'Email',
    Content: Tool09WrittenOutreach,
  },
  {
    id: 'operating-spine',
    label: 'Operating Spine · One Flow, Two Gates',
    kicker: 'Operating Spine',
    title: 'One Flow,',
    titleAccent: 'Two Gates',
    Content: OperatingSpine,
  },
  {
    id: 'tool-10',
    label: 'Tool 10 · Story Vault',
    kicker: 'Tool 10 · Story Vault',
    title: 'Story',
    titleAccent: 'Vault',
    Content: Tool10StoryVault,
  },
  {
    id: 'tool-11',
    label: 'Tool 11 · Ask & Listen',
    kicker: 'Tool 11 · Ask & Listen',
    title: 'Segment',
    titleAccent: 'Pain Map',
    Content: Tool11AskListen,
  },
  {
    id: 'tool-12',
    label: 'Tool 12 · Objections Matrix',
    kicker: 'Tool 12 · Objections Matrix',
    title: 'Skepticism &',
    titleAccent: 'Objections',
    Content: Tool12ObjectionsMatrix,
  },
  {
    id: 'tool-13',
    label: 'Tool 13 · Presentation',
    kicker: 'Tool 13 · Presentation',
    title: 'Visual',
    titleAccent: 'Impact',
    Content: Tool13Presentation,
  },
  {
    id: 'tool-14',
    label: 'Tool 14 · Progress Report',
    kicker: 'Tool 14 · Progress Report',
    title: 'Progress',
    titleAccent: 'Report',
    Content: Tool14ProgressReport,
  },
  {
    id: 'tool-15',
    label: 'Tool 15 · Weekly Cadence',
    kicker: 'Tool 15 · Weekly Cadence',
    title: 'Field',
    titleAccent: 'Rhythm',
    Content: Tool15WeeklyCadence,
  },
  {
    id: 'bonus',
    label: 'Bonus · Clean Activation',
    kicker: 'Bonus · Threshold',
    title: 'Clean',
    titleAccent: 'Activation',
    Content: BonusCleanActivation,
  },
  {
    id: 'apx',
    label: 'Appendix · Rep Rules',
    kicker: 'Appendix · Rep Rules',
    title: 'The Ten',
    titleAccent: 'Rep Rules',
    Content: AppendixRepRules,
  },
];

/**
 * LaneSelector — Unified Signal OS
 * Interactive weekly lane scoring, green/amber/red ring result,
 * segment comparison, and Sunday planning form with localStorage persistence.
 *
 * Design: Unified Signal OS — Barlow Condensed display, JetBrains Mono data,
 * Source Sans 3 body, brick red #A82820 primary, warm paper #F4F1EA background.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { idbGet, idbSet } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { Copy, Link2, X } from 'lucide-react';
import { useToastActions } from '@/contexts/AppState';
import { useStoryVaultContext } from '@/contexts/StoryVaultContext';
import { generateScripts } from '@/lib/storyVault';

// ─── Types ────────────────────────────────────────────────────────────────────

type Score = 0 | 1 | 2;
type Ring = 'green' | 'amber' | 'red';

interface LaneScore {
  segment: string;
  scores: Score[]; // 6 questions, each 0–2
  storyId?: string; // optional link to a saved Story Vault card (forward-compatible)
}

interface SundayPlan {
  primaryLane: string;
  activationTarget: string;
  namedTargets: string;
  callBlocks: string;
  fieldVisits: string;
  development: string;
  objections: string;
  sayNoTo: string;
  codesReady: string;
  successCondition: string;
  savedAt: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEGMENTS = [
  'Cold Station / Gym / Industrial',
  'Warm Intro / Event / Founder-Adjacent',
  'Healthcare / MWR Evidence-First',
  'Custom Segment',
];

const QUESTIONS = [
  { id: 'q1', label: 'Named targets', sub: 'Do we have 25 named targets in this segment?' },
  { id: 'q2', label: 'Proof pack', sub: 'Do we have the right proof pack ready?' },
  { id: 'q3', label: 'Codes & fulfillment', sub: 'Are codes and fulfillment ready to ship?' },
  { id: 'q4', label: 'Timely trigger', sub: 'Is there a timely trigger: event, heat season, staffing change, class schedule?' },
  { id: 'q5', label: 'Access', sub: 'Can we get in-person or warm-intro access this week?' },
  { id: 'q6', label: 'Independence', sub: 'Can the rep run this lane independently, or is founder help required?' },
];

const SCORE_LABELS: Record<Score, string> = { 0: 'No', 1: 'Partial', 2: 'Yes' };
const SCORE_COLORS: Record<Score, string> = { 0: '#A82820', 1: '#B45309', 2: '#2E7D32' };

const RING_CONFIG: Record<Ring, { label: string; range: string; action: string; color: string; bg: string }> = {
  green: { label: 'GREEN CENTER', range: '8–12', action: 'Choose as the week\'s primary lane.', color: '#2E7D32', bg: '#E8F5E9' },
  amber: { label: 'AMBER RING',   range: '6–7',  action: 'Build proof pack, warm intros, or evidence route first.', color: '#B45309', bg: '#FFF8E1' },
  red:   { label: 'RED OUTER',    range: '0–5',  action: 'Development week. Do not force outreach.', color: '#A82820', bg: '#FEECEC' },
};

const SUNDAY_QUESTIONS = [
  { key: 'primaryLane',       label: '1. Primary lane this week',           placeholder: 'e.g. Cold station / fire / EMS' },
  { key: 'activationTarget',  label: '2. Weekly activation target',         placeholder: 'e.g. 3 complete activations' },
  { key: 'namedTargets',      label: '3. Which 25 named targets are loaded', placeholder: 'Names, stations, gyms, units...' },
  { key: 'callBlocks',        label: '4. Protected call blocks',             placeholder: 'e.g. Mon 9–11am, Tue 2–4pm' },
  { key: 'fieldVisits',       label: '5. Field visits / in-person moments', placeholder: 'Scheduled visits or warm intros...' },
  { key: 'development',       label: '6. Knowledge / Skill / Discipline to develop', placeholder: 'e.g. Objection: "120mg is light"' },
  { key: 'objections',        label: '7. Objections to practice',           placeholder: 'e.g. "We already have coffee"' },
  { key: 'sayNoTo',           label: '8. What I will say no to',            placeholder: 'e.g. No untracked giveaways, no mixing segments' },
  { key: 'codesReady',        label: '9. Samples that might leave — codes ready?', placeholder: 'e.g. 2 station bags coded MRZ-0526-A, RDG-0526-B' },
  { key: 'successCondition',  label: '10. What must be true by Friday for this to be a good week', placeholder: 'e.g. 3 activations shipped, 5 follow-ups current, 1 clean exit' },
];

// Legacy key kept for migration reference only — IDB is now the source of truth.

const EMPTY_PLAN: SundayPlan = {
  primaryLane: '', activationTarget: '', namedTargets: '',
  callBlocks: '', fieldVisits: '', development: '',
  objections: '', sayNoTo: '', codesReady: '', successCondition: '',
  savedAt: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTotal(scores: Score[]): number {
  return scores.reduce((a: number, b: Score) => a + b, 0 as number);
}

function getRing(total: number): Ring {
  if (total >= 8) return 'green';
  if (total >= 6) return 'amber';
  return 'red';
}

// saveToStorage and loadFromStorage replaced by IDB calls in the component body.

function makeDefaultScores(): LaneScore[] {
  return SEGMENTS.map(segment => ({ segment, scores: [0, 0, 0, 0, 0, 0] as Score[] }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RingVisual({ ring, total }: { ring: Ring; total: number }) {
  const cfg = RING_CONFIG[ring];
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const fraction = total / 12;
  const dash = fraction * circumference;

  // Track animation
  const prevTotal = useRef(total);
  const [animDash, setAnimDash] = useState(0);
  useEffect(() => {
    // Animate from 0 on first mount, then from prev on change
    const start = prevTotal.current === total ? 0 : (prevTotal.current / 12) * circumference;
    setAnimDash(start);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimDash(dash));
    });
    prevTotal.current = total;
    return () => cancelAnimationFrame(raf);
  }, [total, dash, circumference]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <svg viewBox="0 0 130 130" style={{ width: '130px', height: '130px' }}>
        {/* Track */}
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#EFEBE0" strokeWidth="14" />
        {/* Red outer ring always visible */}
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#FEECEC" strokeWidth="14"
          strokeDasharray={`${(5 / 12) * circumference} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          transform="rotate(-90 65 65)" />
        {/* Amber ring */}
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#FFF8E1" strokeWidth="14"
          strokeDasharray={`${(2 / 12) * circumference} ${circumference}`}
          strokeDashoffset={circumference * 0.25 - (5 / 12) * circumference}
          transform="rotate(-90 65 65)" />
        {/* Green ring */}
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#E8F5E9" strokeWidth="14"
          strokeDasharray={`${(5 / 12) * circumference} ${circumference}`}
          strokeDashoffset={circumference * 0.25 - (7 / 12) * circumference}
          transform="rotate(-90 65 65)" />
        {/* Score arc */}
        <circle cx="65" cy="65" r={radius} fill="none" stroke={cfg.color} strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${animDash} ${circumference}`}
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.23,1,0.32,1), stroke 0.3s' }} />
        {/* Center score */}
        <text x="65" y="58" textAnchor="middle"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '22px', fill: cfg.color }}>
          {total}
        </text>
        <text x="65" y="74" textAnchor="middle"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '9px', fill: '#4A5159', letterSpacing: '0.08em' }}>
          OUT OF 12
        </text>
      </svg>

      {/* Ring badge */}
      <div style={{
        background: cfg.bg, border: `1.5px solid ${cfg.color}`, borderRadius: '3px',
        padding: '6px 14px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: cfg.color, letterSpacing: '0.08em' }}>
          {cfg.label} · {cfg.range}
        </div>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', color: '#1A1D22', marginTop: '2px' }}>
          {cfg.action}
        </div>
      </div>
    </div>
  );
}

function ScoreButton({ value, current, onChange }: { value: Score; current: Score; onChange: (v: Score) => void }) {
  const active = value === current;
  return (
    <button
      onClick={() => onChange(value)}
      style={{
        flex: 1,
        padding: '7px 4px',
        border: `1.5px solid ${active ? SCORE_COLORS[value] : '#C8CCD2'}`,
        background: active ? SCORE_COLORS[value] : 'transparent',
        color: active ? '#fff' : '#4A5159',
        borderRadius: '2px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.15s cubic-bezier(0.23,1,0.32,1)',
        transform: active ? 'scale(1)' : 'scale(0.97)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {value} · {SCORE_LABELS[value]}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LaneSelector() {
  const [laneScores, setLaneScores] = useState<LaneScore[]>(makeDefaultScores);
  const [activeLaneIdx, setActiveLaneIdx] = useState(0);
  const [plan, setPlan] = useState<SundayPlan>(EMPTY_PLAN);
  const [activeTab, setActiveTab] = useState<'score' | 'compare' | 'plan'>('score');
  const [saved, setSaved] = useState(false);
  const [customSegment, setCustomSegment] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [showStoryPicker, setShowStoryPicker] = useState(false);

  const { vault } = useStoryVaultContext();
  const { toast } = useToastActions();

  // Load from IDB on mount
  useEffect(() => {
    idbGet<{ laneScores: LaneScore[]; plan: SundayPlan } | null>(STORAGE_KEYS.laneSelector, null)
      .then(stored => {
        if (stored) {
          setLaneScores(stored.laneScores.length === SEGMENTS.length ? stored.laneScores : makeDefaultScores());
          setPlan(stored.plan);
          if (stored.laneScores[3]?.segment !== SEGMENTS[3]) {
            setCustomSegment(stored.laneScores[3].segment);
          }
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const activeLane = laneScores[activeLaneIdx];
  const activeTotal = activeLane ? getTotal(activeLane.scores) : 0;
  const activeRing = getRing(activeTotal);

  const setScore = useCallback((qIdx: number, val: Score) => {
    setLaneScores(prev => {
      const next = prev.map((lane, i) => {
        if (i !== activeLaneIdx) return lane;
        const newScores = [...lane.scores] as Score[];
        newScores[qIdx] = val;
        return { ...lane, scores: newScores };
      });
      return next;
    });
    setSaved(false);
  }, [activeLaneIdx]);

  const linkStoryToActiveLane = useCallback((storyId: string) => {
    setLaneScores(prev => prev.map((lane, i) =>
      i === activeLaneIdx ? { ...lane, storyId } : lane
    ));
    setShowStoryPicker(false);
    setSaved(false);
    toast('Story linked to lane.');
  }, [activeLaneIdx, toast]);

  const unlinkStoryFromActiveLane = useCallback(() => {
    setLaneScores(prev => prev.map((lane, i) =>
      i === activeLaneIdx ? { ...lane, storyId: undefined } : lane
    ));
    setSaved(false);
  }, [activeLaneIdx]);

  const copyLinkedScript = useCallback((text: string) => {
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        toast('Copy failed — long-press to copy manually');
        return;
      }
      navigator.clipboard.writeText(text)
        .then(() => toast('15s script copied.'))
        .catch(() => toast('Copy failed — long-press to copy manually'));
    } catch {
      toast('Copy failed — long-press to copy manually');
    }
  }, [toast]);

  const activeLinkedStory = useMemo(
    () => (activeLane?.storyId ? vault.find(s => s.id === activeLane.storyId) : null) ?? null,
    [activeLane?.storyId, vault],
  );
  const activeLinkBroken = Boolean(activeLane?.storyId && !activeLinkedStory);

  const handleSave = useCallback(() => {
    const planWithTimestamp: SundayPlan = { ...plan, savedAt: new Date().toLocaleString() };
    setPlan(planWithTimestamp);
    idbSet(STORAGE_KEYS.laneSelector, { laneScores, plan: planWithTimestamp }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [laneScores, plan]);

  const handleReset = useCallback(() => {
    if (!confirm('Reset all scores and planning for this week?')) return;
    const fresh = makeDefaultScores();
    setLaneScores(fresh);
    setPlan(EMPTY_PLAN);
    setCustomSegment('');
    idbSet(STORAGE_KEYS.laneSelector, { laneScores: fresh, plan: EMPTY_PLAN }).catch(() => {});
  }, []);

  const handleCustomSegmentChange = (val: string) => {
    setCustomSegment(val);
    setLaneScores(prev => prev.map((lane, i) =>
      i === 3 ? { ...lane, segment: val || SEGMENTS[3] } : lane
    ));
    setSaved(false);
  };

  const updatePlan = (key: keyof SundayPlan, val: string) => {
    setPlan(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  // Best lane (highest score)
  const bestLaneIdx = laneScores.reduce((best, lane, i) =>
    getTotal(lane.scores) > getTotal(laneScores[best].scores) ? i : best, 0);

  if (!loaded) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* Header */}
      <div style={{
        background: '#1A1D22', padding: '12px 16px', flexShrink: 0,
        borderBottom: '2px solid #A82820',
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: '#E8524A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>
          Tool 15 · Weekly Cadence
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '22px', color: '#fff', letterSpacing: '0.01em', lineHeight: 1.1 }}>
          Lane Selector <span style={{ color: '#A82820' }}>& Sunday Plan</span>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
          Score the lane. Pick the highest. Plan the week.
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #C8CCD2', flexShrink: 0 }}>
        {([
          { id: 'score' as const,   label: 'Score Lane' },
          { id: 'compare' as const, label: 'Compare' },
          { id: 'plan' as const,    label: 'Sunday Plan' },
        ]).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '9px 4px', border: 'none',
            borderBottom: `2px solid ${activeTab === t.id ? '#A82820' : 'transparent'}`,
            background: activeTab === t.id ? '#FBF8F1' : 'transparent',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            color: activeTab === t.id ? '#A82820' : '#4A5159',
            cursor: 'pointer', transition: 'all 0.15s',
            WebkitTapHighlightColor: 'transparent',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* ── SCORE TAB ── */}
        {activeTab === 'score' && (
          <div style={{ padding: '14px 16px', maxWidth: '600px', margin: '0 auto' }}>

            {/* Segment selector */}
            <div style={{ marginBottom: '14px' }}>
              <div className="os-label" style={{ marginBottom: '6px' }}>Select segment to score</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {laneScores.map((lane, i) => {
                  const t = getTotal(lane.scores);
                  const r = getRing(t);
                  const ringCfg = RING_CONFIG[r];
                  const isActive = i === activeLaneIdx;
                  return (
                    <button key={i} onClick={() => setActiveLaneIdx(i)} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', border: `1.5px solid ${isActive ? '#A82820' : '#C8CCD2'}`,
                      background: isActive ? '#FBF8F1' : '#fff', borderRadius: '3px',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      WebkitTapHighlightColor: 'transparent',
                    }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: ringCfg.bg, border: `2px solid ${ringCfg.color}`,
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '11px', color: ringCfg.color }}>{t}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#1A1D22', lineHeight: 1.2 }}>
                          {i === 3 && customSegment ? customSegment : lane.segment}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: ringCfg.color, fontWeight: 700, letterSpacing: '0.06em', marginTop: '1px' }}>
                          {ringCfg.label} · {t}/12
                        </div>
                      </div>
                      {i === bestLaneIdx && (
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#2E7D32', background: '#E8F5E9', padding: '2px 5px', borderRadius: '2px', flexShrink: 0 }}>
                          BEST
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom segment name input */}
            {activeLaneIdx === 3 && (
              <div style={{ marginBottom: '12px' }}>
                <label className="os-label" htmlFor="custom-seg">Custom segment name</label>
                <input
                  id="custom-seg"
                  value={customSegment}
                  onChange={e => handleCustomSegmentChange(e.target.value)}
                  placeholder="e.g. Veteran orgs, MMA circuit, Industrial EHS..."
                  style={{
                    width: '100%', padding: '10px', border: '1px solid #C8CCD2',
                    background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '14px', borderRadius: '3px', color: '#1A1D22',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {/* Ring visual */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <RingVisual ring={activeRing} total={activeTotal} />
            </div>

            {/* Question scoring */}
            <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ background: '#1A1D22', padding: '8px 12px' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#fff', letterSpacing: '0.04em' }}>
                  Score each question 0–2
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '1px' }}>
                  0 = No · 1 = Partial · 2 = Yes
                </div>
              </div>
              {QUESTIONS.map((q, qIdx) => {
                const currentScore = activeLane?.scores[qIdx] ?? 0;
                return (
                  <div key={q.id} style={{
                    padding: '10px 12px', borderBottom: '1px solid #EFEBE0',
                  }}>
                    <div style={{ marginBottom: '6px' }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#1A1D22' }}>
                        {qIdx + 1}. {q.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#4A5159', marginTop: '1px', lineHeight: 1.4 }}>
                        {q.sub}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {([0, 1, 2] as Score[]).map(v => (
                        <ScoreButton key={v} value={v} current={currentScore as Score} onChange={val => setScore(qIdx, val)} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decision rule */}
            <div style={{
              background: RING_CONFIG[activeRing].bg,
              border: `1px solid ${RING_CONFIG[activeRing].color}`,
              borderRadius: '3px', padding: '10px 12px', marginBottom: '14px',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: RING_CONFIG[activeRing].color, letterSpacing: '0.08em', marginBottom: '4px' }}>
                DECISION RULE · {RING_CONFIG[activeRing].label}
              </div>
              <div style={{ fontSize: '13px', color: '#1A1D22', lineHeight: 1.5 }}>
                {RING_CONFIG[activeRing].action}
              </div>
              {activeRing === 'red' && (
                <div style={{ fontSize: '12px', color: '#4A5159', marginTop: '6px', fontStyle: 'italic' }}>
                  If no lane scores above 6, spend the week on development drills and prospect-building instead of forcing outreach.
                </div>
              )}
              {activeRing === 'amber' && (
                <div style={{ fontSize: '12px', color: '#4A5159', marginTop: '6px', fontStyle: 'italic' }}>
                  If two lanes tie, pick the one with the timely trigger.
                </div>
              )}
            </div>

            {/* Linked Story */}
            <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#1A1D22' }}>
                  Proof Story for this Lane
                </div>
                {activeLinkedStory && (
                  <button
                    onClick={unlinkStoryFromActiveLane}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: 'transparent', border: '1px solid #C8CCD2', borderRadius: '2px', color: '#4A5159', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
                  >
                    <X size={11} /> UNLINK
                  </button>
                )}
              </div>

              {activeLinkedStory ? (
                <>
                  <div style={{ background: '#FBF8F1', borderLeft: '3px solid #2E7D32', padding: '8px 10px', marginBottom: '8px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#2E7D32', letterSpacing: '0.06em' }}>LINKED · 15S HOOK</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#1A1D22', marginTop: '2px' }}>{activeLinkedStory.title}</div>
                    <div style={{ fontSize: '12px', color: '#4A5159', fontStyle: 'italic', marginTop: '4px', lineHeight: 1.5 }}>
                      &ldquo;{generateScripts(activeLinkedStory).fifteen}&rdquo;
                    </div>
                  </div>
                  <button
                    onClick={() => copyLinkedScript(generateScripts(activeLinkedStory).fifteen)}
                    style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #2E7D32', color: '#2E7D32', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Copy size={11} /> COPY 15S HOOK
                  </button>
                </>
              ) : activeLinkBroken ? (
                <div style={{ background: '#FEECEC', border: '1px solid #A82820', borderRadius: '2px', padding: '8px 10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#A82820', letterSpacing: '0.06em', marginBottom: '4px' }}>LINKED STORY REMOVED</div>
                  <div style={{ fontSize: '12px', color: '#4A5159', marginBottom: '8px' }}>The story that was linked here has been deleted from the vault.</div>
                  <button
                    onClick={unlinkStoryFromActiveLane}
                    style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #A82820', color: '#A82820', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer' }}
                  >
                    ✕ CLEAR BROKEN LINK
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '12px', color: '#4A5159', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                    Attach a real customer story to remember why this lane is winnable. The 15-second hook is one tap away during a live call.
                  </p>
                  <button
                    onClick={() => setShowStoryPicker(s => !s)}
                    style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #C8CCD2', color: '#4A5159', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Link2 size={11} /> {showStoryPicker ? 'HIDE PICKER' : 'LINK A STORY'}
                  </button>
                  {showStoryPicker && (
                    <div style={{ marginTop: '8px', background: '#FBF8F1', border: '1px solid #C8CCD2', borderRadius: '2px', padding: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                      {vault.length === 0 ? (
                        <div style={{ padding: '10px', textAlign: 'center', fontSize: '12px', color: '#4A5159', fontStyle: 'italic' }}>
                          No saved stories yet. Open the Story Vault tab to create one.
                        </div>
                      ) : (
                        vault.map(story => (
                          <button
                            key={story.id}
                            onClick={() => linkStoryToActiveLane(story.id)}
                            style={{
                              display: 'block', width: '100%', textAlign: 'left',
                              padding: '6px 8px', marginBottom: '4px',
                              background: '#fff', border: '1px solid #EFEBE0',
                              borderRadius: '2px', cursor: 'pointer',
                            }}
                          >
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#1A1D22', lineHeight: 1.2 }}>{story.title}</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4A5159', marginTop: '2px', letterSpacing: '0.04em' }}>
                              {story.character}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Save button */}
            <button onClick={handleSave} style={{
              width: '100%', padding: '13px', background: saved ? '#2E7D32' : '#A82820',
              color: '#fff', border: 'none', borderRadius: '3px',
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
              cursor: 'pointer', transition: 'background 0.3s', minHeight: '48px',
            }}>
              {saved ? '✓ Saved to Device' : '💾 Save Weekly Plan'}
            </button>
            {plan.savedAt && (
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#4A5159', marginTop: '6px', fontStyle: 'italic' }}>
                Last saved: {plan.savedAt}
              </div>
            )}
          </div>
        )}

        {/* ── COMPARE TAB ── */}
        {activeTab === 'compare' && (
          <div style={{ padding: '14px 16px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="os-h2" style={{ marginTop: 0 }}>Segment Comparison</div>
            <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
              Highest score wins. If two lanes tie, pick the one with the timely trigger (Q4).
            </p>

            {/* Comparison bars */}
            {laneScores.map((lane, i) => {
              const t = getTotal(lane.scores);
              const r = getRing(t);
              const cfg = RING_CONFIG[r];
              const pct = (t / 12) * 100;
              const isBest = i === bestLaneIdx;
              return (
                <div key={i} style={{
                  background: '#fff', border: `1.5px solid ${isBest ? cfg.color : '#C8CCD2'}`,
                  borderRadius: '4px', padding: '12px', marginBottom: '8px',
                  boxShadow: isBest ? `0 0 0 1px ${cfg.color}20` : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: '#1A1D22', lineHeight: 1.2 }}>
                        {i === 3 && customSegment ? customSegment : lane.segment}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: cfg.color, fontWeight: 700, letterSpacing: '0.06em', marginTop: '2px' }}>
                        {cfg.label}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '22px', color: cfg.color, lineHeight: 1 }}>
                        {t}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4A5159' }}>/ 12</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '6px', background: '#EFEBE0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, background: cfg.color,
                      borderRadius: '3px', transition: 'width 0.6s cubic-bezier(0.23,1,0.32,1)',
                    }} />
                  </div>
                  {/* Per-question breakdown */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                    {lane.scores.map((s, qi) => (
                      <div key={qi} title={QUESTIONS[qi].label} style={{
                        flex: 1, height: '20px', background: s === 2 ? '#2E7D32' : s === 1 ? '#B45309' : '#EFEBE0',
                        borderRadius: '2px', display: 'grid', placeItems: 'center',
                        transition: 'background 0.2s',
                      }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: s > 0 ? '#fff' : '#4A5159' }}>
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '3px' }}>
                    {QUESTIONS.map((q, qi) => (
                      <div key={qi} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#4A5159', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Q{qi + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  {isBest && t > 0 && (
                    <div style={{
                      marginTop: '8px', padding: '5px 8px', background: cfg.bg,
                      border: `1px solid ${cfg.color}`, borderRadius: '2px',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                      fontWeight: 700, color: cfg.color, letterSpacing: '0.04em',
                    }}>
                      ★ HIGHEST SCORE — RECOMMENDED PRIMARY LANE
                    </div>
                  )}
                </div>
              );
            })}

            {/* Question legend */}
            <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '3px', padding: '10px 12px', marginTop: '4px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#4A5159', letterSpacing: '0.06em', marginBottom: '6px' }}>
                QUESTION KEY
              </div>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '3px 0', borderBottom: i < QUESTIONS.length - 1 ? '1px solid #EFEBE0' : 'none' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820', minWidth: '20px' }}>Q{i + 1}</span>
                  <span style={{ fontSize: '12px', color: '#4A5159' }}>{q.sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUNDAY PLAN TAB ── */}
        {activeTab === 'plan' && (
          <div style={{ padding: '14px 16px', maxWidth: '600px', margin: '0 auto' }}>

            {/* Best lane recommendation */}
            {(() => {
              const best = laneScores[bestLaneIdx];
              const t = getTotal(best.scores);
              const r = getRing(t);
              const cfg = RING_CONFIG[r];
              const name = bestLaneIdx === 3 && customSegment ? customSegment : best.segment;
              return t > 0 ? (
                <div style={{
                  background: cfg.bg, border: `1.5px solid ${cfg.color}`,
                  borderRadius: '3px', padding: '10px 12px', marginBottom: '14px',
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: cfg.color, letterSpacing: '0.08em', marginBottom: '3px' }}>
                    RECOMMENDED PRIMARY LANE · {t}/12 · {cfg.label}
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '16px', color: '#1A1D22' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4A5159', marginTop: '2px' }}>{cfg.action}</div>
                </div>
              ) : null;
            })()}

            <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
              <div className="os-h2" style={{ marginTop: 0 }}>Sunday Planning — 15 Minutes</div>
              <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
                Answer all ten before the week begins. Saves to your device automatically when you tap Save.
              </p>
              {SUNDAY_QUESTIONS.map(q => (
                <div key={q.key} style={{ marginBottom: '12px' }}>
                  <label className="os-label" htmlFor={`plan-${q.key}`}>{q.label}</label>
                  <textarea
                    id={`plan-${q.key}`}
                    value={(plan as unknown as Record<string, string>)[q.key] || ''}
                    onChange={e => updatePlan(q.key as keyof SundayPlan, e.target.value)}
                    placeholder={q.placeholder}
                    rows={q.key === 'namedTargets' || q.key === 'sayNoTo' ? 3 : 2}
                    style={{
                      width: '100%', padding: '10px', border: '1px solid #C8CCD2',
                      background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: '14px', borderRadius: '3px', resize: 'vertical',
                      color: '#1A1D22', boxSizing: 'border-box',
                      lineHeight: 1.5,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Save */}
            <button onClick={handleSave} style={{
              width: '100%', padding: '13px', background: saved ? '#2E7D32' : '#A82820',
              color: '#fff', border: 'none', borderRadius: '3px',
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
              cursor: 'pointer', transition: 'background 0.3s', minHeight: '48px',
            }}>
              {saved ? '✓ Saved to Device' : '💾 Save Sunday Plan'}
            </button>
            {plan.savedAt && (
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#4A5159', marginTop: '6px', fontStyle: 'italic' }}>
                Last saved: {plan.savedAt}
              </div>
            )}

            {/* Reset */}
            <button onClick={handleReset} style={{
              width: '100%', marginTop: '8px', padding: '10px',
              background: 'transparent', color: '#4A5159',
              border: '1px solid #C8CCD2', borderRadius: '3px',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
              fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
            }}>
              ↺ Reset All Scores & Plan
            </button>

            {/* What to say no to reminder */}
            <div style={{ background: '#1A1D22', borderRadius: '4px', padding: '12px', marginTop: '14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820', letterSpacing: '0.08em', marginBottom: '8px' }}>
                WHAT TO SAY NO TO THIS WEEK
              </div>
              {[
                'Full-bag giveaways without named owner, code, use window, and feedback loop.',
                '"Send me info" without artifact choice and follow-up permission.',
                'Healthcare samples before label/evidence review.',
                'Wholesale pitch before coach trial in gyms.',
                'Any claim not sourced to current label or approved evidence summary.',
                'Founder escalations that rescue incomplete discovery.',
                'CRM catch-up at the expense of live selling time.',
                'Mixing segments inside a single call block.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820', flexShrink: 0, paddingTop: '1px' }}>✕</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

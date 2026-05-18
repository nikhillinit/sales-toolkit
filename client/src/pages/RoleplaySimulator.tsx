/**
 * RoleplaySimulator — Unified Signal OS
 * Chat-style persona roleplay for Four-Gear qualification practice.
 * Browser-to-API only — no backend. API key stored in-memory only, never persisted.
 *
 * Adopted from SalesGPT patterns:
 *  - Conversation stage awareness (stage-analyzer prompt)
 *  - Structured system prompts with persona/role/segment context
 *  - Turn-by-turn history threading
 *
 * Supports: OpenAI (gpt-4o-mini, gpt-4o), Anthropic (claude-3-haiku, claude-3-5-sonnet),
 *           Google Gemini (gemini-1.5-flash, gemini-1.5-pro)
 *
 * Design: Unified Signal OS — Barlow Condensed display, JetBrains Mono data,
 * Source Sans 3 body, brick red #A82820 primary, warm paper #F4F1EA background.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Provider = 'openai' | 'anthropic' | 'gemini';
type GearId = 'pain' | 'access' | 'fit' | 'feedback';
type GearStatus = 'locked' | 'partial' | 'clear';
type Phase = 'setup' | 'chat' | 'debrief';

interface Message {
  role: 'user' | 'buyer';
  content: string;
  ts: number;
}

interface GearScore {
  id: GearId;
  label: string;
  description: string;
  status: GearStatus;
  evidence: string;
}

interface CoachFeedback {
  gears: GearScore[];
  overallRating: 'qualified' | 'partial' | 'not-qualified';
  strengths: string[];
  improvements: string[];
  bestLine: string;
  nextStep: string;
}

// ─── Persona Data ─────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    id: 'brandon',
    name: 'Brandon',
    role: 'Station Captain',
    segment: 'fire',
    segmentLabel: 'Fire / EMS',
    avatar: '🚒',
    personality: 'Protective of his crew. Skeptical of anything that sounds like a sales pitch. Respects directness and crew-first thinking. Drinks black coffee. Has tried energy drinks before and had a bad experience with jitters.',
    pain: 'Long overnight shifts with crew fatigue around 2–3am. Coffee causes GI issues for some guys. Wants something that works without making anyone feel wired.',
    accessGate: 'Needs to hear that the rep is not trying to replace coffee — just add an option. Will allow a station table test if the rep earns it.',
    trialFit: 'Open to a station bag if the rep can name a specific shift window and get a crew member to volunteer first.',
    feedbackLoop: 'Will give honest feedback if the rep follows up on the right day (after a 48-hour shift, not right after).',
    objections: ['We already have coffee and Rip It.', 'I\'m not going to push anything on my crew.', 'What\'s the caffeine? That sounds high.', 'Is this approved?'],
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Head Coach',
    segment: 'gym',
    segmentLabel: 'Gym / Combat Sports',
    avatar: '🥊',
    personality: 'Protective of his athletes. Will not endorse anything he hasn\'t personally tested. Hates supplement bro culture. Respects reps who lead with coach credibility, not shelf placement.',
    pain: 'Athletes drag in the afternoon session. Pre-workout is too aggressive for technique work. Wants something that supports focus without aggression.',
    accessGate: 'Will only engage if the rep offers him a personal trial first — not the athletes.',
    trialFit: 'Open to a 5-stick coach-only trial. Not a full bag. Not shelf placement until he\'s tried it.',
    feedbackLoop: 'Texts back within 24 hours if he likes something. Goes silent if he doesn\'t.',
    objections: ['My athletes already use pre-workout.', 'I don\'t want to push supplements on kids.', 'What\'s the difference from C4?', 'How do I know this is clean?'],
  },
  {
    id: 'christina',
    name: 'Christina',
    role: 'Nurse Manager',
    segment: 'healthcare',
    segmentLabel: 'Healthcare',
    avatar: '🏥',
    personality: 'Evidence-first. Will not try anything without seeing the label. Skeptical of wellness language. Respects reps who lead with data and don\'t overclaim. Has seen too many supplement pitches.',
    pain: 'Night shift nurses hit a wall at 4am. Coffee causes anxiety for some. Wants something that doesn\'t interfere with patient care focus.',
    accessGate: 'Needs the label and an evidence summary before she will consider a sample.',
    trialFit: 'Will consider a personal trial only — not for staff until she\'s satisfied with the evidence.',
    feedbackLoop: 'Schedules a follow-up call if interested. Goes through proper channels.',
    objections: ['What are the clinical studies?', 'Is this safe for nurses on medication?', 'I can\'t recommend supplements to staff.', 'What does OPSS say about this?'],
  },
  {
    id: 'derek',
    name: 'Derek',
    role: 'Shift Foreman',
    segment: 'industrial',
    segmentLabel: 'Industrial / Blue-Collar',
    avatar: '🏗️',
    personality: 'No-nonsense. Hates wellness language. Respects honesty about price. Cares about whether his guys will actually use it. Suspicious of anything that sounds too fancy.',
    pain: 'Heat season is brutal. Guys are reaching for whatever\'s cold in the cooler. Energy crashes cause safety issues. Wants something that works near the water station.',
    accessGate: 'Will consider a break room box if the rep can explain the price point honestly and not pitch it as a "wellness solution."',
    trialFit: 'Open to a break room placement if the rep keeps it simple and doesn\'t oversell.',
    feedbackLoop: 'Will tell the rep straight up if the guys used it or not. No sugar-coating.',
    objections: ['How much does this cost?', 'My guys won\'t pay for this.', 'We already have Gatorade in the cooler.', 'Sounds like something for gym bros, not construction workers.'],
  },
];

const SCENARIOS = [
  { id: 'cold-call', label: 'Cold Call / Walk-In', description: 'Rep approaches with no prior relationship. Buyer has no context.' },
  { id: 'warm-intro', label: 'Warm Intro', description: 'Rep was referred by someone the buyer knows. Slight trust advantage.' },
  { id: 'follow-up', label: 'Follow-Up After Sample', description: 'Buyer received a sample last week. Rep is checking in on feedback.' },
  { id: 'objection-heavy', label: 'Objection-Heavy', description: 'Buyer is resistant and raises objections early. Rep must earn the right to continue.' },
];

const PROVIDERS: { id: Provider; label: string; models: { id: string; label: string }[]; keyHint: string; apiBase: string }[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast, cheap)' },
      { id: 'gpt-4o', label: 'GPT-4o (best quality)' },
    ],
    keyHint: 'sk-...',
    apiBase: 'https://api.openai.com/v1/chat/completions',
  },
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    models: [
      { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (fast)' },
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (best)' },
    ],
    keyHint: 'sk-ant-...',
    apiBase: 'https://api.anthropic.com/v1/messages',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    models: [
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (fast)' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (best)' },
    ],
    keyHint: 'AIza...',
    apiBase: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
];

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildBuyerSystemPrompt(persona: typeof PERSONAS[0], scenario: typeof SCENARIOS[0]): string {
  return `You are ${persona.name}, a ${persona.role} in the ${persona.segmentLabel} segment. You are being approached by a sales rep selling Restless — a powder stick energy + hydration drink (120mg caffeine, 240mg L-theanine, electrolytes, Rhodiola rosea).

SCENARIO: ${scenario.label} — ${scenario.description}

YOUR PERSONALITY: ${persona.personality}

YOUR PAIN POINT (only reveal if the rep earns it through good questions): ${persona.pain}

YOUR ACCESS GATE (what the rep must do to get a trial): ${persona.accessGate}

YOUR TRIAL FIT (what trial you'd accept): ${persona.trialFit}

YOUR FEEDBACK LOOP (how you give feedback): ${persona.feedbackLoop}

YOUR OBJECTIONS (use these naturally, not all at once): ${persona.objections.join(' | ')}

RULES FOR YOUR RESPONSES:
1. Stay in character at all times. You are ${persona.name}, not an AI.
2. Start resistant or neutral — do not be immediately helpful.
3. Only reveal your pain point if the rep asks a genuine, non-pitchy question about your routine or challenges.
4. Only open up to a trial if the rep has demonstrated they understand your world and aren't just pushing product.
5. Raise at least 2 objections naturally during the conversation.
6. Keep responses SHORT — 1–3 sentences maximum. You are busy.
7. Do NOT use sales language or wellness buzzwords yourself.
8. End the conversation naturally when the rep has either earned a next step or failed to qualify.
9. If the rep makes an unsupported claim (e.g., "clinically proven," "OPSS approved," "guaranteed no crash"), push back on it.

Respond only as ${persona.name}. No stage labels, no meta-commentary. Just the conversation.`;
}

function buildCoachSystemPrompt(): string {
  return `You are a sales coach for Restless, a field sales company. You have just observed a roleplay conversation between a sales rep and a buyer persona. Your job is to score the rep's Four-Gear qualification performance and give coaching feedback.

THE FOUR GEARS (from the Restless Field Manual):
- Gear 1 NAMED PAIN: Did the rep uncover a specific, named pain point from the buyer? (Not generic — specific to their routine, shift, or situation.)
- Gear 2 ACCESS: Did the rep earn the right to a trial? Did the buyer open the door to a next step?
- Gear 3 TRIAL FIT: Did the rep match the right trial format to the buyer? (Station bag, coach-only sticks, evidence pack, break room box, etc.)
- Gear 4 FEEDBACK LOOP: Did the rep establish a specific follow-up — date, channel, and what they're checking on?

SCORING:
- "clear": Gear was fully achieved with evidence from the conversation.
- "partial": Gear was partially addressed but not fully locked.
- "locked": Gear was not addressed or failed.

OVERALL RATING:
- "qualified": All 4 gears at least partial, at least 2 clear.
- "partial": 2–3 gears addressed.
- "not-qualified": Fewer than 2 gears addressed.

Respond ONLY with a valid JSON object in this exact format:
{
  "gears": [
    { "id": "pain", "label": "Named Pain", "status": "clear|partial|locked", "evidence": "one sentence from the conversation" },
    { "id": "access", "label": "Access", "status": "clear|partial|locked", "evidence": "one sentence from the conversation" },
    { "id": "fit", "label": "Trial Fit", "status": "clear|partial|locked", "evidence": "one sentence from the conversation" },
    { "id": "feedback", "label": "Feedback Loop", "status": "clear|partial|locked", "evidence": "one sentence from the conversation" }
  ],
  "overallRating": "qualified|partial|not-qualified",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "bestLine": "the single best line the rep said",
  "nextStep": "what the rep should say or do next time to improve"
}`;
}

// ─── LLM API Calls ────────────────────────────────────────────────────────────

async function callOpenAI(
  apiKey: string, model: string, messages: { role: string; content: string }[], systemPrompt: string
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.8,
      max_tokens: 300,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || `OpenAI error ${res.status}`);
  }
  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content.trim();
}

async function callAnthropic(
  apiKey: string, model: string, messages: { role: string; content: string }[], systemPrompt: string
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role === 'buyer' ? 'assistant' : 'user', content: m.content })),
      max_tokens: 300,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || `Anthropic error ${res.status}`);
  }
  const data = await res.json() as { content: { text: string }[] };
  return data.content[0].text.trim();
}

async function callGemini(
  apiKey: string, model: string, messages: { role: string; content: string }[], systemPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const contents = messages.map(m => ({
    role: m.role === 'buyer' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || `Gemini error ${res.status}`);
  }
  const data = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] };
  return data.candidates[0].content.parts[0].text.trim();
}

async function callLLM(
  provider: Provider, apiKey: string, model: string,
  messages: { role: string; content: string }[], systemPrompt: string
): Promise<string> {
  if (provider === 'openai') return callOpenAI(apiKey, model, messages, systemPrompt);
  if (provider === 'anthropic') return callAnthropic(apiKey, model, messages, systemPrompt);
  if (provider === 'gemini') return callGemini(apiKey, model, messages, systemPrompt);
  throw new Error('Unknown provider');
}

async function getCoachFeedback(
  provider: Provider, apiKey: string, model: string,
  conversation: Message[]
): Promise<CoachFeedback> {
  const transcript = conversation
    .map(m => `${m.role === 'user' ? 'REP' : 'BUYER'}: ${m.content}`)
    .join('\n');

  const coachMessages = [{ role: 'user', content: `Here is the roleplay transcript:\n\n${transcript}\n\nScore this conversation.` }];
  const raw = await callLLM(provider, apiKey, model, coachMessages, buildCoachSystemPrompt());

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Coach returned invalid JSON');
  return JSON.parse(jsonMatch[0]) as CoachFeedback;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GearBadge({ gear }: { gear: GearScore }) {
  const colors: Record<GearStatus, { bg: string; border: string; text: string; icon: string }> = {
    clear:   { bg: '#E8F5E9', border: '#2E7D32', text: '#2E7D32', icon: '✓' },
    partial: { bg: '#FFF8E1', border: '#B45309', text: '#B45309', icon: '~' },
    locked:  { bg: '#FEECEC', border: '#A82820', text: '#A82820', icon: '✕' },
  };
  const c = colors[gear.status];
  return (
    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: '3px', padding: '8px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '12px', color: c.text }}>{c.icon}</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#1A1D22' }}>
          {gear.label}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: c.text, marginLeft: 'auto', textTransform: 'uppercase' }}>
          {gear.status}
        </span>
      </div>
      {gear.evidence && (
        <div style={{ fontSize: '12px', color: '#4A5159', fontStyle: 'italic', lineHeight: 1.4 }}>
          "{gear.evidence}"
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoleplaySimulator() {
  // Setup state
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedPersona, setSelectedPersona] = useState<typeof PERSONAS[0] | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<typeof SCENARIOS[0] | null>(null);
  const [provider, setProvider] = useState<Provider>('openai');
  const [model, setModel] = useState('gpt-4o-mini');
  const [apiKey, setApiKey] = useState(''); // in-memory only
  const [showKey, setShowKey] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(0);

  // Debrief state
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [debriefLoading, setDebriefLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update model when provider changes
  useEffect(() => {
    const p = PROVIDERS.find(p => p.id === provider);
    if (p) setModel(p.models[0].id);
  }, [provider]);

  const startSession = useCallback(async () => {
    if (!selectedPersona || !selectedScenario || !apiKey.trim()) return;
    setPhase('chat');
    setMessages([]);
    setTurnCount(0);
    setError(null);
    setLoading(true);

    try {
      const systemPrompt = buildBuyerSystemPrompt(selectedPersona, selectedScenario);
      const openingMessages = [{ role: 'user', content: `[The rep has just approached you. React as ${selectedPersona.name} would in a ${selectedScenario.label} scenario. Start the conversation from the buyer's perspective — you can be brief, guarded, or neutral.]` }];
      const opening = await callLLM(provider, apiKey, model, openingMessages, systemPrompt);
      setMessages([{ role: 'buyer', content: opening, ts: Date.now() }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [selectedPersona, selectedScenario, apiKey, provider, model]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading || !selectedPersona || !selectedScenario) return;
    const userMsg: Message = { role: 'user', content: input.trim(), ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const systemPrompt = buildBuyerSystemPrompt(selectedPersona, selectedScenario);
      const apiMessages = newMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
      const reply = await callLLM(provider, apiKey, model, apiMessages, systemPrompt);
      setMessages(prev => [...prev, { role: 'buyer', content: reply, ts: Date.now() }]);
      setTurnCount(prev => prev + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages, selectedPersona, selectedScenario, provider, apiKey, model]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endSession = useCallback(async () => {
    setPhase('debrief');
    setDebriefLoading(true);
    setFeedback(null);
    try {
      const fb = await getCoachFeedback(provider, apiKey, model, messages);
      setFeedback(fb);
    } catch (e) {
      setError(`Coach feedback failed: ${(e as Error).message}`);
    } finally {
      setDebriefLoading(false);
    }
  }, [provider, apiKey, model, messages]);

  const resetAll = () => {
    setPhase('setup');
    setMessages([]);
    setFeedback(null);
    setError(null);
    setTurnCount(0);
    setInput('');
  };

  const currentProvider = PROVIDERS.find(p => p.id === provider)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* Header */}
      <div style={{ background: '#1A1D22', padding: '10px 16px', flexShrink: 0, borderBottom: '2px solid #A82820' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: '#A82820', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1px' }}>
          Roleplay Simulator · Four-Gear Practice
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '20px', color: '#fff', lineHeight: 1.1 }}>
            {phase === 'setup' ? <>Persona <span style={{ color: '#A82820' }}>Selector</span></> :
             phase === 'chat' ? <>{selectedPersona?.avatar} {selectedPersona?.name} <span style={{ color: '#A82820' }}>· {selectedPersona?.role}</span></> :
             <>Coach <span style={{ color: '#A82820' }}>Debrief</span></>}
          </div>
          {phase !== 'setup' && (
            <button onClick={resetAll} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px',
              color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>↺ New</button>
          )}
        </div>
        {phase === 'chat' && (
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
            {selectedScenario?.label} · Turn {turnCount} · {currentProvider.label} / {model}
          </div>
        )}
      </div>

      {/* ── SETUP PHASE ── */}
      {phase === 'setup' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', WebkitOverflowScrolling: 'touch' }}>

          {/* API Key */}
          <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '12px', marginBottom: '12px' }}>
            <div className="os-h2" style={{ marginTop: 0 }}>LLM Provider & API Key</div>
            <p style={{ fontSize: '12px', color: '#4A5159', marginBottom: '10px', lineHeight: 1.5 }}>
              Your key is stored in-memory only and never saved to disk, localStorage, or any server. It disappears when you close the tab.
            </p>
            {/* Provider selector */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setProvider(p.id)} style={{
                  padding: '6px 10px', border: `1.5px solid ${provider === p.id ? '#A82820' : '#C8CCD2'}`,
                  background: provider === p.id ? '#FBF8F1' : 'transparent', borderRadius: '2px',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
                  color: provider === p.id ? '#A82820' : '#4A5159', cursor: 'pointer',
                  transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent',
                }}>{p.label}</button>
              ))}
            </div>
            {/* Model selector */}
            <div style={{ marginBottom: '10px' }}>
              <label className="os-label">Model</label>
              <select value={model} onChange={e => setModel(e.target.value)} style={{
                width: '100%', padding: '8px', border: '1px solid #C8CCD2', background: '#FBF8F1',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', borderRadius: '3px', color: '#1A1D22',
              }}>
                {currentProvider.models.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            {/* API Key input */}
            <div>
              <label className="os-label" htmlFor="api-key">API Key (in-memory only)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={currentProvider.keyHint}
                  style={{
                    width: '100%', padding: '10px 40px 10px 10px', border: '1px solid #C8CCD2',
                    background: '#FBF8F1', fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px', borderRadius: '3px', color: '#1A1D22', boxSizing: 'border-box',
                  }}
                />
                <button onClick={() => setShowKey(s => !s)} style={{
                  position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px',
                }}>
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          {/* Persona selector */}
          <div style={{ marginBottom: '12px' }}>
            <div className="os-h2" style={{ marginTop: 0 }}>Select Buyer Persona</div>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => setSelectedPersona(p)} style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start', width: '100%',
                padding: '10px 12px', marginBottom: '6px',
                border: `1.5px solid ${selectedPersona?.id === p.id ? '#A82820' : '#C8CCD2'}`,
                background: selectedPersona?.id === p.id ? '#FBF8F1' : '#fff',
                borderRadius: '3px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent',
              }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{p.avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: '#1A1D22', lineHeight: 1.2 }}>
                    {p.name} · {p.role}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#A82820', fontWeight: 700, letterSpacing: '0.06em', marginTop: '2px' }}>
                    {p.segmentLabel}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4A5159', marginTop: '3px', lineHeight: 1.4 }}>
                    {p.personality.split('.')[0]}.
                  </div>
                </div>
                {selectedPersona?.id === p.id && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#A82820', flexShrink: 0 }}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Scenario selector */}
          <div style={{ marginBottom: '14px' }}>
            <div className="os-h2" style={{ marginTop: 0 }}>Select Scenario</div>
            {SCENARIOS.map(s => (
              <button key={s.id} onClick={() => setSelectedScenario(s)} style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start', width: '100%',
                padding: '10px 12px', marginBottom: '6px',
                border: `1.5px solid ${selectedScenario?.id === s.id ? '#A82820' : '#C8CCD2'}`,
                background: selectedScenario?.id === s.id ? '#FBF8F1' : '#fff',
                borderRadius: '3px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', color: '#1A1D22' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#4A5159', marginTop: '2px', lineHeight: 1.4 }}>
                    {s.description}
                  </div>
                </div>
                {selectedScenario?.id === s.id && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#A82820', flexShrink: 0 }}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={startSession}
            disabled={!selectedPersona || !selectedScenario || !apiKey.trim()}
            style={{
              width: '100%', padding: '14px', borderRadius: '3px', border: 'none',
              background: (!selectedPersona || !selectedScenario || !apiKey.trim()) ? '#C8CCD2' : '#A82820',
              color: '#fff', fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '17px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.04em', cursor: (!selectedPersona || !selectedScenario || !apiKey.trim()) ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s', minHeight: '52px',
            }}
          >
            {!apiKey.trim() ? 'Enter API Key to Start' :
             !selectedPersona ? 'Select a Persona' :
             !selectedScenario ? 'Select a Scenario' :
             `▶ Start Roleplay with ${selectedPersona.name}`}
          </button>

          {/* Four Gear reminder */}
          <div style={{ background: '#1A1D22', borderRadius: '4px', padding: '12px', marginTop: '14px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820', letterSpacing: '0.08em', marginBottom: '8px' }}>
              FOUR-GEAR QUALIFICATION — WHAT TO HIT
            </div>
            {[
              { gear: 'G1', label: 'Named Pain', desc: 'Uncover a specific, named pain point. Not generic.' },
              { gear: 'G2', label: 'Access', desc: 'Earn the right to a trial. Open the door to a next step.' },
              { gear: 'G3', label: 'Trial Fit', desc: 'Match the right trial format to this buyer and segment.' },
              { gear: 'G4', label: 'Feedback Loop', desc: 'Set a specific follow-up: date, channel, what you\'re checking.' },
            ].map(g => (
              <div key={g.gear} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: g.gear !== 'G4' ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820', minWidth: '22px', paddingTop: '1px' }}>{g.gear}</span>
                <div>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#fff' }}>{g.label}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginLeft: '6px' }}>{g.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAT PHASE ── */}
      {phase === 'chat' && (
        <>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', WebkitOverflowScrolling: 'touch' }}>

            {/* Gear tracker */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[
                { id: 'pain', label: 'G1 Pain' },
                { id: 'access', label: 'G2 Access' },
                { id: 'fit', label: 'G3 Fit' },
                { id: 'feedback', label: 'G4 Loop' },
              ].map(g => (
                <div key={g.id} style={{
                  padding: '3px 8px', background: '#EFEBE0', border: '1px solid #C8CCD2',
                  borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px', fontWeight: 700, color: '#4A5159', textTransform: 'uppercase',
                }}>
                  {g.label}
                </div>
              ))}
              <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4A5159', padding: '3px 0' }}>
                Hit all 4 gears → End Session
              </div>
            </div>

            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: '8px', marginBottom: '10px', alignItems: 'flex-end',
              }}>
                {msg.role === 'buyer' && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', background: '#1A1D22',
                    display: 'grid', placeItems: 'center', fontSize: '16px', flexShrink: 0,
                  }}>
                    {selectedPersona?.avatar}
                  </div>
                )}
                <div style={{
                  maxWidth: '78%', padding: '10px 12px', borderRadius: '4px',
                  background: msg.role === 'user' ? '#A82820' : '#fff',
                  border: msg.role === 'buyer' ? '1px solid #C8CCD2' : 'none',
                  color: msg.role === 'user' ? '#fff' : '#1A1D22',
                  fontSize: '14px', lineHeight: 1.5,
                  fontFamily: "'Source Sans 3', sans-serif",
                }}>
                  {msg.role === 'buyer' && (
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#A82820', marginBottom: '4px', letterSpacing: '0.06em' }}>
                      {selectedPersona?.name?.toUpperCase()} · {selectedPersona?.role?.toUpperCase()}
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1A1D22', display: 'grid', placeItems: 'center', fontSize: '16px' }}>
                  {selectedPersona?.avatar}
                </div>
                <div style={{ padding: '10px 14px', background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%', background: '#A82820',
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: '#FEECEC', border: '1px solid #A82820', borderRadius: '3px', padding: '10px 12px', marginBottom: '10px', fontSize: '13px', color: '#A82820' }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{ background: '#fff', borderTop: '1px solid #C8CCD2', padding: '10px 12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response as the rep... (Enter to send)"
                rows={2}
                disabled={loading}
                style={{
                  flex: 1, padding: '10px', border: '1px solid #C8CCD2', background: '#FBF8F1',
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', borderRadius: '3px',
                  resize: 'none', color: '#1A1D22', lineHeight: 1.5,
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: '10px 14px', background: loading || !input.trim() ? '#C8CCD2' : '#A82820',
                  color: '#fff', border: 'none', borderRadius: '3px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700,
                  transition: 'background 0.15s', flexShrink: 0, minHeight: '52px',
                }}
              >→</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <div style={{ fontSize: '11px', color: '#4A5159' }}>
                Turn {turnCount} · Shift+Enter for new line
              </div>
              <button
                onClick={endSession}
                disabled={messages.length < 4}
                style={{
                  background: 'transparent', border: '1px solid #C8CCD2', borderRadius: '2px',
                  color: messages.length < 4 ? '#C8CCD2' : '#4A5159',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
                  padding: '3px 8px', cursor: messages.length < 4 ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}
              >
                End Session → Debrief
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── DEBRIEF PHASE ── */}
      {phase === 'debrief' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', WebkitOverflowScrolling: 'touch' }}>

          {debriefLoading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '18px', color: '#1A1D22', marginBottom: '8px' }}>
                Coach is reviewing your session...
              </div>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#A82820',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {error && !debriefLoading && (
            <div style={{ background: '#FEECEC', border: '1px solid #A82820', borderRadius: '3px', padding: '12px', marginBottom: '12px', fontSize: '13px', color: '#A82820' }}>
              <strong>Coach feedback failed:</strong> {error}
              <br /><br />
              <button onClick={() => endSession()} style={{ background: '#A82820', color: '#fff', border: 'none', borderRadius: '2px', padding: '6px 12px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700 }}>
                Retry
              </button>
            </div>
          )}

          {feedback && !debriefLoading && (
            <>
              {/* Overall rating */}
              {(() => {
                const ratingCfg = {
                  'qualified':     { label: 'QUALIFIED', color: '#2E7D32', bg: '#E8F5E9', icon: '✓' },
                  'partial':       { label: 'PARTIAL',   color: '#B45309', bg: '#FFF8E1', icon: '~' },
                  'not-qualified': { label: 'NOT QUALIFIED', color: '#A82820', bg: '#FEECEC', icon: '✕' },
                }[feedback.overallRating];
                return (
                  <div style={{ background: ratingCfg.bg, border: `2px solid ${ratingCfg.color}`, borderRadius: '4px', padding: '14px', marginBottom: '14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '28px', color: ratingCfg.color }}>{ratingCfg.icon}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '22px', color: ratingCfg.color, letterSpacing: '0.04em' }}>
                      {ratingCfg.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4A5159', marginTop: '4px' }}>
                      {selectedPersona?.name} · {selectedScenario?.label} · {turnCount} turns
                    </div>
                  </div>
                );
              })()}

              {/* Gear scores */}
              <div style={{ marginBottom: '14px' }}>
                <div className="os-h2" style={{ marginTop: 0 }}>Four-Gear Scorecard</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {feedback.gears.map(gear => (
                    <GearBadge key={gear.id} gear={gear} />
                  ))}
                </div>
              </div>

              {/* Strengths & improvements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                <div style={{ background: '#E8F5E9', border: '1px solid #2E7D32', borderRadius: '3px', padding: '10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: '#2E7D32', letterSpacing: '0.08em', marginBottom: '6px' }}>STRENGTHS</div>
                  {feedback.strengths.map((s, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#1A1D22', lineHeight: 1.5, marginBottom: '3px' }}>✓ {s}</div>
                  ))}
                </div>
                <div style={{ background: '#FEECEC', border: '1px solid #A82820', borderRadius: '3px', padding: '10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: '#A82820', letterSpacing: '0.08em', marginBottom: '6px' }}>IMPROVE</div>
                  {feedback.improvements.map((s, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#1A1D22', lineHeight: 1.5, marginBottom: '3px' }}>→ {s}</div>
                  ))}
                </div>
              </div>

              {/* Best line */}
              {feedback.bestLine && (
                <div style={{ background: '#FBF8F1', border: '1px solid #EFEBE0', borderRadius: '3px', padding: '10px 12px', marginBottom: '10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: '#4A5159', letterSpacing: '0.08em', marginBottom: '4px' }}>BEST LINE</div>
                  <div style={{ fontSize: '14px', color: '#1A1D22', fontStyle: 'italic', lineHeight: 1.5 }}>"{feedback.bestLine}"</div>
                </div>
              )}

              {/* Next step */}
              {feedback.nextStep && (
                <div style={{ background: '#1A1D22', borderRadius: '3px', padding: '10px 12px', marginBottom: '14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: '#A82820', letterSpacing: '0.08em', marginBottom: '4px' }}>COACH NOTE FOR NEXT TIME</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{feedback.nextStep}</div>
                </div>
              )}

              {/* Transcript */}
              <details style={{ marginBottom: '14px' }}>
                <summary style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#4A5159', letterSpacing: '0.06em', cursor: 'pointer', padding: '8px 0', textTransform: 'uppercase' }}>
                  ▼ View Full Transcript
                </summary>
                <div style={{ background: '#1A1D22', borderRadius: '3px', padding: '12px', marginTop: '6px' }}>
                  {messages.map((msg, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: msg.role === 'user' ? '#A82820' : 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
                        {msg.role === 'user' ? 'REP' : selectedPersona?.name?.toUpperCase()}:
                      </span>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginTop: '2px' }}>{msg.content}</div>
                    </div>
                  ))}
                </div>
              </details>

              {/* Retry same / new */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setPhase('chat'); setMessages([]); setTurnCount(0); setFeedback(null); startSession(); }}
                  style={{
                    flex: 1, padding: '12px', background: '#1A1D22', color: '#fff', border: 'none',
                    borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >↺ Retry Same</button>
                <button
                  onClick={resetAll}
                  style={{
                    flex: 1, padding: '12px', background: '#A82820', color: '#fff', border: 'none',
                    borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >+ New Session</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

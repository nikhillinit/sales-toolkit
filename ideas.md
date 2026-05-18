# Design Brainstorm — Restless Field Toolkit

## Design Direction: Unified Signal OS — Field-Ready Industrial Utility

**Chosen Philosophy:** Industrial Utility with Military-Adjacent Precision

### Design Movement
Tactical Operations Interface — inspired by military field manuals, emergency dispatch systems, and industrial control panels. Not a consumer app — a *tool* that feels like it was issued, not downloaded.

### Core Principles
1. **Information density over decoration** — every pixel earns its place; no decorative chrome
2. **Thumb-first ergonomics** — all primary actions in bottom 40% of screen, large tap targets (min 44px)
3. **Status at a glance** — pipeline state, step progress, and key numbers always visible
4. **Monospace credibility** — data, codes, and metrics use JetBrains Mono; prose uses Source Sans 3

### Color Philosophy
Directly from the Unified Signal OS design system:
- `--bg: #F4F1EA` — warm off-white, like field manual paper
- `--brick: #A82820` — the action color; danger, primary CTA, active state
- `--gold: #8A6A14` — section headers, secondary emphasis
- `--green: #2E7D32` — success, complete, clean exit
- `--fg: #1A1D22` — near-black for all body text
- `--surface: #FFFFFF` — card backgrounds
- `--surface2: #EFEBE0` — subtle panel backgrounds

### Layout Paradigm
Mobile-first single-column with a **fixed bottom navigation bar** (5 tabs matching the 5-step OS). Header shows current context + pipeline stats. Content area scrolls freely. No sidebar on mobile — everything lives in the tab structure.

### Signature Elements
1. **Step progress bar** — horizontal 5-step stepper with brick active state and green complete checkmarks
2. **Activation gate** — red STOP / green READY binary status card that blocks shipping until all 8 fields filled
3. **Stat counters** — monospace +/- tappable counters for pipeline metrics

### Interaction Philosophy
- Tap targets minimum 48px height
- Form inputs with large padding for gloved/field use
- Toast notifications for all state changes
- Session draft auto-save with restore/discard prompt
- Claim scanner with live banned-term detection

### Animation
- Step transitions: 200ms ease-out slide
- Toast: 300ms fade in, 2500ms hold, 300ms fade out
- Gate status: 150ms color transition
- Button press: scale(0.97) 100ms

### Typography System
- Display: Barlow Condensed 700 — section titles, status labels, kickers
- Body: Source Sans 3 400/600 — all prose, form labels, descriptions
- Mono: JetBrains Mono 500/700 — codes, stats, metadata, timestamps

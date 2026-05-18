/**
 * build-manual.mjs
 *
 * Reads the canonical field manual from attached_assets/ (clean print artifact),
 * injects the bidirectional bridge script and in-page CTAs, and writes the
 * result to client/public/manual/v4_2.html (served by Vite).
 *
 * Run automatically via package.json "prebuild" and "predev" hooks.
 * Safe to run multiple times — always overwrites the deployed copy.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = resolve(__dir, '..');

const SRC    = resolve(root, 'attached_assets/manual/v4_2.html');
const DEST   = resolve(root, 'client/public/manual/v4_2.html');
const BRIDGE = resolve(__dir, 'manual-bridge.html');

// ── In-page CTAs ──────────────────────────────────────────────────────────────
// Each entry: { marker, cta }
// marker  — unique string already present in the HTML to anchor the injection
// cta     — HTML fragment inserted immediately after the marker
const CTAS = [
  {
    // p19 — Skepticism & Objections
    // Insert after the "Capture" instruction line on p19
    marker: 'Objection code, safe route, whether to trial / evidence / retime / close.',
    cta: `
<div class="app-cta" style="margin:10px 0 4px;display:flex;gap:8px;flex-wrap:wrap;">
  <a data-app-route="/roleplay"
     data-app-context='{"prefill":{"toolSlug":"objections","manualPageId":"p19"}}'
     style="display:inline-block;padding:5px 11px;background:#A82820;color:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;border-radius:3px;text-decoration:none;letter-spacing:.04em;cursor:pointer;">
    ▶ Drill an objection
  </a>
  <a data-app-route="/scanner"
     data-app-context='{"prefill":{"manualPageId":"p19"}}'
     style="display:inline-block;padding:5px 11px;background:#1A1D22;color:#F4F1EA;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;border-radius:3px;text-decoration:none;letter-spacing:.04em;cursor:pointer;">
    ⚑ Check a claim
  </a>
</div>`,
  },
  {
    // p16 — Story Vault
    marker: 'Capture</span>New buyer phrase, real use window, and what risk the story reduced.</div></div>',
    cta: `
<div class="app-cta" style="margin:10px 0 4px;">
  <a data-app-route="/story"
     data-app-context='{"prefill":{"manualPageId":"p16"}}'
     style="display:inline-block;padding:5px 11px;background:#A82820;color:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;border-radius:3px;text-decoration:none;letter-spacing:.04em;cursor:pointer;">
    + Add a story
  </a>
</div>`,
  },
  {
    // p07 — Network Discipline
    marker: 'A 5-day rhythm with one gear per day',
    cta: `
<div class="app-cta" style="margin:10px 0 4px;">
  <a data-app-route="/network"
     data-app-context='{"prefill":{"manualPageId":"p07"}}'
     style="display:inline-block;padding:5px 11px;background:#A82820;color:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;border-radius:3px;text-decoration:none;letter-spacing:.04em;cursor:pointer;">
    → Log a contact
  </a>
</div>`,
  },
  {
    // p14 — Field Entry / Start Here
    marker: 'Move only when each gear shows an observable signal.',
    cta: `
<div class="app-cta" style="margin:10px 0 4px;">
  <a data-app-route="/os/activate"
     data-app-context='{"prefill":{"manualPageId":"p14"}}'
     style="display:inline-block;padding:5px 11px;background:#A82820;color:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;border-radius:3px;text-decoration:none;letter-spacing:.04em;cursor:pointer;">
    → Start activation
  </a>
</div>`,
  },
];

async function build() {
  let html = await readFile(SRC, 'utf8');

  // Remove any previously-injected bridge (idempotent)
  html = html.replace(/<!-- Restless bidirectional bridge[\s\S]*?<\/script>\s*/g, '');

  // Inject CTAs
  for (const { marker, cta } of CTAS) {
    if (html.includes(marker)) {
      html = html.replace(marker, marker + cta);
    } else {
      console.warn(`[build-manual] CTA marker not found: "${marker.slice(0, 60)}…"`);
    }
  }

  // Inject bridge before </body>
  const bridge = await readFile(BRIDGE, 'utf8');
  html = html.replace('</body>', bridge + '\n</body>');

  await mkdir(dirname(DEST), { recursive: true });
  await writeFile(DEST, html, 'utf8');
  console.log(`[build-manual] Built ${DEST}`);
}

build().catch(err => { console.error(err); process.exit(1); });

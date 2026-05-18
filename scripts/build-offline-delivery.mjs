/**
 * build-offline-delivery.mjs
 *
 * Compiles the canonical Restless Field Manual HTML into a single-file offline
 * app-delivery artifact. The final HTML contains:
 * - the manual markup and print layout
 * - inline JSON app state (with buildHash for version tracking)
 * - inline FieldKit runtime (search, claim check, objections, activation, export)
 * - no external font/CDN references
 *
 * This is intentionally separate from build-manual.mjs (hosted/iframe bridge).
 * This script creates the file a rep can open from a laptop with no network.
 *
 * Outputs:
 *   client/public/offline/Restless_FieldKit_Offline_v4.2.html  (download link from hosted app)
 *   dist/offline/Restless_FieldKit_Offline_v4.2.html           (delivery artifact)
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const SRC = resolve(root, 'attached_assets/manual/v4_2.html');
const STATE = resolve(root, 'attached_assets/app-state/restless-fieldkit-state.json');
const RUNTIME = resolve(__dir, 'offline-runtime.html');

const DEST_PUBLIC = resolve(root, 'client/public/offline/Restless_FieldKit_Offline_v4.2.html');
const DEST_DIST = resolve(root, 'dist/offline/Restless_FieldKit_Offline_v4.2.html');

/** Strip Google Fonts preconnect/link tags — the offline file must not depend on CDN */
function stripExternalDependencies(html) {
  return html
    .replace(/\s*<link[^>]+href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*\/?>(\s*)/gi, '$1')
    .replace(/\s*<link[^>]+href="https:\/\/fonts\.gstatic\.com[^"]*"[^>]*\/?>(\s*)/gi, '$1')
    .replace(/\s*<link[^>]+rel="preconnect"[^>]+href="https:\/\/fonts\.[^"]+"[^>]*\/?>(\s*)/gi, '$1');
}

/** Prevent </script> inside JSON from breaking the enclosing script tag */
function escapeScriptJson(json) {
  return json.replace(/<\/script>/gi, '<\\/script>');
}

async function writeBoth(file, html) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  console.log(`[offline] wrote ${file} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
}

async function build() {
  console.log('[offline] Building offline delivery artifact...');

  let html = await readFile(SRC, 'utf8');
  html = stripExternalDependencies(html);

  const stateJson = await readFile(STATE, 'utf8');
  const runtime = await readFile(RUNTIME, 'utf8');

  const payload = `
<!-- FieldKit Offline Runtime — injected by build-offline-delivery.mjs -->
<script id="restless-fieldkit-state" type="application/json">${escapeScriptJson(stateJson)}</script>
${runtime}
<!-- /FieldKit Offline Runtime -->
`;

  const out = html.includes('</body>')
    ? html.replace('</body>', `${payload}</body>`)
    : `${html}${payload}`;

  await writeBoth(DEST_PUBLIC, out);
  await writeBoth(DEST_DIST, out);

  console.log('[offline] Done.');
}

build().catch(err => { console.error('[offline] Build failed:', err); process.exit(1); });

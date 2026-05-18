# Offline Delivery Process

## Architecture

The Restless FieldKit has two delivery modes:

| Mode | Entry point | Network required | Build script |
|------|-------------|-----------------|--------------|
| **Hosted** | `sales-toolkit.replit.app` | Yes | `build-manual.mjs` |
| **PWA** | `sales-toolkit.replit.app/offline` (Add to Home Screen) | First load only | `build-offline-delivery.mjs` |
| **Standalone HTML** | `Restless_FieldKit_Offline_v4.2.html` (email / Slack / AirDrop) | No | `build-offline-delivery.mjs` |

The offline artifact is a single HTML file that contains:

1. The full 30-page Field Manual (print-ready, 17×11 landscape)
2. Inline JSON app state (tools, claims, objections, activation standard)
3. Inline FieldKit runtime (search, claim check, objection matrix, activation, export)
4. Zero external dependencies (no CDN fonts, no API calls, no network)

## File Layout

```
attached_assets/
  manual/v4_2.html                          ← canonical source (never edited by scripts)
  app-state/restless-fieldkit-state.json    ← compiled app state (tools, claims, objections)

scripts/
  build-offline-delivery.mjs                ← build script
  offline-runtime.html                      ← style + JS fragment injected at build time
  build-manual.mjs                          ← hosted/iframe bridge (separate concern)

client/public/offline/
  Restless_FieldKit_Offline_v4.2.html       ← served by hosted app as download link

dist/offline/
  Restless_FieldKit_Offline_v4.2.html       ← the delivery artifact
```

## How to Build

```bash
pnpm build:offline
```

Or build both hosted manual and offline artifact:

```bash
pnpm build:manual:all
```

## How to Distribute

1. Run `pnpm build:offline`
2. The artifact is at `dist/offline/Restless_FieldKit_Offline_v4.2.html`
3. Send via email, Slack, AirDrop, USB, Google Drive — any channel
4. The recipient opens the file in any modern browser
5. They click the **FieldKit Offline** button (bottom-right corner)
6. The side panel opens with 5 tools: Manual search, Claim Check, Objections, Activation, Export

## How It Works for the Rep

- **Manual search** — full-text search across all 30 pages and 15 tools. Click a result to scroll the manual to that page.
- **Claim Check** — paste any pitch copy. The scanner runs HC-01 through HC-05 regex rules and banned-term detection entirely client-side. Nothing leaves the machine.
- **Objection Matrix** — searchable OBJ-01 through OBJ-08 with buyer-says, decode, safe route, and bridge. Copy bridge phrase to clipboard.
- **Activation Standard** — the 8-field "no blanks, no ship" form. Saves to localStorage. Export before switching devices.
- **Export** — download local state as JSON. Reset. View build hash to confirm version.

## Upgrading to Hosted

When the rep has network access, the Export tab shows an "Open full Restless FieldKit (online)" link that opens the hosted app at `sales-toolkit.replit.app`. This link only appears when `navigator.onLine` is true.

## Cloud sync (no JSON files required)

The Export tab also generates a **Sync to Cloud CRM** link. The button URL-encodes the rep's saved activations (base64url over UTF-8) into a query string that targets `https://sales-toolkit.replit.app/api/sync?payload=…`.

Workflow:

1. Rep logs an activation while offline.
2. When network returns, they tap **Sync to Cloud CRM ↗** (or **Copy sync link** if they want to paste it elsewhere — e.g. Notes, Slack, email-to-self).
3. The live app's `/api/sync` route (React page `client/src/pages/SyncImport.tsx`) decodes the payload, shows a review screen, and imports the activations as Trials into IndexedDB on confirm.

Constraints handled in the runtime:

- Payload is trimmed (oldest first) to stay under ~6KB encoded so iOS Safari doesn't drop the URL.
- If the payload is too large to fit, the rep is told to use the JSON download instead.
- The link decodes UTF-8 cleanly (so non-Latin characters in capture fields don't break `btoa`).

## Add to Home Screen (PWA path)

The blueprint's "real" fix for the file:// storage trap: instruct reps to load `https://sales-toolkit.replit.app/offline` on their iPad and tap **Add to Home Screen**. Because the page is now installed under the `https://` origin (not `file://`), Safari preserves IndexedDB and localStorage permanently.

Server wiring:

- `server/index.ts` registers `/offline` and `/offline/` to send the offline HTML before the SPA fallback.
- `vite.config.ts` mirrors the same alias for `pnpm dev`.
- The PWA service worker precaches the offline HTML (it matches the `**/*.html` glob).
- `/offline` and `/api/*` are added to `navigateFallbackDenylist` so the SW never substitutes the SPA shell for them.

## postMessage origin allowlist

The scroll bridge inside the manual (`attached_assets/manual/v4_2.html` and `scripts/manual-bridge.html`) now accepts messages from `window.location.origin` **or** `https://sales-toolkit.replit.app`. The hosted iframe still defaults to same-origin embedding; the allowlist exists so a cross-origin embed (e.g. a future white-labeled lane) doesn't silently break. Outbound messages from the bridge use `'*'` as the targetOrigin because the parent's origin isn't known until it talks first; the payload only contains a pageId/route string.

## Updating the State

When the manual or app data changes:

1. Update `attached_assets/app-state/restless-fieldkit-state.json` with new data
2. Run `pnpm build:offline`
3. The `buildHash` field in the state JSON changes automatically — reps can compare their version in the Export tab

## Design Decisions

- **`window.self === window.top` is NOT used as a guard** — the offline runtime always injects because the file is designed to be opened standalone. The hosted build uses `build-manual.mjs` (a separate script) which injects the iframe bridge instead.
- **`@media print` hides the panel** — the manual stays a clean print artifact even with the runtime present.
- **localStorage, with in-memory fallback** — simpler than IndexedDB, no async, works on `file://`. A startup probe writes/reads a sentinel; if it fails (private browsing, locked profile) the runtime silently demotes to a per-session in-memory store and surfaces a yellow warning banner on the Activation and Export tabs telling the rep their data won't survive tab close.
- **`file://` detection** — `location.protocol === 'file:'` triggers the same banner because WebKit clears localStorage on tab close for local files. The banner points reps at `/offline` + Add to Home Screen as the durable fix.
- **No service worker inside the standalone HTML** — the file is already offline. The hosted PWA at `/offline` is what gives the rep persistent storage; the standalone HTML stays scriptless beyond the inline runtime.
- **Escape key closes the panel** — standard UX pattern for slide-out panels.

# Offline Delivery Process

## Architecture

The Restless FieldKit has two delivery modes:

| Mode | Entry point | Network required | Build script |
|------|-------------|-----------------|--------------|
| **Hosted** | `sales-toolkit-nikhillinit.replit.app` | Yes | `build-manual.mjs` |
| **Offline** | `Restless_FieldKit_Offline_v4.2.html` | No | `build-offline-delivery.mjs` |

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

When the rep has network access, the Export tab shows an "Open full Restless FieldKit (online)" link that opens the hosted app. This link only appears when `navigator.onLine` is true.

## Updating the State

When the manual or app data changes:

1. Update `attached_assets/app-state/restless-fieldkit-state.json` with new data
2. Run `pnpm build:offline`
3. The `buildHash` field in the state JSON changes automatically — reps can compare their version in the Export tab

## Design Decisions

- **`window.self === window.top` is NOT used as a guard** — the offline runtime always injects because the file is designed to be opened standalone. The hosted build uses `build-manual.mjs` (a separate script) which injects the iframe bridge instead.
- **`@media print` hides the panel** — the manual stays a clean print artifact even with the runtime present.
- **localStorage, not IndexedDB** — simpler, no async, works in every browser including file:// protocol.
- **No service worker** — the file is already offline. A SW would add complexity with no benefit.
- **Escape key closes the panel** — standard UX pattern for slide-out panels.

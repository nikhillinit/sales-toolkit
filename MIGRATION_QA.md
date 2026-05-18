# Migration QA

## Acceptance Criteria

- [ ] Migration never overwrites non-empty IDB values
- [ ] Migration status is written per slice to `fieldkit:v1:migrationStatus`
- [ ] App boots if migration fails (degraded mode, no crash)
- [ ] `usePersistentState` flushes on `visibilitychange` (hidden) and `pagehide`
- [ ] `idbUpdate` is used for all array read-modify-write operations
- [ ] `broadcastSliceUpdate` is the only call site for slice-updated events
- [ ] Legacy localStorage/sessionStorage keys are NOT deleted in first release

## Slice Migration Map

| Legacy Key | IDB Key |
|---|---|
| `restless_story_vault_v01` | `fieldkit:v1:storyVault` |
| `restless_lane_selector_v01` | `fieldkit:v1:laneSelector` |
| `restless_network_logs_v01` | `fieldkit:v1:networkLogs` |
| `restless_session_draft_v06` → formDraft | `fieldkit:v1:formDraft` |
| `restless_session_draft_v06` → trials | `fieldkit:v1:trials` |
| `restless_session_draft_v06` → stats | `fieldkit:v1:stats` |
| `restless_session_draft_v06` → uiProgress | `fieldkit:v1:uiProgress` |

## Notes

- The `restless_session_draft_v06` key stores a single AppStateData object.
  Migration reads it once and writes each sub-slice independently.
- `migrateIfEmpty` skips if the IDB target already has data.
- Migration status is observable in Settings → Storage panel.

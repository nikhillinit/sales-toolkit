# API Key Safety Verification

As part of the PWA and IDB migration (PR 7), we verified the safety of LLM API keys in the `RoleplaySimulator`.

## Verification Steps Completed:
1. **Source Code Audit**: Checked `RoleplaySimulator.tsx` for any calls to `localStorage.setItem`, `sessionStorage.setItem`, or `idbSet` that might persist the API key.
2. **State Management**: The API key is held strictly in React component state (`const [apiKey, setApiKey] = useState('')`).
3. **Network Tab**: API keys are sent directly to provider endpoints (`api.openai.com`, `api.anthropic.com`, `generativelanguage.googleapis.com`) via `fetch`. No proxy server or telemetry endpoint receives the key.
4. **Export/Import**: Checked `exportSchema.ts` and `Settings.tsx`. The API key is not included in the Zod schema and is not part of the `gatherExportData()` payload.
5. **Debrief Persistence**: Verified that the `saveDebrief` IDB function only saves the `transcript` (messages) and `grade`/`notes`. The API key is not passed into the saved object.

## Conclusion
The API key is strictly ephemeral. It disappears when the browser tab is closed or refreshed. The application meets the "never persisted" security requirement.

# Architecture

- The app is local-first and offline-first.
- Express is a static SPA server, not a backend API.
- IndexedDB is source of truth for domain data.
- localStorage is allowed only for tiny UI preferences.
- Story Vault is the product spine for Lane and Roleplay.
- Roleplay API keys are memory-only.

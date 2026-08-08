# Mock API layer

The backend (Phase 5) is being built module by module and doesn't yet cover every
endpoint the frontend needs. Rather than blocking frontend pages on backend
progress, `VITE_ENABLE_MOCKS=true` (the default in `.env.example`) serves
responses from here instead of a live server.

- `fixtures.js` — data, shaped exactly like the real MongoDB documents from Phase 2.
- `handlers.js` — MSW request handlers, one per endpoint, returning the same
  `{ success, statusCode, message, data, meta }` envelope the real backend's
  `ApiResponse` class produces (see `server/src/utils/ApiResponse.js`).

**To switch to a live backend once a module is built:** set `VITE_ENABLE_MOCKS=false`
and point `VITE_API_BASE_URL` at the running server. No component or hook code
changes — every data-fetching hook in `src/api/` calls the same axios instance
either way.

New handlers are added here incrementally, in lockstep with each page that's built.

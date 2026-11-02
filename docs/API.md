# API

All application routes use `/api/v1` and return `{ "success": true, "data": ... }`. Errors use `{ "success": false, "error": { "code": ..., "message": ... } }`.

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Liveness check (`{ "status": "ok" }`) |
| POST | `/api/v1/cases` | Create an asynchronous case job; accepts `prompt`, `genre`, `difficulty`, optional `title`; accepts `Idempotency-Key` |
| GET | `/api/v1/cases` | List current browser session's cases; `page`, `limit` pagination |
| GET | `/api/v1/cases/:caseId/status` | Read generation status |
| GET | `/api/v1/cases/:caseId` | Read public case information |
| GET | `/api/v1/cases/:caseId/evidence/:evidenceId` | Read one public evidence item |
| POST | `/api/v1/cases/:caseId/accusations` | Submit one final `{ "suspectId": "..." }` |
| GET | `/api/v1/cases/:caseId/result` | Read result after a final accusation |
| POST | `/api/v1/cases/:caseId/retry` | Retry a failed generation, at most twice |

The API issues an HttpOnly `amr_session` cookie. Mutating requests must come from the configured `CLIENT_URL`; cross-origin requests are restricted by CORS and origin validation. Case IDs alone do not grant access. Solution data is stored in a separate collection and is only serialized after an accepted accusation.

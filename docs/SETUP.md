# Setup

## Requirements

- Node.js 20 or newer and npm.
- MongoDB running locally or a reachable MongoDB deployment.
- A Google Gemini API key for live case generation.

## Install and configure

1. Copy `.env.example` to `server/.env` (or the repository root `.env`; the server loads either location).
2. Set `MONGODB_URI`, `SESSION_SECRET` (at least 32 characters), and `GEMINI_API_KEY`.
3. Set `GEMINI_MODEL` to a model available to your Gemini account. The default is configurable.
4. Install dependencies with `npm install` at the root, then `npm install --prefix server` and `npm install --prefix client`.
5. Start both services with `npm run dev`.
6. Open `http://localhost:5000`; the API listens on `http://localhost:5001`.

`GEMINI_API_KEY` is only read by the server. MongoDB and the Gemini key are required for a functioning case-generation flow. If the key is missing, case creation returns a recoverable generation failure that can be retried after configuration. No fake production case is substituted.

## Commands

- `npm run dev` starts the API and Vite development server.
- `npm run build` builds the frontend.
- `npm test` runs backend game-rule and serialization tests.
- `npm start` starts the API after configuration and database checks.

For a production frontend deployment, set `VITE_API_BASE_URL` at build time and configure `CLIENT_URL` to its exact origin. Deploy the API behind HTTPS; secure cookies are enabled in production. Configure MongoDB backups, monitoring, and a persistent object store before enabling generated media.

## Anonymous saves and retention

Cases are tied to a random, HttpOnly browser cookie. Clearing browser cookies loses access; this is not a cross-device account system. Cases expire after `CASE_RETENTION_DAYS` using a MongoDB TTL index. Media-provider settings currently use the deterministic illustrative fallback; local media storage is not implemented as a production asset store.

## Environment variables

See `.env.example`. Required values are `MONGODB_URI` and `SESSION_SECRET`; `GEMINI_API_KEY` is required for live generation. `CLIENT_URL`, model name, timeout, retry ceiling, case retention, rate limit, and anonymous session lifetime are configurable. Never use `VITE_*` names for secrets.

# AI Mystery Room

An interactive detective experience: turn an original fictional scenario into a case file, examine suspects and evidence, then make one final accusation and reveal the solution.

## Stack

- React, Vite, React Router, Lucide, responsive CSS
- Node.js, Express, MongoDB/Mongoose, Zod
- Google Gemini via the official server-side SDK
- Anonymous browser-session case ownership; solutions stored separately from public cases

## Get started

See [docs/SETUP.md](docs/SETUP.md) for prerequisites, environment setup, install instructions, and run commands. The product and engineering requirements are in [spec.md](spec.md).

```sh
npm install
```

Copy `.env.example` to `server/.env`, configure MongoDB, a 32-character session secret, and a Gemini API key, then run:

```sh
npm run dev
```

Website: `http://localhost:5000` · API: `http://localhost:5001`

## Verification

```sh
npm test
npm run build
```

AI generation requires a live Gemini key and MongoDB connection. Cases use the labeled illustrative media fallback when optional media services are unavailable; no fake video playback or fabricated media URLs are shown.

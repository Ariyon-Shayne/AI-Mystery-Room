# Implementation decisions

- The repository started with only `spec.md`; the project uses the spec's suggested client/server structure.
- Anonymous ownership uses a random HttpOnly cookie token and stores only its SHA-256 hash on cases. `SameSite=Lax`, origin checking on API mutations, and explicit credentialed CORS are used for cookie/CSRF defense in this same-site deployment.
- Solutions are stored in a separate MongoDB collection. Public case serialization is an allowlist projection.
- Generation runs asynchronously in the API process for the MVP and polls persisted case status. A durable queue/worker is deferred; deploy a single API process or move this job to a durable worker before horizontally scaling.
- The official Gemini SDK is used with a configurable model and bounded schema-validation retries. No deterministic fixture is silently substituted when Gemini is unavailable.
- Media integration is an abstraction boundary in the schema and UI; this MVP uses labeled programmatic evidence illustrations and CCTV frame descriptions. It does not generate or claim to play video/image assets. Production object storage and a provider adapter remain a deployment extension.
- The acceptance target for generation counts follows difficulty guidance, while validation enforces the universal minimum (3 suspects, 6 evidence) and referential/logical structure.
- Cases expire through a MongoDB TTL index after `CASE_RETENTION_DAYS`; anonymous access is browser-session-bound, not account-based.

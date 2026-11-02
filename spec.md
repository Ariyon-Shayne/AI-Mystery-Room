# AI MYSTERY ROOM
## Master Specification for Spec-Driven Development

**Document:** `SPEC.md`  
**Version:** 1.0.0  
**Status:** Initial implementation specification  
**Product type:** AI-powered interactive mystery investigation website  
**Frontend:** React + Vite  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**AI provider:** Google Gemini API  
**Architecture:** MERN stack  
**Primary development agent:** OpenAI Codex

---

# 1. PURPOSE OF THIS DOCUMENT

This document is the single source of truth for the AI Mystery Room application.

Codex must use this specification to implement the application, make technical decisions, create files, design APIs, define database models, integrate AI, and validate the final result.

## 1.1 Rules for Codex

1. Read this document completely before making implementation changes.
2. Inspect the existing repository before creating, replacing, or deleting files.
3. Treat this specification as the authoritative product and technical requirement.
4. Do not invent additional product features without a clear need or approval.
5. Use environment variables for credentials and configuration.
6. Never expose the Gemini API key to the browser.
7. Never send the correct culprit, private answer key, or hidden solution to the frontend before the player submits a final accusation.
8. Do not use hardcoded investigation data as the primary production generation mechanism.
9. Provide graceful fallbacks for unavailable AI models and media-generation services.
10. Do not silently replace a real feature with a nonfunctional placeholder.
11. Implement features in small, verifiable phases.
12. Run available tests and fix errors before marking a phase complete.
13. Keep API contracts, database schemas, and this document synchronized.
14. Document all deviations from this specification in `docs/DECISIONS.md`.
15. Never claim that an integration or feature works unless it has been implemented and tested.

If a requirement is ambiguous, choose the simplest secure implementation consistent with this document and record the decision.

---

# 2. PRODUCT OVERVIEW

## 2.1 Product vision

AI Mystery Room is an interactive detective game in which users transform their own short stories, scenarios, or ideas into AI-generated mystery investigations.

The application generates a fictional crime or mystery, establishes a culprit and a consistent underlying truth, and creates a collection of evidence for the player to investigate.

The player examines evidence, compares statements, identifies contradictions, develops a theory, and selects the person they believe is responsible.

The application then evaluates the accusation and explains the solution using evidence from the investigation.

## 2.2 Core user journey

1. The user opens the website.
2. The user enters a short scenario or story prompt.
3. The user configures the mystery's difficulty, genre, and optional settings.
4. The backend validates the request and generates a complete fictional investigation using Gemini.
5. The system creates suspects, a timeline, evidence, and a hidden answer key.
6. The user enters an interactive investigation room.
7. The user explores the case overview, suspect profiles, evidence, and timeline.
8. The user selects a suspect as the culprit.
9. The user submits the accusation.
10. The backend evaluates the answer.
11. The website reveals whether the accusation was correct and presents the explanation.
12. The user can start a new investigation or revisit the completed case.

## 2.3 Target users

- Casual players who enjoy detective stories.
- Mystery and puzzle enthusiasts.
- Users who want to create personalized detective challenges.
- Groups who want to solve fictional cases together by sharing a case.

## 2.4 Product principles

- Every generated mystery must have a logically consistent solution.
- Every mystery must have exactly one designated culprit in version 1.
- The solution must be supported by the generated evidence.
- Evidence must not contradict the canonical truth unless the contradiction is intentional and explained.
- Players must be able to solve cases without relying on information that was never provided.
- AI-generated investigations must be fictional and clearly labeled as such.
- The application must work on desktop and mobile browsers.
- Core gameplay must remain usable when optional image or video generation is unavailable.

---

# 3. MVP SCOPE

## 3.1 Required features

### User-facing features

- Landing page.
- Scenario prompt form.
- Difficulty selection.
- Genre selection.
- Mystery generation loading screen.
- Investigation room.
- Case overview.
- Suspect directory.
- Suspect profiles.
- Evidence board.
- WhatsApp-style fictional conversations.
- AI-generated or programmatically composed evidence images.
- Camera-recording evidence represented as a playable clip or reconstructed CCTV sequence.
- Investigation timeline.
- Culprit selection.
- Final accusation confirmation.
- Correct/incorrect result screen.
- Explanation of the solution.
- Restart or create-another-case action.
- Save and reopen investigations.
- Responsive layout.
- Clear loading, error, empty, and retry states.

### Technical features

- React frontend.
- Express REST API.
- MongoDB persistence.
- Gemini-powered structured mystery generation.
- Server-side validation.
- Strict separation of public case data and hidden solution data.
- Media-generation abstraction.
- AI response validation.
- Rate limiting.
- Error handling and logging.
- Automated tests for important game rules.

## 3.2 Optional features for later releases

Do not implement these before the MVP works end to end.

- User registration and authentication.
- Public case marketplace.
- Community-created scenarios.
- Leaderboards.
- Multiplayer real-time investigations.
- AI detective assistant with hints.
- Achievement system.
- Case ratings and comments.
- Subscription plans.
- Realistic generated video and audio.
- Mobile application.

## 3.3 Explicit exclusions

Version 1 is a fictional mystery game.

It must not:
- Access a user's actual WhatsApp messages.
- Record a user's camera or microphone.
- Impersonate real people in fabricated evidence.
- Present fictional evidence as authentic proof of a real crime.
- Execute code generated by Gemini.
- Allow Gemini to execute arbitrary database operations.
- Expose hidden answers through public API responses.

---

# 4. TECHNOLOGY STACK

Use the following stack unless an existing repository imposes a justified constraint.

## 4.1 Frontend

- React.
- Vite.
- JavaScript with JSX, or TypeScript if the repository already uses it.
- React Router for navigation.
- Tailwind CSS for styling.
- Lucide React for icons.
- Fetch or Axios for HTTP requests.
- A lightweight state-management solution, preferably React Context and hooks for the MVP.

Do not introduce Redux unless the application genuinely requires it.

## 4.2 Backend

- Node.js.
- Express.js.
- MongoDB.
- Mongoose.
- Official Google Gen AI SDK for Gemini integration.
- Zod for request and AI-output validation.
- Helmet for security headers.
- CORS with explicit allowed origins.
- Express rate limiting.
- Pino or an equivalent structured logger.

Use asynchronous route handlers and centralized error handling.

## 4.3 AI

Use Gemini for:
- Converting user prompts into structured case plans.
- Generating the canonical mystery and answer key.
- Creating suspect biographies and statements.
- Generating evidence content.
- Generating timelines and clue explanations.
- Producing the final explanation of the solution.

The exact Gemini model must be configurable through environment variables. Do not hardcode an obsolete model identifier throughout the codebase.

## 4.4 Media

Implement a media-provider abstraction for:
- Image generation.
- Evidence image storage.
- CCTV-style video or frame sequences.
- Video playback.

Important: Gemini text generation does not automatically mean the application has image or video generation capability. Use a compatible image or video generation provider only when its API, model, and credentials are available.

If media generation is not configured:
- Generate a convincing WhatsApp-style interface using structured text.
- Generate CCTV-style scenes using programmatic compositions, diagrams, or clearly labeled illustrative images.
- Use multiple timestamped still frames to represent a CCTV sequence.
- Display a clear fallback state instead of broken images or fake playable videos.

The application must not describe a static image as an actual video recording.

---

# 5. APPLICATION ARCHITECTURE

Use a client-server architecture.

    Browser
       |
       v
    React + Vite
       |
       | HTTPS / REST / JSON
       v
    Express API
       |
       +---- Request validation
       |
       +---- Case generation service
       |          |
       |          +---- Gemini provider
       |          +---- Output validation
       |          +---- Consistency validation
       |
       +---- Evidence/media service
       |
       +---- Game and scoring service
       |
       +---- MongoDB / Mongoose

The frontend must never call Gemini directly.

All Gemini interactions must pass through backend services.

## 5.1 Recommended directory structure

    ai-mystery-room/
    ├── client/
    │   ├── public/
    │   └── src/
    │       ├── api/
    │       ├── assets/
    │       ├── components/
    │       │   ├── common/
    │       │   ├── evidence/
    │       │   ├── investigation/
    │       │   └── suspects/
    │       ├── hooks/
    │       ├── layouts/
    │       ├── pages/
    │       ├── context/
    │       ├── utils/
    │       ├── App.jsx
    │       └── main.jsx
    ├── server/
    │   └── src/
    │       ├── config/
    │       ├── controllers/
    │       ├── middleware/
    │       ├── models/
    │       ├── routes/
    │       ├── services/
    │       │   ├── ai/
    │       │   ├── cases/
    │       │   ├── evidence/
    │       │   └── scoring/
    │       ├── validators/
    │       ├── utils/
    │       ├── app.js
    │       └── server.js
    ├── tests/
    ├── docs/
    │   ├── API.md
    │   ├── DECISIONS.md
    │   └── SETUP.md
    ├── .env.example
    ├── .gitignore
    ├── package.json
    └── SPEC.md

Adapt this layout if the repository already has an established structure. Do not duplicate existing modules unnecessarily.

---

# 6. USER INTERFACE AND DESIGN SYSTEM

## 6.1 Visual direction

Create a premium detective-investigation interface.

The visual language should combine:
- A dark investigation-room aesthetic.
- Charcoal and near-black backgrounds.
- Muted neutral surfaces.
- Amber or warm yellow highlights.
- Off-white text.
- Subtle borders.
- Clear typography.
- Evidence-card layouts.
- Investigation-board motifs.
- Restrained animations.

Avoid excessive neon, clutter, and generic AI-dashboard styling.

Use high contrast and maintain readable text.

## 6.2 Shared layout

Desktop:
- Sidebar navigation for case sections.
- Central content area.
- Optional right-side details panel.
- Consistent top bar with case title and status.

Mobile:
- Compact top bar.
- Responsive evidence cards.
- Collapsible navigation or bottom navigation.
- Full-width suspect and evidence details.
- Touch-friendly controls.

Do not require horizontal scrolling for normal mobile gameplay.

## 6.3 Required routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/create` | Create a mystery |
| `/cases` | List saved cases |
| `/cases/:caseId` | Investigation room |
| `/cases/:caseId/result` | Solution and accusation result |
| `*` | Not-found page |

Authentication is not required in the MVP. Saved cases may be stored locally in a browser-generated anonymous session, with server-side ownership enforced through an anonymous session identifier.

Do not treat a case ID alone as proof of ownership.

## 6.4 Landing page

Display:
- Product name: AI Mystery Room.
- Tagline: "Every clue tells a story. Every suspect hides something."
- Brief product description.
- Primary CTA: "Create a Mystery".
- Secondary CTA: "Explore Your Cases".
- A preview of the investigation experience.
- A sample fictional case.
- A visible fictional-content disclaimer.

The sample case must not expose the answer to any active user-generated investigation.

## 6.5 Mystery creation page

Fields:

**Scenario prompt**
- Required.
- Minimum 30 characters.
- Maximum 1,500 characters.
- Multiline text area.
- Character counter.
- Example prompt placeholder.

**Genre**
- Murder mystery.
- Theft.
- Disappearance.
- Corporate espionage.
- Digital mystery.
- Suspicious incident.
- Other fictional mystery.

**Difficulty**
- Easy.
- Medium.
- Hard.

**Optional case title**
- Maximum 80 characters.
- If omitted, generate a title.

**Estimated play time**
- Display an estimate based on evidence count.
- Do not promise exact completion times.

**Create button**
- Disabled while submitting.
- Shows generation progress.
- Prevents duplicate submissions.

The backend must independently validate all form inputs.

## 6.6 Investigation room

The investigation room is the primary gameplay interface.

Required sections:

1. Case overview.
2. Suspects.
3. Evidence.
4. Timeline.
5. Final accusation.

### Case overview

Display:
- Case title.
- Fictional case description.
- Incident location.
- Incident date and time.
- Investigation status.
- Objective.
- Number of suspects.
- Number of evidence items.
- Progress indicator.

Do not reveal the culprit or answer key.

### Suspects

Each suspect card contains:
- Name.
- Fictional profile image or avatar.
- Role in the story.
- Short biography.
- Relationship to the incident.
- Publicly known motive.
- Alibi or public statement.

A suspect's public information may contain misleading statements, but the case must remain logically solvable.

### Evidence

Each evidence item must include:
- Unique ID.
- Title.
- Evidence type.
- Description.
- Content or media.
- Timestamp where applicable.
- Source.
- Related suspects.
- Relevant case events.

Allow the player to:
- Open an evidence detail view.
- Zoom or inspect images when supported.
- Read conversation messages.
- Play available media.
- View evidence timestamps.
- Return to the evidence list.

### Timeline

Display the events in chronological order.

The timeline must not contain hidden events unavailable to the player unless explicitly labeled as unknown or unresolved.

### Final accusation

Display all eligible suspects.

The player must:
1. Select one suspect.
2. Review the selected suspect.
3. Confirm the final accusation.
4. Submit it.

The accusation is final for that attempt in version 1. If retries are later supported, they must be explicitly designed and tested.

---

# 7. MYSTERY GENERATION ENGINE

This is the most important backend subsystem.

## 7.1 Generation pipeline

Implement the following sequence:

1. Validate the incoming prompt.
2. Normalize the genre and difficulty.
3. Create a case-generation record.
4. Build a structured generation request.
5. Ask Gemini to create the canonical mystery.
6. Parse the structured response.
7. Validate the response against the case schema.
8. Validate the mystery's logical consistency.
9. Retry a limited number of times if necessary.
10. Generate or compose evidence assets.
11. Save the canonical case and answer key securely.
12. Save the public case separately or expose it through a dedicated projection.
13. Mark generation complete.
14. Return only the public case representation.

Use a maximum of two regeneration attempts after the initial generation. If the model repeatedly fails validation, return a controlled error and allow the user to retry.

Set timeouts and token limits appropriate to the selected model.

## 7.2 Case-generation requirements

Every generated case must contain:

- A unique case identifier.
- A title.
- A fictional premise.
- An incident description.
- An incident location.
- An incident timestamp.
- Three to five suspects.
- One designated culprit.
- A motive.
- A sequence of events.
- A canonical timeline.
- At least six evidence items.
- At least two meaningful clues.
- At least one misleading but explainable clue.
- Suspect statements.
- A complete answer key.
- A solution explanation.
- A mapping between decisive clues and the answer key.

Difficulty targets:

**Easy**
- 3 suspects.
- 6–8 evidence items.
- At least 3 direct clues.
- Contradictions are relatively easy to recognize.

**Medium**
- 4 suspects.
- 8–10 evidence items.
- Multiple clues must be combined.
- At least one plausible alternative suspect.

**Hard**
- 5 suspects.
- 10–12 evidence items.
- More indirect clues.
- Multiple timelines, statements, or relationships must be compared.

These are targets, not permission to produce inconsistent cases. Logical solvability takes priority over exact counts.

## 7.3 Canonical truth

Gemini must establish the truth of the incident before constructing the evidence.

The canonical truth must include:
- Who committed the incident.
- Why it happened.
- How it happened.
- When it happened.
- Where it happened.
- What each suspect actually did.
- What each suspect knows.
- What each suspect falsely claims, if applicable.
- What evidence supports or contradicts each claim.

Evidence must be generated from this established truth.

Do not independently generate arbitrary evidence and then choose a culprit afterward.

## 7.4 Logical consistency checks

The validation service must check:
- Exactly one culprit ID exists.
- The culprit belongs to the suspect list.
- Every suspect ID is unique.
- Every evidence ID is unique.
- Every referenced suspect exists.
- Every evidence timestamp is valid.
- The incident timeline is chronologically coherent.
- The culprit has a plausible motive and opportunity.
- Decisive clues support the intended solution.
- The public evidence does not make every suspect equally plausible without resolution.
- The explanation references evidence that actually exists.
- No required decisive evidence is missing from the public case.
- No hidden answer appears in public descriptions, filenames, URLs, or metadata.

If a case fails these checks, regenerate or reject it.

Do not rely on a prompt instruction alone to guarantee consistency.

## 7.5 Structured AI output

Use Gemini's supported structured-output or JSON mode where available. Validate the resulting object with Zod.

Illustrative internal structure:

    {
      "title": "The Missing Prototype",
      "genre": "corporate-espionage",
      "difficulty": "medium",
      "premise": "A prototype disappears...",
      "incident": {
        "type": "theft",
        "location": "Research laboratory",
        "occurredAt": "2026-10-20T18:30:00Z"
      },
      "suspects": [],
      "timeline": [],
      "evidence": [],
      "solution": {
        "culpritId": "suspect_02",
        "motive": "Financial pressure",
        "method": "Accessed a storage room...",
        "explanation": "...",
        "decisiveEvidenceIds": [
          "evidence_03",
          "evidence_06"
        ]
      }
    }

This is an illustrative internal schema, not a complete case and not a frontend response.

Never assume model output is valid merely because it resembles JSON.

## 7.6 Fictional WhatsApp evidence

Represent conversations as structured message arrays.

Each conversation should include:
- Conversation title.
- Fictional participants.
- Timestamps.
- Sender IDs.
- Message text.
- Optional attachment references.
- Evidence provenance.
- Related suspects.

Render the conversation using a familiar messaging layout, but label it "Fictional evidence" or "AI-generated conversation".

Do not create evidence by accessing actual WhatsApp accounts or messages.

## 7.7 Image evidence

Image evidence may include:
- Room photographs.
- Objects found at the scene.
- Documents.
- Security-camera stills.
- Illustrative location images.

Every image must be associated with a case and evidence record.

Validate image types and sizes before storage. Use object storage in production, and avoid storing large binary assets directly in MongoDB.

If an image-generation provider is unavailable, generate a programmatic illustration or display a labeled placeholder.

Do not make up a media URL and present it as a successfully generated asset.

## 7.8 CCTV evidence

CCTV evidence must have an explicit representation type:

- `video`: a real generated or stored video asset.
- `frame-sequence`: multiple timestamped still images.
- `illustration`: a static illustrative scene.

Store:
- Clip title.
- Capture timestamp.
- Camera location.
- Duration, if applicable.
- Representation type.
- Asset references.
- Visible events.
- Evidence description.

If only still images are available, show them as a timestamped CCTV sequence. Never render a fake play button that implies an unavailable video can be played.

## 7.9 Media-generation architecture

Create a provider interface so the implementation can support different providers later.

Suggested methods:

- `generateImage(input)`
- `generateVideo(input)` where supported.
- `getAsset(assetId)`
- `deleteAsset(assetId)` where supported.

The case-generation service must not depend on a single vendor's proprietary response structure.

Use a configurable media provider and a deterministic fallback mode.

---

# 8. BACKEND DATA MODELS

Use Mongoose models. Add timestamps and indexes where appropriate.

## 8.1 Case

Fields:

- `_id`
- `title`
- `prompt`
- `genre`
- `difficulty`
- `status`: `generating`, `ready`, `failed`
- `premise`
- `incident`
- `suspects`
- `timeline`
- `evidence`
- `answerKey`
- `generationMetadata`
- `ownerSessionHash`
- `createdAt`
- `updatedAt`
- `expiresAt`, optional

`answerKey` must never be included in public case responses.

Prefer storing it in a separate internal solution document with a one-to-one relationship to the case. If stored on the same document, enforce strict server-side projections and response serializers.

Do not rely only on frontend code to hide secret fields.

## 8.2 Suspect

Embedded within a case or stored as a related document.

Fields:

- `id`
- `name`
- `role`
- `biography`
- `motiveSummary`
- `publicAlibi`
- `avatarAssetId`, optional
- `statement`
- `displayOrder`

The public suspect object must contain no private guilt flags or hidden answer fields.

## 8.3 Evidence

Fields:

- `id`
- `title`
- `type`: `chat`, `image`, `document`, `cctv`, `statement`, `physical`
- `description`
- `content`
- `source`
- `timestamp`
- `relatedSuspectIds`
- `assetIds`
- `clueCategory`
- `displayOrder`

`clueCategory` may be stored internally, but public responses must not expose labels that reveal the solution. Use public-safe metadata.

## 8.4 Timeline event

Fields:

- `id`
- `timestamp`
- `title`
- `description`
- `relatedSuspectIds`
- `relatedEvidenceIds`
- `visibility`

Visibility values:
- `public`
- `hidden`

Hidden events must never appear in the public timeline before the solution is revealed.

## 8.5 Solution

Private fields:
- `caseId`
- `culpritId`
- `motive`
- `method`
- `canonicalTimeline`
- `suspectTruths`
- `decisiveEvidenceIds`
- `misleadingEvidenceIds`
- `explanation`
- `createdAt`

This model is internal to backend services.

## 8.6 Accusation

Fields:
- `_id`
- `caseId`
- `ownerSessionHash`
- `selectedSuspectId`
- `isCorrect`
- `submittedAt`
- `resultExplanation`

Enforce the one-final-attempt rule through server-side logic and database constraints where practical.

Never accept `isCorrect` or `resultExplanation` from the frontend.

## 8.7 MediaAsset

Fields:
- `assetId`
- `caseId`
- `evidenceId`
- `mediaType`
- `representationType`
- `storageProvider`
- `storageKey`
- `mimeType`
- `sizeBytes`
- `status`
- `createdAt`

Only allow media references belonging to the relevant case.

## 8.8 Anonymous ownership

For the MVP, generate a cryptographically random anonymous session token.

- Store a hash of the token on the server.
- Deliver the raw token through a secure cookie.
- Set `HttpOnly`.
- Use `Secure` in production.
- Configure `SameSite` according to the deployment architecture.
- Use an appropriate expiration.
- Never use a user-provided case ID as authorization.

Implement CSRF protection or an equivalent defense appropriate to the cookie-based authentication design.

Document that anonymous case access is tied to the browser session and is not an account-based cross-device save system.

---

# 9. API CONTRACT

Prefix all application endpoints with `/api/v1`.

Return JSON responses consistently.

Success response convention:

    {
      "success": true,
      "data": {}
    }

Error response convention:

    {
      "success": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "The request is invalid."
      }
    }

Never include stack traces, secrets, hidden answers, or provider credentials in public errors.

## 9.1 Health

### GET `/health`

Purpose:
- Check application availability.

Response:

    {
      "status": "ok"
    }

Do not expose API keys, database credentials, or internal infrastructure details.

## 9.2 Create case

### POST `/api/v1/cases`

Request:

    {
      "prompt": "A valuable prototype disappears from a locked lab...",
      "genre": "corporate-espionage",
      "difficulty": "medium",
      "title": null
    }

Response:
- Return `202 Accepted` if generation is asynchronous.
- Return `201 Created` if the full case is generated synchronously.

For a responsive MVP, prefer asynchronous generation with polling.

Response:

    {
      "success": true,
      "data": {
        "caseId": "case_id",
        "status": "generating"
      }
    }

Rules:
- Validate request fields.
- Apply rate limits.
- Enforce prompt length.
- Create the generation job.
- Do not accept a client-supplied culprit.
- Do not accept a client-supplied answer key.
- Prevent duplicate submission through an idempotency key or equivalent mechanism.

## 9.3 Check generation status

### GET `/api/v1/cases/:caseId/status`

Response:

    {
      "success": true,
      "data": {
        "caseId": "case_id",
        "status": "ready"
      }
    }

Allowed statuses:
- `generating`
- `ready`
- `failed`

Return only public-safe error information if generation fails.

## 9.4 Get case details

### GET `/api/v1/cases/:caseId`

Return:
- Case title.
- Public premise.
- Incident details.
- Suspects.
- Public timeline.
- Public evidence.
- Asset references.
- Progress information where appropriate.

Never return the solution or canonical answer key.

## 9.5 List saved cases

### GET `/api/v1/cases`

Return cases accessible to the current anonymous session.

Support pagination.

Do not return cases belonging to other sessions.

## 9.6 Get evidence details

### GET `/api/v1/cases/:caseId/evidence/:evidenceId`

Return the requested public evidence item if the case belongs to the current session and is ready.

Reject invalid evidence IDs and cross-case asset access.

## 9.7 Submit accusation

### POST `/api/v1/cases/:caseId/accusations`

Request:

    {
      "suspectId": "suspect_02"
    }

Backend behavior:
1. Verify case ownership.
2. Verify case readiness.
3. Verify suspect membership.
4. Check that no final accusation already exists.
5. Load the private solution.
6. Evaluate the selected suspect.
7. Save the result.
8. Return the result and permitted solution explanation.

Response:

    {
      "success": true,
      "data": {
        "selectedSuspectId": "suspect_02",
        "isCorrect": true,
        "result": "correct",
        "solution": {
          "culpritId": "suspect_02",
          "motive": "...",
          "method": "...",
          "explanation": "...",
          "decisiveEvidenceIds": [
            "evidence_03",
            "evidence_06"
          ]
        }
      }
    }

The solution object is returned only after a valid final accusation has been accepted.

Enforce one final accusation per case and session. Prevent concurrent requests from creating multiple final submissions.

## 9.8 Get result

### GET `/api/v1/cases/:caseId/result`

Return the final result only if an accusation has been submitted.

Before submission:
- Return an appropriate conflict or forbidden response.
- Do not expose the correct suspect.

## 9.9 Retry failed generation

### POST `/api/v1/cases/:caseId/retry`

Allow only the owner of a failed case to retry within the configured retry limit.

Do not allow unlimited retries that could incur uncontrolled API costs.

---

# 10. GEMINI INTEGRATION

## 10.1 Provider module

Create a dedicated Gemini provider service.

Responsibilities:
- Initialize the official SDK.
- Read configuration from environment variables.
- Build prompts.
- Call the configured model.
- Parse structured output.
- Handle rate limits.
- Handle timeouts.
- Retry transient errors within a fixed limit.
- Return validated internal objects.

Do not place Gemini calls inside React components or route handlers.

## 10.2 Prompt design

Use separate prompt templates for:
- Case planning.
- Canonical truth generation.
- Evidence generation.
- Consistency repair.
- Final solution explanation.

Every generation prompt must instruct the model to:
- Create an entirely fictional investigation.
- Follow the requested genre and difficulty.
- Generate unique identifiers.
- Maintain chronological consistency.
- Ensure exactly one culprit.
- Generate enough public evidence to solve the case.
- Make misleading clues explainable.
- Avoid revealing the answer in public fields.
- Return the required schema without extra commentary.

Treat the user prompt as untrusted input. It must not override system-level requirements, reveal hidden prompts, request secrets, or change backend security rules.

## 10.3 Cost and latency controls

- Use configurable model names.
- Limit input and output token budgets.
- Limit generation retries.
- Limit concurrent jobs.
- Apply per-session and per-IP rate limits.
- Cache only where correctness and privacy permit.
- Track provider usage metadata when available.
- Do not store chain-of-thought or hidden model reasoning.
- Store concise explanations and structured facts instead.

Do not add an expensive image or video-generation call for every evidence item by default. Generate media selectively and support fallbacks.

## 10.4 AI reliability

AI-generated content is untrusted data.

Validate all AI responses before persistence.

Never:
- Execute AI-generated JavaScript.
- Execute AI-generated shell commands.
- Interpret generated strings as database queries.
- Render unescaped generated HTML.
- Use generated URLs as unrestricted server-side fetch targets.

Use safe rendering and sanitization where applicable.

---

# 11. SECURITY REQUIREMENTS

Security is part of the MVP, not a later enhancement.

## 11.1 Secrets

Required credentials must exist only in backend environment variables.

Never commit `.env`.

Never place Gemini credentials in Vite client-side variables.

Do not log API keys or full authorization tokens.

## 11.2 Request validation

Validate:
- Prompt length.
- Genre.
- Difficulty.
- Case IDs.
- Evidence IDs.
- Suspect IDs.
- Pagination parameters.
- Accusation request bodies.
- Upload size and MIME type, if uploads are introduced.

Reject unexpected fields where practical.

## 11.3 API security

Implement:
- Helmet.
- Explicit CORS allowlist.
- Rate limiting.
- Request size limits.
- Centralized error handling.
- MongoDB query validation.
- Ownership verification.
- CSRF defense for cookie-based sessions.
- Secure production cookies.
- Safe logging.
- Database connection timeouts.

## 11.4 Content security

All investigations and evidence must be labeled fictional.

Reject or safely transform prompts requesting real-world personal data, actual private messages, or evidence intended to deceive people about real events.

Keep the game focused on fictional characters and scenarios.

## 11.5 Data lifecycle

- Set a documented retention period for anonymous cases.
- Add cleanup for expired records and media.
- Delete related media when deleting a case.
- Avoid collecting unnecessary personal data.
- Provide clear errors if a case has expired.

---

# 12. FRONTEND STATE AND GAME RULES

## 12.1 Case lifecycle

    draft
      |
      v
    generating
      |
      +----> failed
      |
      v
    ready
      |
      v
    accused
      |
      +----> correct result
      |
      +----> incorrect result

Persist authoritative state on the backend.

The browser may maintain temporary UI state, but it must not control the actual case status or answer evaluation.

## 12.2 Generation loading screen

Display progress stages such as:
- Analyzing your scenario.
- Building the mystery.
- Creating suspects.
- Preparing evidence.
- Checking consistency.
- Finalizing the case.

These are illustrative progress messages. Do not display fabricated percentage completion unless actual progress is available.

Poll the status endpoint with a bounded interval and stop polling when generation completes or fails.

## 12.3 Evidence interactions

- Opening evidence must not reveal hidden answers.
- Evidence must remain available when navigating between sections.
- The selected suspect must be visually identifiable.
- Final submission must require confirmation.
- A submitted accusation must not be changed through frontend manipulation.
- Refreshing the page must restore the appropriate case state.

## 12.4 Error states

Handle:
- Network failure.
- Gemini timeout.
- Invalid AI response.
- Database unavailable.
- Case generation failure.
- Missing case.
- Expired session.
- Invalid suspect selection.
- Duplicate accusation.
- Missing media.
- Unsupported media format.

Every failure state must provide a useful recovery action where possible.

---

# 13. ENVIRONMENT CONFIGURATION

Create `.env.example` with documented placeholders.

Backend:

    NODE_ENV=development
    PORT=5000
    CLIENT_URL=http://localhost:5173
    MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
    GEMINI_API_KEY=
    GEMINI_MODEL=
    SESSION_SECRET=
    SESSION_TTL_DAYS=30
    CASE_RETENTION_DAYS=30
    AI_TIMEOUT_MS=60000
    AI_MAX_RETRIES=2
    RATE_LIMIT_WINDOW_MS=900000
    RATE_LIMIT_MAX_REQUESTS=20
    MEDIA_PROVIDER=placeholder
    MEDIA_STORAGE_PROVIDER=local

Frontend:

    VITE_API_BASE_URL=http://localhost:5000/api/v1

Important configuration rules:

- `GEMINI_API_KEY` is mandatory for live AI generation.
- `GEMINI_MODEL` must be set to a currently supported model.
- `MONGODB_URI` is mandatory.
- `SESSION_SECRET` must be a cryptographically secure random value.
- Media-provider credentials are optional when placeholder mode is used.
- Never commit real credentials.
- Never put secrets in `VITE_*` variables.
- Local file storage is for development only.
- Production deployment must use persistent or object storage for generated media.
- Validate required environment variables during backend startup.
- Fail fast with a clear configuration error if mandatory settings are missing.

Document how to create and configure each variable in `docs/SETUP.md`.

---

# 14. TESTING STRATEGY

## 14.1 Unit tests

Test:
- Prompt validation.
- Difficulty normalization.
- AI output schema validation.
- Case consistency checks.
- Suspect reference validation.
- Evidence reference validation.
- Timeline ordering.
- Culprit membership.
- Accusation scoring.
- Ownership checks.
- Public response serialization.
- Solution redaction.

## 14.2 Integration tests

Test:
- Database persistence.
- Case creation.
- Generation status polling.
- Case retrieval.
- Evidence retrieval.
- Saved-case listing.
- Final accusation.
- Duplicate accusation rejection.
- Cross-session access rejection.
- Failed generation recovery.
- Provider timeout handling.

Use a mocked Gemini provider for deterministic automated tests. Do not require a live paid Gemini call for every test run.

## 14.3 Frontend tests

Test:
- Form validation.
- Loading state.
- Error state.
- Suspect selection.
- Evidence display.
- Confirmation dialog.
- Result screen.
- Refreshing a case.
- Mobile layout behavior where practical.

## 14.4 End-to-end tests

At minimum, verify this entire journey:

1. Open the landing page.
2. Enter a fictional scenario.
3. Select medium difficulty.
4. Create a mystery.
5. Wait for generation.
6. Open the case.
7. Inspect suspects.
8. Open multiple evidence items.
9. Review the timeline.
10. Select a suspect.
11. Submit the accusation.
12. Verify the result.
13. Verify that the solution explanation references valid evidence.
14. Reload the result page and verify persistence.

## 14.5 Security tests

Explicitly test that:
- The correct culprit is absent from pre-accusation API responses.
- The answer key cannot be fetched through an undocumented route.
- Another anonymous session cannot access a private case.
- An invalid suspect ID cannot be submitted.
- A second final accusation is rejected.
- Generated HTML is not executed.
- API errors do not leak secrets.
- Rate limits apply to case generation.

---

# 15. ACCEPTANCE CRITERIA

The MVP is complete only when all mandatory criteria pass.

### Product

- [ ] A user can enter a custom scenario.
- [ ] Genre and difficulty selections work.
- [ ] A case is generated from the supplied scenario.
- [ ] Each successful case contains three to five suspects.
- [ ] Each successful case contains at least six evidence items.
- [ ] Each case has exactly one designated culprit.
- [ ] Evidence is linked to relevant suspects and events.
- [ ] The case can be investigated without exposing the answer.
- [ ] A user can submit one final accusation.
- [ ] The backend evaluates the accusation.
- [ ] The solution and decisive evidence are revealed afterward.
- [ ] Cases can be revisited by their owner.
- [ ] The interface works on desktop and mobile.
- [ ] All major loading and error states are implemented.

### AI

- [ ] Gemini is called from the backend.
- [ ] AI output is schema-validated.
- [ ] Inconsistent cases are rejected or regenerated.
- [ ] Retry counts are bounded.
- [ ] The application handles model errors gracefully.
- [ ] The case remains playable when optional media generation is unavailable.

### Security

- [ ] Gemini API credentials are never exposed to the browser.
- [ ] Hidden solutions are never returned before accusation.
- [ ] Case ownership is enforced.
- [ ] Duplicate accusations are rejected.
- [ ] User input is validated.
- [ ] Rate limiting is configured.
- [ ] No real user messages or recordings are accessed.

### Engineering

- [ ] The frontend and backend start using documented commands.
- [ ] `.env.example` is complete.
- [ ] MongoDB models and indexes are defined.
- [ ] API endpoints follow the documented contracts.
- [ ] Automated tests cover core game rules.
- [ ] No critical console errors or unhandled promise rejections remain.
- [ ] The setup and deployment documentation is complete.

---

# 16. IMPLEMENTATION PLAN FOR CODEX

Implement in the following order. Do not attempt to build every feature in one uncontrolled pass.

## Phase 1: Repository and foundation

- Inspect the repository.
- Create or adapt the MERN structure.
- Configure package scripts.
- Configure environment variables.
- Connect MongoDB.
- Add Express middleware.
- Add a health endpoint.
- Create a minimal responsive React shell.

**Exit condition:** Frontend and backend run locally, and MongoDB connectivity is verified.

## Phase 2: Domain models and API

- Implement Mongoose models.
- Implement request validation.
- Implement case ownership.
- Implement public response serializers.
- Implement case and evidence routes.
- Implement centralized error handling.

**Exit condition:** Core API endpoints work with test fixtures, and hidden solution data is protected.

## Phase 3: Gemini case generation

- Implement the Gemini provider.
- Implement structured prompts.
- Implement Zod schemas.
- Implement consistency validation.
- Implement generation status tracking.
- Implement retry and failure handling.

**Exit condition:** A custom prompt produces a persisted, schema-valid case through the real Gemini integration.

## Phase 4: Investigation interface

- Build the landing page.
- Build the creation form.
- Build the generation screen.
- Build the case overview.
- Build suspect profiles.
- Build evidence cards and detail views.
- Build the timeline.

**Exit condition:** A user can investigate a generated case without seeing the solution.

## Phase 5: Accusation and solution

- Implement suspect selection.
- Implement final confirmation.
- Implement server-side evaluation.
- Implement result persistence.
- Implement the solution explanation.
- Implement result-page refresh behavior.

**Exit condition:** The complete gameplay journey works from prompt to final result.

## Phase 6: Media and polish

- Implement the media-provider interface.
- Implement structured chat rendering.
- Implement image evidence.
- Implement CCTV video or frame-sequence support.
- Implement graceful fallbacks.
- Refine responsive design and accessibility.

**Exit condition:** Evidence renders correctly even when optional media services are unavailable.

## Phase 7: Testing and deployment

- Run unit tests.
- Run integration tests.
- Run end-to-end tests.
- Verify answer-key isolation.
- Verify session ownership.
- Verify rate limits.
- Document deployment.
- Validate production environment configuration.

**Exit condition:** All mandatory acceptance criteria pass, and the application can be deployed using documented instructions.

---

# 17. DEFINITION OF DONE

A feature is not complete merely because its UI exists.

Every feature must have:
1. Implemented behavior.
2. Backend validation where applicable.
3. Error handling.
4. Tests appropriate to its risk.
5. Responsive presentation.
6. Updated documentation where necessary.

For every completed phase, Codex must report:
- Files created or modified.
- Features implemented.
- Tests executed.
- Test results.
- Known limitations.
- Configuration still required.
- Any deviations from `SPEC.md`.

Do not mark a feature complete if it uses a nonfunctional placeholder for its core behavior.

---

# 18. FINAL PRODUCT REQUIREMENT

The finished product must let a user transform an original scenario into a coherent, interactive, AI-generated mystery investigation, examine fictional evidence, identify a culprit, and receive a justified solution.

The most important quality metric is not the quantity of AI-generated content. It is whether the mystery is engaging, internally consistent, fair to solve, technically secure, and enjoyable to investigate.

**This specification governs the MVP. Update `SPEC.md` before changing core product behavior, API contracts, data models, or game rules.**
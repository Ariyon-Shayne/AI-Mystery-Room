# 🕵️ AI Mystery Room

**Every clue tells a story. Every suspect hides something.**

AI Mystery Room turns a user's idea, short story, or scenario into an interactive detective investigation. Powered by **Google Gemini** and built with the **MERN stack**, it creates a fictional case with suspects, timelines, and evidence for the player to examine before making a final accusation.

> **The challenge:** Don't just read the mystery. Investigate it, connect the clues, challenge the alibis, and find the culprit.

---

## ✨ What is AI Mystery Room?

AI Mystery Room is an AI-powered mystery investigation experience. Instead of playing a fixed detective story, users provide their own scenario and let the AI turn it into a case.

A generated investigation can include:

- A fictional incident and case background.
- A set of suspects, each with a profile, motive, and statement.
- Evidence such as chat conversations, documents, photographs, and CCTV-style material.
- A timeline that helps players reconstruct what happened.
- A hidden solution identifying the culprit and explaining the decisive clues.

The player explores the available evidence, compares statements, identifies inconsistencies, and selects the person they believe is responsible. The solution is revealed after the accusation is submitted.

All cases and evidence are fictional and intended for entertainment.

## 🎮 How It Works

1. **Create a scenario** — Enter a short story, incident, or idea that you want to investigate.
2. **Choose the mystery** — Select a genre and difficulty level.
3. **Generate the case** — Gemini helps create the investigation, suspects, evidence, and underlying solution.
4. **Investigate** — Explore suspect profiles, inspect evidence, and reconstruct the timeline.
5. **Connect the clues** — Compare alibis, messages, timestamps, and other details.
6. **Make an accusation** — Select the suspect you believe is responsible and submit your decision.
7. **Discover the truth** — Review the outcome and the explanation behind the mystery.

## 🚀 Key Features

- **Scenario-based mystery creation** — Start with an idea of your own instead of choosing only from predefined stories.
- **AI-powered case generation** — Use Gemini to turn a prompt into a structured fictional investigation.
- **Multiple mystery genres** — Murder mystery, theft, disappearance, corporate espionage, digital mystery, suspicious incident, and more.
- **Adjustable difficulty** — Easy, Medium, and Hard investigation experiences.
- **Interactive suspect profiles** — Review character backgrounds, motives, relationships, and statements.
- **Evidence investigation** — Examine fictional conversations, images, documents, and CCTV-style evidence when supported by the configured media implementation.
- **Investigation timeline** — Compare events and timestamps to reconstruct the incident.
- **Culprit selection** — Make a final accusation based on the evidence.
- **Solution reveal** — Understand the outcome and the clues that support it.
- **Responsive experience** — Designed for investigation on desktop and mobile screens.

*Media availability depends on the providers and capabilities configured in the application. A CCTV-style sequence of still frames is not the same as a generated video.*

## 🧠 AI and Mystery Generation

Gemini is used by the backend to help generate structured mystery content. A strong investigation needs more than a dramatic story: the clues, timeline, suspect statements, and final explanation must fit together.

The intended generation flow is:

```text
User Scenario
     │
     ▼
Backend Validation
     │
     ▼
Gemini Case Generation
     │
     ▼
Structured Output Validation
     │
     ▼
Mystery and Evidence Preparation
     │
     ▼
Investigation Room
     │
     ▼
Player's Final Accusation
     │
     ▼
Answer Evaluation and Solution Reveal
```

The solution should remain private on the backend until the player submits an accusation. AI-generated output should be validated before it is stored or displayed.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Google Gemini API |
| API style | REST |
| Language | JavaScript (or TypeScript, if configured in the repository) |

## 🏗️ Project Structure

The project follows a client-server structure. The exact folders may evolve as development progresses.

```text
ai-mystery-room/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       └── utils/
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
│       └── utils/
├── docs/
├── .env.example
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run the application locally. The commands below assume the frontend and backend are separate npm projects with development scripts configured in their respective `package.json` files.

### Prerequisites

Make sure you have:

- [Node.js](https://nodejs.org/) and npm installed.
- A running [MongoDB](https://www.mongodb.com/) instance or MongoDB Atlas connection string.
- A [Google AI Studio](https://aistudio.google.com/) API key with access to a supported Gemini model.
- Git installed.

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

Replace the placeholders with your GitHub username and repository name.

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model

SESSION_SECRET=replace_with_a_long_random_secret
SESSION_TTL_DAYS=30
CASE_RETENTION_DAYS=30

AI_TIMEOUT_MS=60000
AI_MAX_RETRIES=2

MEDIA_PROVIDER=placeholder
MEDIA_STORAGE_PROVIDER=local
```

Use a Gemini model identifier currently supported by your Google AI configuration. Do not commit your `.env` file or share API credentials.

Start the backend:

```bash
npm run dev
```

### 3. Configure the frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal (usually `http://localhost:5173`).

> **Note:** If your repository uses different package scripts, ports, or environment variable names, follow the actual `package.json` and configuration files in the project.

## 🔐 Environment Variable Notes

| Variable | Purpose |
|---|---|
| `PORT` | Express server port |
| `CLIENT_URL` | Allowed frontend origin for local development |
| `MONGODB_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Server-side Gemini API credential |
| `GEMINI_MODEL` | Configured Gemini model identifier |
| `SESSION_SECRET` | Secret used for session-related security |
| `AI_TIMEOUT_MS` | AI request timeout |
| `AI_MAX_RETRIES` | Maximum configured AI retry count |
| `MEDIA_PROVIDER` | Selected media generation provider or fallback mode |
| `VITE_API_BASE_URL` | Backend API base URL used by the frontend |

**Important:** Never expose `GEMINI_API_KEY` through a `VITE_*` variable. Frontend environment variables are included in the client bundle and must not contain secrets.

## 🔒 Security and Responsible Use

- Keep Gemini API credentials on the backend.
- Validate user input and AI-generated structured data.
- Keep the answer key out of public case responses until the accusation is submitted.
- Verify case ownership before returning private case data or accepting an accusation.
- Apply request limits to protect the API and control generation costs.
- Treat generated messages, images, and documents as fictional evidence.
- Do not access real WhatsApp accounts, private conversations, cameras, or microphones.
- Do not present AI-generated material as authentic evidence of a real event.

## 🧪 Testing

Run the test commands defined in the relevant `package.json` files. Important test areas include:

- Scenario and request validation.
- Gemini response parsing and schema validation.
- Mystery consistency and suspect/evidence references.
- Public response serialization and answer-key protection.
- Case ownership and access control.
- Accusation evaluation and duplicate-submission handling.
- Frontend investigation and result flows.

Use mocked AI responses for deterministic automated tests. Live Gemini calls should be reserved for integration checks where needed.

## 🗺️ Development Roadmap

The following are potential development milestones; check the current repository to see which are already complete.

- [ ] Complete the scenario-to-case generation flow.
- [ ] Validate mystery logic and evidence consistency.
- [ ] Build the full suspect and evidence investigation experience.
- [ ] Add reliable timeline reconstruction.
- [ ] Implement secure final accusation and solution reveal.
- [ ] Add image and video-generation providers where available.
- [ ] Add comprehensive unit, integration, and end-to-end tests.
- [ ] Add deployment configuration and production monitoring.
- [ ] Explore optional multiplayer, hints, and user accounts.

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make focused changes and add or update tests.
4. Run the relevant checks locally.
5. Open a pull request with a clear summary of the change.

For substantial changes, discuss the proposed behavior before implementing it so the product and technical requirements remain consistent.

## 📄 License

A license has not been specified in this README. Add a `LICENSE` file before presenting the repository as open source, and choose a license that matches how you want others to use the project.

## 🙌 Acknowledgements

- [Google Gemini](https://ai.google.dev/) for AI-powered content generation.
- [MongoDB](https://www.mongodb.com/) for document storage.
- [React](https://react.dev/), [Node.js](https://nodejs.org/), and [Express](https://expressjs.com/) for the application stack.

---

<p align="center">
  <strong>Think like a detective. Question every clue. Find the truth.</strong>
</p>

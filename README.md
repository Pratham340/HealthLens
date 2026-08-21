# Claimlight

Claimlight is a mobile-first, source-linked health-claim research prototype. It uses the OpenAI Responses API with web search to create a structured dossier for each submitted claim. It is designed to explain evidence and uncertainty, not to provide medical advice.

## Run locally

1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
4. Run `npm start` and open `http://localhost:3000`.

The API key stays on the server. `store: false` is used for each API request. The app does not persist submitted claims.

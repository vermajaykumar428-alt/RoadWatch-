# Deployment

## Local Demo

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example .env
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Frontend:

```bash
cd frontend
npm install
npm.cmd run dev -- --host 0.0.0.0 --port 5173
```

Open http://localhost:5173.

## Docker Compose

```bash
docker-compose up --build
```

Set `GEMINI_API_KEY` in your shell or local `.env` before starting.

## Cloud Demo Path

Recommended split deployment:

- Frontend: Vercel or Netlify.
- Backend: Render, Railway, or Cloud Run.

Backend environment variables:

- `GEMINI_API_KEY`: required.

Frontend environment variables:

- `VITE_API_URL`: deployed backend URL.

## Readiness Checks

- `GET /health` should return `status: "ready"`.
- `gemini_configured` must be `true` before showing the AI assistant to judges.
- Frontend build should pass with `npm.cmd run build`.

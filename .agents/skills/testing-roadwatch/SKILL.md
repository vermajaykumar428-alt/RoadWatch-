---
name: testing-roadwatch
description: Run and E2E-test the RoadWatch app (React/Vite frontend + FastAPI backend). Use when verifying RoadWatch UI/API changes or its local setup/build.
---

# Testing RoadWatch end-to-end

RoadWatch is a 2-part app: `frontend/` (React 18 + Vite + react-leaflet, TypeScript) and `backend/` (FastAPI). The MVP uses bundled sample data — no database setup is required to run or test.

## Run locally

Backend (terminal 1):
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload      # http://localhost:8000 , docs at /docs
```
IMPORTANT: run uvicorn from inside `backend/` — `main.py` does `from routes.roads import ...`, so `import main` only resolves when the backend dir is the working dir / on sys.path.

Frontend (terminal 2):
```
cd frontend
npm install
npm run dev                    # http://localhost:5173
```
Build check: `cd frontend && npm run build` (runs `tsc && vite build`); type-only check: `npx tsc --noEmit`.

## Primary E2E flow to verify

All through the UI at http://localhost:5173 :
1. **Health wiring** — "System status" card should read `Backend health: ok` (App.tsx fetches `${VITE_API_URL}/health`; falls back to "Backend not running yet" if unreachable). `VITE_API_URL` defaults to `http://localhost:8000`.
2. **Complaint router** — pick Road type, set District, click "Route complaint" → POST `/api/complaints/route`. Expected authority mapping (services/routing_engine.py): NH→`NHAI / MoRTH`, SH→`State PWD Executive Engineer`, MDR→`District Roads Office`, PMGSY→`State Rural Roads Development Agency`. Use NH (not the default SH) so a broken mapping is visible.
3. **AI assistant** — click "Ask RoadWatch AI" → POST `/api/chat`. With no `GEMINI_API_KEY` set, the exact reply is: `Gemini API key is not configured. Add GEMINI_API_KEY to your backend environment to enable AI responses.` This is the correct expected output and proves the round-trip; a live Gemini answer requires `GEMINI_API_KEY` in the backend env.

Quick API smoke test (no browser):
```
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/complaints/route -H 'Content-Type: application/json' -d '{"road_type":"NH","district":"Chennai"}'
curl -X POST http://localhost:8000/api/chat -H 'Content-Type: application/json' -d '{"message":"hi"}'
```

## Devin Secrets Needed
- `GEMINI_API_KEY` (optional) — only needed to test a real AI chat response; without it the documented fallback message is expected. No other secrets are required for setup or E2E testing.

## Windows env gotchas (this session ran on Windows Server 2022 / Git Bash)
- The bundled embedded Python does NOT auto-add the script dir to `sys.path` for `python -c`, and ignores `PYTHONPATH`. `import main` fails with `ModuleNotFoundError` that way. Running via `uvicorn main:app` from `backend/` works because uvicorn adds cwd. To import directly, `sys.path.insert(0, <backend dir>)` first.
- In Chrome's address bar, the `computer` `type` action may drop the `:` character (so `localhost:5173` becomes a Google search). Type the host, then send the colon via key `shift+semicolon`, then the port.
- `upload_attachment` rejected Windows paths this session. Workaround: attach files via `message_user` (accepts `C:\...` backslash paths) to get hosted URLs, then embed those URLs in PR comments. `git_comment_on_pr` did NOT auto-upload local Windows paths — embed real URLs instead.
- Do not run `cmd.exe /c ...` for window focus in the default bash shell; it can leave the shell stuck in an interactive cmd prompt.

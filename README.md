# OMR Sheet Evaluation Web App

React + TailwindCSS frontend and FastAPI backend with OpenCV and Excel export.

## Structure

- `backend/`: FastAPI service
- `frontend/`: React (Vite) app

## Quickstart

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm i
npm run dev
```

Set `VITE_API_BASE` in `.env` for the frontend if your API is remote, e.g. `VITE_API_BASE=https://your-railway-url`.

## Features
- Upload OMR image and answer key (CSV/JSON)
- OpenCV-based bubble detection (grid assumption A–E)
- JSON results and downloadable Excel report

## Extend / Batch Processing
- Add a new endpoint to accept ZIP of multiple OMR images, iterate and aggregate.
- Enhance `OMRProcessor` to support multiple columns and templates.

## Deploy
- Backend: Railway/Render using command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Frontend: Vercel/Netlify; set `VITE_API_BASE` env var.
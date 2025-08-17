# OMR Evaluator Backend (FastAPI)

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `POST /evaluate` (form-data):
  - `omr_image`: jpg/png image file
  - `answer_key`: csv/json file
  - Response: `{ student_id, total_score, report_id, results: [...] }`

- `GET /report/{report_id}`: download generated Excel report.

## Notes
- OpenCV uses a simple grid-based assumption (single column, choices A-E). Adjust in `app/services/omr_processor.py`.
- Reports saved under `app/reports/`.

## Deploy
- Run with `uvicorn app.main:app --host 0.0.0.0 --port $PORT` on Railway/Render.
- Include `requirements.txt` and set start command accordingly.
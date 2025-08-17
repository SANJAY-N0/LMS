from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.evaluate import router as evaluate_router
from app.routers.report import router as report_router


app = FastAPI(title="OMR Evaluator API", version="0.1.0")

# Configure CORS (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(evaluate_router, prefix="")
app.include_router(report_router, prefix="")


@app.get("/")
async def root():
    return {"status": "ok", "service": "omr-evaluator"}
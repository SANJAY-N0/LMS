from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "reports"))

router = APIRouter()


@router.get("/report/{report_id}")
async def download_report(report_id: str):
    file_path = os.path.join(REPORTS_DIR, f"{report_id}.xlsx")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=f"omr_report_{report_id}.xlsx",
    )
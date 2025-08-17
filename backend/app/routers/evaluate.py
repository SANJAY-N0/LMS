from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi import BackgroundTasks
from typing import Dict
import tempfile
import shutil
import os

from app.services.answer_key_parser import parse_answer_key_file
from app.services.omr_processor import OMRProcessor
from app.services.report_generator import generate_excel_report
from app.models.schemas import EvaluateResponse, QuestionResult
from app.utils.id_generator import generate_report_id


router = APIRouter()


@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_omr(
    background_tasks: BackgroundTasks,
    omr_image: UploadFile = File(...),
    answer_key: UploadFile = File(...),
):
    if omr_image.content_type not in {"image/jpeg", "image/png"}:
        raise HTTPException(status_code=400, detail="omr_image must be a JPG or PNG image")

    # Save uploaded files to temp
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(omr_image.filename or "")[1] or ".png") as tmp_img:
            shutil.copyfileobj(omr_image.file, tmp_img)
            image_path = tmp_img.name
        answer_key_bytes = await answer_key.read()
    finally:
        await omr_image.close()
        await answer_key.close()

    try:
        key_map = parse_answer_key_file(answer_key_bytes, answer_key.filename or "answer_key.csv")
    except Exception as e:
        # Cleanup temp image if parsing fails
        try:
            os.unlink(image_path)
        except Exception:
            pass
        raise HTTPException(status_code=400, detail=f"Failed to parse answer key: {e}")

    processor = OMRProcessor()
    try:
        student_id, total_score, per_question = processor.evaluate(image_path, key_map)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process OMR image: {e}")
    finally:
        # Cleanup temp image
        try:
            os.unlink(image_path)
        except Exception:
            pass

    report_id = generate_report_id()
    report_path = generate_excel_report(report_id, per_question, key_map)

    # Optionally schedule background cleanup in future
    # background_tasks.add_task(cleanup_report_after, report_path)

    response = EvaluateResponse(
        student_id=student_id,
        total_score=total_score,
        report_id=report_id,
        results=[
            QuestionResult(
                question_no=q_no,
                correct_answer=key_map.get(q_no, None),
                student_answer=item.get("student_answer"),
                status=item.get("status"),
            )
            for q_no, item in per_question.items()
        ],
    )
    return response
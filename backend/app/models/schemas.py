from pydantic import BaseModel
from typing import List, Optional


class QuestionResult(BaseModel):
    question_no: int
    correct_answer: Optional[str]
    student_answer: Optional[str]
    status: str


class EvaluateResponse(BaseModel):
    student_id: str
    total_score: int
    report_id: str
    results: List[QuestionResult]
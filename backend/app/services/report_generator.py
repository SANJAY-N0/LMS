import os
from typing import Dict
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment

REPORTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "reports"))

# Ensure reports directory exists
os.makedirs(REPORTS_DIR, exist_ok=True)


def generate_excel_report(report_id: str, per_question: Dict[int, Dict[str, str]], answer_key: Dict[int, str]) -> str:
    wb = Workbook()
    ws = wb.active
    ws.title = "OMR Results"

    # Header
    headers = ["Question No", "Correct Answer", "Student Answer", "Status (Correct/Wrong/Not Attempted)"]
    ws.append(headers)
    for col in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col)
        cell.font = Font(bold=True)
        cell.alignment = Alignment(horizontal="center")

    correct_count = 0
    for q_no in sorted(per_question.keys()):
        correct = answer_key.get(q_no)
        student_answer = per_question[q_no].get("student_answer")
        status = per_question[q_no].get("status")
        if status == "Correct":
            correct_count += 1
        ws.append([q_no, correct, student_answer, status])

    # Total score at bottom
    ws.append([])
    ws.append(["Total Score", correct_count])

    file_path = os.path.join(REPORTS_DIR, f"{report_id}.xlsx")
    wb.save(file_path)
    return file_path
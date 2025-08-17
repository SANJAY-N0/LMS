import csv
import io
import json
from typing import Dict


def normalize_answer(value: str) -> str:
    if value is None:
        return None
    value = str(value).strip().upper()
    return value if value else None


def parse_answer_key_file(file_bytes: bytes, filename: str) -> Dict[int, str]:
    """
    Supports:
    - CSV with headers like: Q,Answer OR Question,Correct OR question_no,correct_answer
    - JSON as either {"1":"A","2":"C",...} or [{"question":1,"answer":"A"}, ...]
    """
    if filename.lower().endswith(".json"):
        payload = json.loads(file_bytes.decode("utf-8"))
        if isinstance(payload, dict):
            return {int(k): normalize_answer(v) for k, v in payload.items()}
        if isinstance(payload, list):
            out = {}
            for item in payload:
                q = item.get("Q") or item.get("Question") or item.get("question") or item.get("question_no")
                a = item.get("A") or item.get("Answer") or item.get("answer") or item.get("correct") or item.get("correct_answer")
                if q is None or a is None:
                    continue
                out[int(q)] = normalize_answer(a)
            return out
        raise ValueError("Unsupported JSON structure")

    # Default to CSV
    text = file_bytes.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))
    mapping: Dict[int, str] = {}
    for row in reader:
        q = row.get("Q") or row.get("Question") or row.get("question") or row.get("question_no") or row.get("q")
        a = row.get("A") or row.get("Answer") or row.get("answer") or row.get("correct") or row.get("correct_answer") or row.get("ans")
        if q is None or a is None:
            continue
        mapping[int(q)] = normalize_answer(a)

    if not mapping:
        # Try simple CSV without headers: Q,A per row
        reader2 = csv.reader(io.StringIO(text))
        for i, row in enumerate(reader2, start=1):
            if len(row) >= 2:
                try:
                    q_no = int(row[0])
                    mapping[q_no] = normalize_answer(row[1])
                except Exception:
                    continue
    if not mapping:
        raise ValueError("Empty or unrecognized CSV format")
    return mapping
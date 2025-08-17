import uuid

def generate_report_id() -> str:
    return uuid.uuid4().hex[:12]
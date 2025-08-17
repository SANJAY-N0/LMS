from typing import Dict, Tuple
import cv2
import numpy as np
import os
import re


class OMRProcessor:
    def __init__(self, choices: str = "ABCDE"):
        self.choices = choices

    def evaluate(self, image_path: str, answer_key: Dict[int, str]) -> Tuple[str, int, Dict[int, Dict[str, str]]]:
        image = cv2.imdecode(np.fromfile(image_path, dtype=np.uint8), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Unable to read OMR image")

        student_id = self._infer_student_id_from_filename(image_path)

        processed, warp = self._prepare_image(image)
        num_questions = max(answer_key.keys())
        num_choices = len(self.choices)

        bubble_strength = self._measure_bubbles(processed, num_questions, num_choices)

        per_question: Dict[int, Dict[str, str]] = {}
        total_score = 0

        for q_no in range(1, num_questions + 1):
            strengths = bubble_strength[q_no - 1]
            # Determine the selected choice by highest strength if above threshold
            best_idx = int(np.argmax(strengths))
            best_val = float(strengths[best_idx])
            threshold = max(0.4 * float(np.max(strengths)), 10.0)
            student_answer = None
            status = "Not Attempted"
            if best_val >= threshold:
                student_answer = self.choices[best_idx]
                correct = answer_key.get(q_no)
                if correct is not None and student_answer == correct:
                    status = "Correct"
                    total_score += 1
                else:
                    status = "Wrong"

            per_question[q_no] = {
                "student_answer": student_answer,
                "status": status,
            }

        return student_id, total_score, per_question

    def _prepare_image(self, image: np.ndarray):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        # Use adaptive threshold to be robust to lighting
        thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                       cv2.THRESH_BINARY_INV, 41, 10)
        # Try to detect the largest contour (paper) and warp perspective. If fail, use original
        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        warp = image.copy()
        if contours:
            c = max(contours, key=cv2.contourArea)
            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)
            if len(approx) == 4:
                pts = approx.reshape(4, 2)
                warp = self._four_point_transform(image, pts)
                gray = cv2.cvtColor(warp, cv2.COLOR_BGR2GRAY)
                blur = cv2.GaussianBlur(gray, (5, 5), 0)
                thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                               cv2.THRESH_BINARY_INV, 41, 10)
        return thresh, warp

    def _four_point_transform(self, image: np.ndarray, pts: np.ndarray) -> np.ndarray:
        rect = self._order_points(pts)
        (tl, tr, br, bl) = rect
        widthA = np.linalg.norm(br - bl)
        widthB = np.linalg.norm(tr - tl)
        maxWidth = int(max(widthA, widthB))

        heightA = np.linalg.norm(tr - br)
        heightB = np.linalg.norm(tl - bl)
        maxHeight = int(max(heightA, heightB))

        dst = np.array([
            [0, 0],
            [maxWidth - 1, 0],
            [maxWidth - 1, maxHeight - 1],
            [0, maxHeight - 1]
        ], dtype="float32")

        M = cv2.getPerspectiveTransform(rect, dst)
        warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
        return warped

    def _order_points(self, pts: np.ndarray) -> np.ndarray:
        rect = np.zeros((4, 2), dtype="float32")
        s = pts.sum(axis=1)
        rect[0] = pts[np.argmin(s)]
        rect[2] = pts[np.argmax(s)]

        diff = np.diff(pts, axis=1)
        rect[1] = pts[np.argmin(diff)]
        rect[3] = pts[np.argmax(diff)]
        return rect

    def _measure_bubbles(self, thresh: np.ndarray, num_questions: int, num_choices: int) -> np.ndarray:
        # Work with an inner margin to avoid borders
        h, w = thresh.shape[:2]
        margin_y = int(0.05 * h)
        margin_x = int(0.08 * w)
        roi = thresh[margin_y:h - margin_y, margin_x:w - margin_x]
        rh, rw = roi.shape[:2]

        # Assume single-column layout: num_questions rows, num_choices columns
        cell_h = rh // num_questions
        cell_w = rw // num_choices
        bubble_strength = np.zeros((num_questions, num_choices), dtype=np.float32)

        for qi in range(num_questions):
            y0 = qi * cell_h
            y1 = (qi + 1) * cell_h
            row = roi[y0:y1, :]
            for ci in range(num_choices):
                x0 = ci * cell_w
                x1 = (ci + 1) * cell_w
                cell = row[:, x0:x1]
                # Focus on the center area to avoid borders/printed circles
                ch, cw = cell.shape[:2]
                cy0 = int(ch * 0.2)
                cy1 = int(ch * 0.8)
                cx0 = int(cw * 0.2)
                cx1 = int(cw * 0.8)
                core = cell[cy0:cy1, cx0:cx1]
                # Strength is number of white pixels (since binary_inv => filled is white)
                strength = float(np.sum(core > 0))
                bubble_strength[qi, ci] = strength
        return bubble_strength

    def _infer_student_id_from_filename(self, image_path: str) -> str:
        base = os.path.basename(image_path)
        name, _ = os.path.splitext(base)
        # Extract digits as student id if present
        m = re.search(r"(\d{3,})", name)
        if m:
            return m.group(1)
        return name or "unknown"
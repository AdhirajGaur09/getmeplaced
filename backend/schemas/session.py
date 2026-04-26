from pydantic import BaseModel
from typing import Optional


class StartSessionRequest(BaseModel):
    company_focus: Optional[str] = None
    topic_focus: Optional[str] = None
    num_questions: int = 5


class SubmitAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    user_answer: str
    time_taken_seconds: int


class AttemptResult(BaseModel):
    question_id: str
    score: int
    ai_feedback: str
    time_taken_seconds: int


class SessionOut(BaseModel):
    id: str
    company_focus: Optional[str]
    topic_focus: Optional[str]
    questions: list[str]
    attempts: list[dict]
    overall_score: Optional[float]
    total_time_seconds: int
    is_completed: bool
    started_at: str
    completed_at: Optional[str]

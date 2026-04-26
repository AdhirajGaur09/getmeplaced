from beanie import Document, Link
from pydantic import Field
from datetime import datetime, timezone
from typing import Optional
from models.user import User
from models.question import Question


class QuestionAttempt(Document):
    question_id: str
    user_answer: str
    ai_feedback: str
    score: int                  # 0-10
    time_taken_seconds: int

    class Settings:
        name = "attempts"


class MockSession(Document):
    user_id: str
    company_focus: Optional[str] = None     # optional company filter
    topic_focus: Optional[str] = None
    questions: list[str] = []               # list of question IDs
    attempts: list[dict] = []               # inline attempt records
    overall_score: Optional[float] = None
    total_time_seconds: int = 0
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    is_completed: bool = False

    class Settings:
        name = "mock_sessions"

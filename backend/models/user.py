from beanie import Document
from pydantic import EmailStr, Field
from datetime import datetime, timezone
from typing import Optional


class User(Document):
    name: str
    email: EmailStr
    hashed_password: str
    avatar_color: str = "#6366f1"  # random accent per user
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Progress stats
    total_questions_attempted: int = 0
    total_mock_sessions: int = 0
    streak_days: int = 0
    last_active: Optional[datetime] = None
    weak_topics: list[str] = []

    class Settings:
        name = "users"

from beanie import Document
from pydantic import Field
from datetime import datetime, timezone
from typing import Optional
from enum import Enum


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class QuestionType(str, Enum):
    dsa = "DSA"
    system_design = "System Design"
    behavioral = "Behavioral"
    cs_fundamentals = "CS Fundamentals"


class Question(Document):
    title: str
    description: str
    difficulty: Difficulty
    question_type: QuestionType
    company: str                        # e.g. "Google", "Amazon"
    topic: str                          # e.g. "Arrays", "Graphs", "OOP"
    tags: list[str] = []
    hints: list[str] = []
    solution_approach: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    attempt_count: int = 0              # how many users have attempted

    class Settings:
        name = "questions"

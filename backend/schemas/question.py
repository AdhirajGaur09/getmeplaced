from pydantic import BaseModel
from typing import Optional
from models.question import Difficulty, QuestionType


class QuestionOut(BaseModel):
    id: str
    title: str
    description: str
    difficulty: Difficulty
    question_type: QuestionType
    company: str
    topic: str
    tags: list[str]
    hints: list[str]
    solution_approach: Optional[str]
    attempt_count: int


class QuestionCreate(BaseModel):
    title: str
    description: str
    difficulty: Difficulty
    question_type: QuestionType
    company: str
    topic: str
    tags: list[str] = []
    hints: list[str] = []
    solution_approach: Optional[str] = None


class QuestionsFilter(BaseModel):
    company: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    question_type: Optional[QuestionType] = None
    topic: Optional[str] = None
    skip: int = 0
    limit: int = 20

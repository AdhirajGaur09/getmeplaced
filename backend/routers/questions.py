from fastapi import APIRouter, Depends, Query
from typing import Optional
from models.question import Question, Difficulty, QuestionType
from schemas.question import QuestionOut, QuestionCreate
from core.security import get_current_user
from models.user import User

router = APIRouter(prefix="/api/questions", tags=["Questions"])


def _to_out(q: Question) -> QuestionOut:
    return QuestionOut(
        id=str(q.id),
        title=q.title,
        description=q.description,
        difficulty=q.difficulty,
        question_type=q.question_type,
        company=q.company,
        topic=q.topic,
        tags=q.tags,
        hints=q.hints,
        solution_approach=q.solution_approach,
        attempt_count=q.attempt_count,
    )


@router.get("/", response_model=list[QuestionOut])
async def list_questions(
    company: Optional[str] = Query(None),
    difficulty: Optional[Difficulty] = Query(None),
    question_type: Optional[QuestionType] = Query(None),
    topic: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    query = {}
    if company:
        query["company"] = company
    if difficulty:
        query["difficulty"] = difficulty
    if question_type:
        query["question_type"] = question_type
    if topic:
        query["topic"] = topic

    questions = await Question.find(query).skip(skip).limit(limit).to_list()
    return [_to_out(q) for q in questions]


@router.get("/companies", response_model=list[str])
async def list_companies(current_user: User = Depends(get_current_user)):
    """Return distinct company names for the filter sidebar."""
    companies = await Question.distinct("company")
    return sorted(companies)


@router.get("/topics", response_model=list[str])
async def list_topics(current_user: User = Depends(get_current_user)):
    topics = await Question.distinct("topic")
    return sorted(topics)


@router.get("/{question_id}", response_model=QuestionOut)
async def get_question(
    question_id: str,
    current_user: User = Depends(get_current_user),
):
    q = await Question.get(question_id)
    if not q:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Question not found")

    # Increment attempt count on view
    q.attempt_count += 1
    await q.save()
    return _to_out(q)


@router.post("/", response_model=QuestionOut, status_code=201)
async def create_question(
    body: QuestionCreate,
    current_user: User = Depends(get_current_user),
):
    """Admin endpoint to seed questions (add role check in production)."""
    q = Question(**body.model_dump())
    await q.insert()
    return _to_out(q)

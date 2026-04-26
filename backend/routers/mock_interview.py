from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from models.session import MockSession
from models.question import Question
from models.user import User
from schemas.session import StartSessionRequest, SubmitAnswerRequest, AttemptResult, SessionOut
from core.security import get_current_user
import random

router = APIRouter(prefix="/api/mock", tags=["Mock Interview"])


def _session_out(s: MockSession) -> SessionOut:
    return SessionOut(
        id=str(s.id),
        company_focus=s.company_focus,
        topic_focus=s.topic_focus,
        questions=s.questions,
        attempts=s.attempts,
        overall_score=s.overall_score,
        total_time_seconds=s.total_time_seconds,
        is_completed=s.is_completed,
        started_at=s.started_at.isoformat(),
        completed_at=s.completed_at.isoformat() if s.completed_at else None,
    )


def _score_answer(question: Question, user_answer: str) -> tuple[int, str]:
    """
    Simple heuristic scoring.
    In production: replace with an LLM call (e.g. OpenAI / Gemini API).
    """
    answer_len = len(user_answer.strip().split())
    keywords_in_question = set(question.title.lower().split()) | set(question.topic.lower().split())
    answer_words = set(user_answer.lower().split())
    overlap = len(keywords_in_question & answer_words)

    if answer_len < 10:
        score = random.randint(1, 3)
        feedback = "Your answer is too brief. Try to elaborate with examples and key concepts."
    elif overlap >= 3 and answer_len >= 50:
        score = random.randint(7, 10)
        feedback = "Great answer! You covered the key concepts well. "
        if score < 10:
            feedback += "Consider adding more specific examples to strengthen further."
    elif answer_len >= 20:
        score = random.randint(4, 7)
        feedback = "Decent attempt. Try to include more topic-specific terminology and structured explanation."
    else:
        score = random.randint(2, 5)
        feedback = "Needs more depth. Structure your answer with: definition → working → example → trade-offs."

    return score, feedback


@router.post("/start", response_model=SessionOut, status_code=201)
async def start_session(
    body: StartSessionRequest,
    current_user: User = Depends(get_current_user),
):
    query = {}
    if body.company_focus:
        query["company"] = body.company_focus
    if body.topic_focus:
        query["topic"] = body.topic_focus

    questions = await Question.find(query).to_list()
    if len(questions) < body.num_questions:
        questions = await Question.find_all().to_list()

    selected = random.sample(questions, min(body.num_questions, len(questions)))
    question_ids = [str(q.id) for q in selected]

    session = MockSession(
        user_id=str(current_user.id),
        company_focus=body.company_focus,
        topic_focus=body.topic_focus,
        questions=question_ids,
    )
    await session.insert()
    return _session_out(session)


@router.post("/answer", response_model=AttemptResult)
async def submit_answer(
    body: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
):
    session = await MockSession.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not your session")
    if session.is_completed:
        raise HTTPException(status_code=400, detail="Session already completed")

    question = await Question.get(body.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    score, feedback = _score_answer(question, body.user_answer)

    attempt = {
        "question_id": body.question_id,
        "user_answer": body.user_answer,
        "ai_feedback": feedback,
        "score": score,
        "time_taken_seconds": body.time_taken_seconds,
    }
    session.attempts.append(attempt)
    session.total_time_seconds += body.time_taken_seconds

    # Auto-complete when all questions answered
    if len(session.attempts) >= len(session.questions):
        session.is_completed = True
        session.completed_at = datetime.now(timezone.utc)
        session.overall_score = round(
            sum(a["score"] for a in session.attempts) / len(session.attempts), 1
        )
        # Update user stats
        current_user.total_mock_sessions += 1
        current_user.total_questions_attempted += len(session.attempts)
        current_user.last_active = datetime.now(timezone.utc)
        await current_user.save()

    await session.save()

    return AttemptResult(
        question_id=body.question_id,
        score=score,
        ai_feedback=feedback,
        time_taken_seconds=body.time_taken_seconds,
    )


@router.get("/sessions", response_model=list[SessionOut])
async def my_sessions(current_user: User = Depends(get_current_user)):
    sessions = await MockSession.find(
        MockSession.user_id == str(current_user.id)
    ).sort(-MockSession.started_at).limit(20).to_list()
    return [_session_out(s) for s in sessions]


@router.get("/sessions/{session_id}", response_model=SessionOut)
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
):
    session = await MockSession.get(session_id)
    if not session or session.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Session not found")
    return _session_out(session)

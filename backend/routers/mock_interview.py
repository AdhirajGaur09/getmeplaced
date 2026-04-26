from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from models.session import MockSession
from models.question import Question
from models.user import User
from schemas.session import StartSessionRequest, SubmitAnswerRequest, AttemptResult, SessionOut
from core.security import get_current_user
from core.config import settings
import random
from groq import Groq
import json as json_lib

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
    try:
        client = Groq(api_key=settings.groq_api_key)

        prompt = f"""You are a strict but fair technical interviewer at a top tech company.
Evaluate the candidate's answer below.

Question: {question.title}
Topic: {question.topic}
Difficulty: {question.difficulty}
Question Type: {question.question_type}

Candidate's Answer: {user_answer}

Return ONLY a valid JSON object, nothing else, no markdown, no explanation:
{{"score": 7, "feedback": "Your feedback here in 2-3 sentences."}}

Score rules:
- 9-10: Excellent, covers all key concepts with examples
- 7-8: Good, covers most concepts  
- 5-6: Average, missing some key points
- 3-4: Below average, needs improvement
- 1-2: Very poor or irrelevant answer"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a technical interviewer. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ]
        )

        text = response.choices[0].message.content.strip()

        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()

        result = json_lib.loads(text)
        score = max(1, min(10, int(result["score"])))
        feedback = result["feedback"]
        return score, feedback

    except Exception as e:
        print(f"Groq error: {e}")
        return 5, "Answer received. Could not process AI feedback at this time."


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

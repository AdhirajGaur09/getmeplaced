from fastapi import APIRouter, Depends
from models.user import User
from models.session import MockSession
from models.question import Question
from core.security import get_current_user
from collections import Counter

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_stats(current_user: User = Depends(get_current_user)):
    """Return all dashboard metrics for the logged-in user."""

    sessions = await MockSession.find(
        MockSession.user_id == str(current_user.id),
        MockSession.is_completed == True,
    ).to_list()

    # Score trend (last 7 sessions)
    score_trend = [
        {"session": i + 1, "score": s.overall_score or 0}
        for i, s in enumerate(sessions[-7:])
    ]

    # Topic-wise performance
    topic_scores: dict[str, list[int]] = {}
    for session in sessions:
        for attempt in session.attempts:
            qid = attempt.get("question_id")
            score = attempt.get("score", 0)
            q = await Question.get(qid)
            if q:
                topic_scores.setdefault(q.topic, []).append(score)

    topic_performance = [
        {
            "topic": topic,
            "avg_score": round(sum(scores) / len(scores), 1),
            "attempts": len(scores),
        }
        for topic, scores in topic_scores.items()
    ]

    # Company distribution
    companies_attempted = Counter()
    for session in sessions:
        if session.company_focus:
            companies_attempted[session.company_focus] += 1

    return {
        "total_questions_attempted": current_user.total_questions_attempted,
        "total_mock_sessions": current_user.total_mock_sessions,
        "streak_days": current_user.streak_days,
        "weak_topics": current_user.weak_topics,
        "score_trend": score_trend,
        "topic_performance": topic_performance,
        "companies_attempted": [
            {"company": c, "count": n}
            for c, n in companies_attempted.most_common(5)
        ],
        "avg_overall_score": (
            round(sum(s.overall_score or 0 for s in sessions) / len(sessions), 1)
            if sessions else 0
        ),
    }

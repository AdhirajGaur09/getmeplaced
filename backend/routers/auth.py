from fastapi import APIRouter, HTTPException, status, Depends
from schemas.user import RegisterRequest, LoginRequest, TokenResponse, UserOut
from models.user import User
from core.security import hash_password, verify_password, create_access_token, get_current_user
import random

router = APIRouter(prefix="/api/auth", tags=["Auth"])

AVATAR_COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
    "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
]


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest):
    existing = await User.find_one(User.email == body.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=body.name,
        email=body.email,
        hashed_password=hash_password(body.password),
        avatar_color=random.choice(AVATAR_COLORS),
    )
    await user.insert()

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    user = await User.find_one(User.email == body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        avatar_color=current_user.avatar_color,
        total_questions_attempted=current_user.total_questions_attempted,
        total_mock_sessions=current_user.total_mock_sessions,
        streak_days=current_user.streak_days,
        weak_topics=current_user.weak_topics,
    )

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from core.config import settings
from models.user import User
from models.question import Question
from models.session import MockSession


async def init_db():
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client.getmeplaced

    await init_beanie(
        database=db,
        document_models=[User, Question, MockSession],
    )
    print("✅ Connected to MongoDB Atlas")
    return client
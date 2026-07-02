from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.models.user import User

client: AsyncIOMotorClient | None = None


async def init_db() -> None:
    global client
    client = AsyncIOMotorClient(settings.mongo_uri)
    # Motor doesn't wrap PyMongo's append_metadata (added in PyMongo 4.14), so accessing
    # it falls through to Motor's legacy client.<name> shorthand and returns a callable
    # Database object instead of a bound method, which crashes Beanie's driver-info check.
    client.append_metadata = client.delegate.append_metadata
    await init_beanie(database=client[settings.db_name], document_models=[User])


async def close_db() -> None:
    global client
    if client is not None:
        client.close()
        client = None


def get_client() -> AsyncIOMotorClient:
    return client

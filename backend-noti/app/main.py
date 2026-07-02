from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db.init_db import close_db, get_client, init_db
from app.routes import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(title="HoyeHoyeNoti", lifespan=lifespan)
app.include_router(auth.router)


@app.get("/health")
async def health():
    try:
        await get_client().admin.command("ping")
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "error", "database": "disconnected"}

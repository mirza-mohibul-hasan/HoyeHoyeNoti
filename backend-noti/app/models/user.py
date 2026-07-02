from datetime import datetime, timezone
from enum import Enum

from beanie import Document, Indexed
from pydantic import EmailStr, Field


class Role(str, Enum):
    STUDENT = "student"
    TEACHING_ASSISTANT = "teaching_assistant"
    TEACHER = "teacher"


class User(Document):
    name: str
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    role: Role = Role.STUDENT
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"

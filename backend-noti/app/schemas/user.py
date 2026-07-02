from datetime import datetime

from beanie import PydanticObjectId
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import Role


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserCreateByTeacher(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: PydanticObjectId
    name: str
    email: EmailStr
    role: Role
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

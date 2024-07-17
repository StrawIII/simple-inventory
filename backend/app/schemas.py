from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr


# TODO implement "unhealthy" status (e.g., connectiong to database failed)
class Health(BaseModel):
    status: Literal["healthy", "unhealthy"]
    timestamp: datetime


class UserCreds(BaseModel):
    email: EmailStr
    password: str


class UserBase(BaseModel):
    email: EmailStr

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr


class Health(BaseModel):
    status: Literal["healthy"]
    timestamp: datetime


class UserCreds(BaseModel):
    email: EmailStr
    password: str


class UserBase(BaseModel):
    email: EmailStr

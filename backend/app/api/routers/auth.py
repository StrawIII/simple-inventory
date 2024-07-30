from fastapi import APIRouter, Request, Response

from app.config import SettingsDep
from app.db import DBDep
from app.models import User
from app.schemas import UserCreds
from app.security import create_access_token, verify_password

router = APIRouter()


@router.post("/login")
def login(response: Response, creds: UserCreds, settings: SettingsDep, db: DBDep):
    user = db.query(User).filter_by(username=creds.username).first()

    verify_password(creds.password, user.hashed_password)

    response.set_cookie(
        key=settings.cookie_key,
        value=create_access_token(creds.username),
        httponly=True,
    )

    return creds.username


# * test route
@router.get("/test/token/{username}")
def token(username: str, response: Response, settings: SettingsDep):
    token = create_access_token(username)

    response.set_cookie(
        key=settings.cookie_key,
        value=token,
        max_age=settings.max_age,
        httponly=True,
    )
    return "OK"


# * test route
@router.get("/test/cookie")
def get_cookie(request: Request, settings: SettingsDep):
    cookie_value = request.cookies.get(settings.cookie_key)
    # print(request.headers)
    # print(request.cookies)
    return cookie_value

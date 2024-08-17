from time import time

from authlib.jose import jwt
from authlib.jose.errors import BadSignatureError
from bcrypt import checkpw, gensalt, hashpw
from fastapi import Depends, HTTPException, Request, status
from typing_extensions import Annotated

from app.config import settings
from app.db import DBDep
from app.models import User


def hash_password(password: str) -> bytes:
    return hashpw(password.encode(), gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not checkpw(plain_password.encode(), hashed_password.encode()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )


def create_access_token(username: str) -> str:
    header = {"typ": "JWT", "alg": settings.jwt_alg}
    payload = {
        "iss": "Authlib",
        "sub": username,
        "exp": time() + settings.max_age,
        "iat": time(),
    }

    token = jwt.encode(header=header, payload=payload, key=settings.jwt_key)

    return token.decode()


def verify_user(request: Request, db: DBDep) -> None:
    token = request.cookies.get(settings.cookie_key)

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cookie not found",
        )

    try:
        claims = jwt.decode(s=token, key=settings.jwt_key)
    except BadSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature",
        ) from None

    # if username != claims["sub"]:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Invalid token for the current user",
    #     )

    if time() > claims["exp"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired token",
        )

    user = db.query(User).filter_by(username=claims["sub"]).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


def get_current_user_id(request: Request, db: DBDep) -> int:
    token = request.cookies.get(settings.cookie_key)
    claims = jwt.decode(s=token, key=settings.jwt_key)
    user = db.query(User).filter_by(username=claims["sub"]).first()

    return user.id


CurrentUserDep = Annotated[int, Depends(get_current_user_id)]


def is_admin(request: Request, db: DBDep) -> None:
    token = request.cookies.get(settings.cookie_key)
    claims = jwt.decode(s=token, key=settings.jwt_key)
    user = db.query(User).filter_by(username=claims["sub"]).first()

    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not admin",
        )


IsAdminDep = Annotated[None, Depends(is_admin)]

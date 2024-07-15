from time import time

from authlib.jose import jwt
from authlib.jose.errors import BadSignatureError
from bcrypt import checkpw, gensalt, hashpw

from app.config import settings


def hash_password(password: str | bytes) -> bytes:
    if isinstance(password, str):
        password = password.encode()

    return hashpw(password, gensalt())


def verify_password(password: str | bytes, hashed_password: bytes) -> bool:
    if isinstance(password, str):
        password = password.encode()

    return checkpw(password.encode(), hashed_password)


def create_access_token(user: str) -> bytes:
    header = {"typ": "JWT", "alg": settings.jwt_alg}
    payload = {"iss": "Authlib", "sub": user, "exp": time() + 60, "iat": time()}

    try:
        token = jwt.encode(header=header, payload=payload, key=settings.jwt_key)
    except Exception:
        return b""

    return token


def verify_access_token(user: str, token: str) -> bool:
    try:
        claims = jwt.decode(s=token, key=settings.jwt_key)
    except BadSignatureError:
        return False

    return user == claims["sub"] and time() < claims["exp"]

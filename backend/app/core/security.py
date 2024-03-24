from time import time

from authlib.jose import jwt
from authlib.jose.errors import BadSignatureError

from app.core.config import settings


def verify_password():
    # TODO use a library to prevent timing attacks
    pass


def create_access_token(user: str) -> bytes:
    header = {"typ": "JWT", "alg": settings.JWT_ALG}
    payload = {"iss": "Authlib", "sub": user, "exp": time() + 60, "iat": time()}

    try:
        token = jwt.encode(header=header, payload=payload, key=settings.JWT_KEY)
    except Exception:
        return b""

    return token


def verify_access_token(user: str, token: str) -> bool:
    try:
        claims = jwt.decode(s=token, key=settings.JWT_KEY)
    except BadSignatureError:
        return False

    return user == claims["sub"] and time() < claims["exp"]

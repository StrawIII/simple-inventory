from authlib.jose import jwt
from authlib.jose.errors import BadSignatureError

from app.core.config import settings


def verify_password():
    # TODO use a library to prevent timing attacks
    pass


def create_access_token(user: str) -> bytes:
    header = {"alg": settings.JWT_ALG}
    payload = {"iss": "Authlib", "sub": user}
    token = jwt.encode(header=header, payload=payload, key=settings.JWT_KEY)
    return token


def verify_access_token(user: str, token: str) -> bool:
    print(type(token))
    # TODO verify expiration
    try:
        claims = jwt.decode(s=token, key=settings.JWT_KEY)
    except BadSignatureError:
        return False

    return claims["sub"] == user

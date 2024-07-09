from typing import Union

from fastapi import APIRouter, Header
from typing_extensions import Annotated

from app.schemas import UserCreds
from app.security import create_access_token, verify_access_token

router = APIRouter()


# TODO remember me -> longer exp
@router.post("/auth")
def auth(creds: UserCreds, authorization: Annotated[Union[str, None], Header()] = None):
    if authorization:
        valid = verify_access_token(user=creds.username, token=authorization)
        # return RedirectResponse(url="https://www.google.com")
        return {"valid": valid, "user": creds.username}

    return {"token": create_access_token(user=creds.username)}

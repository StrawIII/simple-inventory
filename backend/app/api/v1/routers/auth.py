from typing import Union

from fastapi import APIRouter, Header
from fastapi.responses import RedirectResponse
from typing_extensions import Annotated

from app.core.security import create_access_token, verify_access_token
from app.schemas.schemas import UserCreds

router = APIRouter()


# TODO remember me -> longer exp
@router.post("/auth")
def auth(creds: UserCreds, authorization: Annotated[Union[str, None], Header()] = None):
    if authorization:
        valid = verify_access_token(user=creds.username, token=authorization)
        # return RedirectResponse(url="https://www.google.com")
        return {"valid": valid, "user": creds.username}

    return {"token": create_access_token(user=creds.username)}

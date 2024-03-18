from typing import Union

from fastapi import APIRouter, Header
from typing_extensions import Annotated

from app.core.security import create_access_token, verify_access_token

router = APIRouter()


@router.post('/auth/{user}')
def auth(user: str, authorization: Annotated[Union[str, None], Header()] = None):
	print(authorization)

	print(create_access_token(user=user))

	if authorization:
		valid = verify_access_token(user=user, token=authorization)
		return {'valid': valid}

	return {'valid': None}

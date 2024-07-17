from fastapi import APIRouter

router = APIRouter(prefix="/users")


# only used by admin
@router.get("")
def get_users():
    return "OK"


@router.get("/{username}")
def get_user():
    return "OK"


@router.post("/{username}")
def create_user():
    return "OK"


@router.put("/{username}")
def update_user():
    return "OK"


@router.get("/{username}/items")
def get_items(username: str):
    return "OK"

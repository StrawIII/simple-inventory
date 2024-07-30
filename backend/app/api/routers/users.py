from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.db import DBDep
from app.models import Item, User
from app.schemas import UserInUI
from app.security import CurrentUserDep, IsAdminDep, hash_password

router = APIRouter(prefix="/users")


@router.get("")
def get_users(db: DBDep, is_admin: IsAdminDep):
    return db.query(User).all()


@router.get("/{username}")
def get_user(username: str):
    return "OK"


@router.post("/users", status_code=201)
def create_user_(user: UserInUI, db: DBDep):
    db.add(
        User(
            **user.model_dump(exclude={"password"}),
            hashed_password=hash_password(user.password),
        )
    )

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        # TODO more granualar responses
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the user: {e}",
        )


@router.put("/{username}")
def update_user(username: str):
    return "OK"


@router.get("/{username}/items")
def get_items(username: str, db: DBDep, current_user: CurrentUserDep):
    return db.query(Item).filter(Item.owner_id == current_user)

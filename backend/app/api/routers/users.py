from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, NoResultFound

from app.db import DBDep
from app.models import Borrow, Item, User
from app.schemas import UserCreate
from app.security import CurrentUserDep, hash_password, is_admin

router = APIRouter()


@router.get("", dependencies=[Depends(is_admin)])
def get_users_(db: DBDep):
    # TODO return Pydantic model
    return db.scalars(select(User)).all()


@router.post("", status_code=201, dependencies=[Depends(is_admin)])
def create_user_(user: UserCreate, db: DBDep):
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


@router.delete("/{user_id}", status_code=201, dependencies=[Depends(is_admin)])
def delete_user_(
    user_id: int,
    db: DBDep,
    current_user: CurrentUserDep,
):
    # ? def delete_user() in crud.py
    if current_user == user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete yourself",
        )

    try:
        db.delete(db.query(User).filter(User.id == user_id).one())
    except NoResultFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
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


@router.get("/{username}")
def get_user_(username: str, db: DBDep):
    try:
        return db.scalars(select(User).where(User.username == username)).one()
    except NoResultFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


@router.put("/{username}")
def update_user(db: DBDep, current_user: CurrentUserDep):
    try:
        user = db.query(User).filter(User.id == current_user).one()
    except NoResultFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    if current_user != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your item",
        )


@router.get("/{username}/items")
def get_user_items_(db: DBDep, current_user: CurrentUserDep):
    return db.scalars(
        select(Item).where(Item.owner_id == current_user).order_by(Item.id)
    ).all()


@router.get("/{username}/borrows")
def get_user_borrows_(db: DBDep, current_user: CurrentUserDep):
    return db.query(Borrow).filter(Borrow.user_id == current_user).all()

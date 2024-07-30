from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.db import DBDep
from app.models import Borrow
from app.schemas import BorrowRequest
from app.security import CurrentUserDep, is_admin

router = APIRouter()


@router.get("", dependencies=[Depends(is_admin)])
def get_borrows_(db: DBDep):
    return db.query(Borrow).all()


@router.post("")
def create_borrow_(
    borrow_request: BorrowRequest, db: DBDep, current_user: CurrentUserDep
):
    db.add(Borrow(**borrow_request, user_id=current_user))

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        # TODO more granualar responses
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the borrow: {e}",
        )


@router.get("/{borrow_id}")
def get_borrow_(borrow_id: int, db: DBDep):
    return db.query(Borrow).get(borrow_id)


@router.put("/{borrow_id}")
def update_borrow_(borrow_id: int, db: DBDep, current_user: CurrentUserDep):
    pass


@router.delete("/{id}")
def delete_borrow_(borrow_id: int, db: DBDep, current_user: CurrentUserDep):
    borrow = db.query(Borrow).filter(Borrow.id == borrow_id).first()

    if not borrow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrow request not found",
        )

    if current_user != borrow.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your borrow request",
        )

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        # TODO more granualar responses
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the borrow request: {e}",
        )

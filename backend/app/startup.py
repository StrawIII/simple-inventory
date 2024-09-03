from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import Settings, SettingsDep
from app.db import DBDep
from app.models import ItemStatus, User
from app.security import hash_password


def creata_root_user(db: Session, settings: Settings) -> None:
    if (
        db.scalars(
            select(User).where(User.username == settings.root_username),
        ).one_or_none()
        is not None
    ):
        return

    db.add(
        User(
            username=settings.root_username,
            email="root",
            is_admin=True,
            hashed_password=hash_password(settings.root_password),
        ),
    )

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the user: {e}",
        ) from e


def create_item_statuses(db: DBDep, settings: SettingsDep) -> None:
    for item_status in settings.item_statuses:
        if (
            db.scalars(
                select(ItemStatus).where(ItemStatus.name == item_status),
            ).one_or_none()
            is not None
        ):
            continue

        db.add(ItemStatus(name=item_status))

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the user: {e}",
        ) from e


def create_borrow_statuses(db: Session, settings: Settings): ...

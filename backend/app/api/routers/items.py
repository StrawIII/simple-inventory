from csv import DictReader
from typing import List

from botocore.exceptions import ClientError
from fastapi import APIRouter, HTTPException, UploadFile, status
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError, NoResultFound

from app.config import SettingsDep
from app.db import DBDep, S3Dep
from app.models import Item
from app.schemas import ItemCreate, ItemCreateBulk, ItemUpdate
from app.security import CurrentUserDep

router = APIRouter()


@router.get("")
def get_items_(db: DBDep, current_user: CurrentUserDep):
    # * return basic info about each item
    return db.scalars(select(Item).where(Item.owner_id == current_user)).all()


@router.post("")
def create_item_(item: ItemCreate, db: DBDep, current_user: CurrentUserDep):
    db.add(Item(**item.model_dump(), owner_id=current_user))

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        # TODO more granualar responses
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the user: {e}",
        )


@router.get("/{item_id}")
def get_item_(item_id: int, db: DBDep):
    # * return detailed info about a specific item
    return db.scalar(select(Item).where(Item.id == item_id))


@router.put("/{item_id}")
def update_item_(
    item_id: int,
    item_update: ItemUpdate,
    db: DBDep,
    current_user: CurrentUserDep,
):
    item = db.scalar(select(Item).where(Item.id == item_id))

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    if current_user != item.owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your item",
        )

    # TODO improve this
    item.name = item_update.name
    item.comment = item_update.comment
    item.location = item_update.location
    item.location_comment = item_update.location_comment

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the item: {e}",
        )


@router.delete("/{item_id}")
def delete_item_(item_id: int, db: DBDep, current_user: CurrentUserDep):
    item = db.scalar(select(Item).where(Item.id == item_id))

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    if current_user != item.owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your item",
        )

    db.delete(item)

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the item: {e}",
        )


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def bulk_create_items_(
    upload_file: UploadFile,
    settings: SettingsDep,
    db: DBDep,
    current_user: CurrentUserDep,
):
    data = upload_file.file.read().decode(settings.csv_encoding).splitlines()
    reader = DictReader(data, delimiter=settings.csv_delimiter)

    # TODO add more sofisticated validation (ignore extra headers)
    if reader.fieldnames != settings.csv_headers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected headers: {settings.csv_headers}, received headers: {reader.fieldnames}",
        )

    try:
        items = [ItemCreateBulk(**row) for row in reader]
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected headers: {settings.csv_headers}, received headers: {reader.fieldnames}",
        ) from None

    db.add_all(
        [
            Item(
                **item.model_dump(
                    include={"external_id", "name", "comment", "location"},
                ),
                owner_id=current_user,
            )
            for item in items
        ]
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


@router.get("/{item_id}/image")
def get_item_image_url_(item_id: str, s3: S3Dep):
    try:
        return s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": "simple-inventory", "Key": item_id},
            ExpiresIn=3600,
        )
    except ClientError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error while creating presigned URL",
        )


@router.post("/{item_id}/image", status_code=status.HTTP_201_CREATED)
def add_item_image_(
    item_id: str,
    upload_file: UploadFile,
    s3: S3Dep,
    db: DBDep,
    current_user: CurrentUserDep,
):
    item = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    if current_user != item.owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your item",
        )

    # ? maybe implement in MinIO or frontend if possible -> no need to reset pointer
    if len(upload_file.file.read()) > 2_000_000:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="The uploaded file is too large. The maximum allowed size is 2 Megabytes.",
        )
    # reset the file pointer
    upload_file.file.seek(0)

    s3.upload_fileobj(
        upload_file.file,
        "simple-inventory",
        item_id,
        ExtraArgs={"ContentType": upload_file.content_type},
    )

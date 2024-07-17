from csv import DictReader
from typing import List

from fastapi import APIRouter, HTTPException, UploadFile, status
from pydantic import ValidationError

from app.config import settings
from app.models import Item
from app.schemas import ItemFromFile

router = APIRouter()


@router.get("")
def get_items():
    return "OK"


@router.post("")
def create_item():
    return "OK"


@router.get("/{id}")
def get_item():
    return "OK"


@router.put("/{id}")
def update_item():
    return "OK"


@router.delete("/{id}")
def delete_item():
    return "OK"


@router.post("/bulk")
def bulk_create_items(upload_file: UploadFile):
    data = upload_file.file.read().decode(settings.csv_encoding).splitlines()
    reader = DictReader(data, delimiter=settings.csv_delimiter)

    # TODO add more sofisticated validation (ignore extra headers)
    if reader.fieldnames != settings.csv_headers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Expected headers: {settings.csv_headers}, received headers: {reader.fieldnames}",
        )

    items: List[ItemFromFile] = []

    for row in reader:
        try:
            items.append(ItemFromFile(**row))
        except ValidationError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Expected headers: {settings.csv_headers}, received headers: {reader.fieldnames}",
            )

    for item in items:
        Item()

    return {"data": items[0]}

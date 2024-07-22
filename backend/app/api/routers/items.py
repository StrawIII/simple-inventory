from csv import DictReader
from typing import List

from fastapi import APIRouter, HTTPException, UploadFile, status
from pydantic import ValidationError

from app.config import settings
from app.models import Item
from app.schemas import ItemFromFile

router = APIRouter()


@router.get("")
def get_items_():
    return "OK"


@router.post("")
def create_item_():
    return "OK"


@router.get("/{id}")
def get_item_():
    return "OK"


@router.put("/{id}")
def update_item_():
    return "OK"


@router.delete("/{id}")
def delete_item_():
    return "OK"


@router.post("/bulk")
def bulk_create_items_(upload_file: UploadFile):
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

    # bulk insert function

    return {"data": items[0]}


@router.get("/{id}/image")
def get_item_image_(settings: SettingsDep):
    # * retreive from MINIO using BOTO3
    return settings.csv_encoding


@router.post("/{id}/image")
def add_item_image_(settings: SettingsDep):
    # * save to MINIO using BOTO3
    return "OK"

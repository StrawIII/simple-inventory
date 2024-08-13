from typing import Annotated

import boto3
from botocore.client import BaseClient
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.config import SettingsDep, settings

engine = create_engine(str(settings.postgres_dsn), echo=True)


def get_db():
    with Session(engine) as session:
        yield session


DBDep = Annotated[Session, Depends(get_db)]

s3: BaseClient = boto3.client(
    "s3",
    endpoint_url=f"{settings.minio_host}:{settings.minio_port}",
    aws_access_key_id=settings.minio_access_key,
    aws_secret_access_key=settings.minio_secret_key,
)


def get_s3_client() -> BaseClient:
    return s3


S3Dep = Annotated[BaseClient, Depends(get_s3_client)]

if __name__ == "__main__":
    s3 = boto3.client(
        "s3",
        endpoint_url="http://localhost:9000",
        aws_access_key_id="z0LcizhPp7MrM41Z9OE3",
        aws_secret_access_key="PiDrP3ZaGT1pQWWJqvs7Khngo7gL4iRwYDiTQGyH",
    )
    for bucket in s3.list_buckets()["Buckets"]:
        print(f'  {bucket["Name"]}')


# ? move to crud.py
def creta_root_user(db: DBDep, settings: SettingsDep): ...


def create_item_statuses(): ...


def create_borrow_statuses(): ...

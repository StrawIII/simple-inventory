from typing import Annotated, Generator

import boto3
from botocore.client import BaseClient
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.config import settings

engine = create_engine(str(settings.postgres_dsn), echo=True)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


DBDep = Annotated[Session, Depends(get_db)]

s3: BaseClient = boto3.client(
    "s3",
    endpoint_url=f"{settings.minio_host}:{settings.minio_port}",
    aws_access_key_id=settings.minio_root_user,
    aws_secret_access_key=settings.minio_root_password,
)


def get_s3_client() -> BaseClient:
    return s3


S3Dep = Annotated[BaseClient, Depends(get_s3_client)]

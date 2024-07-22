from typing import Annotated, Any

import boto3
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.config import settings

engine = create_engine(str(settings.postgres_dsn), echo=True)


def get_db():
    with Session(engine) as session:
        yield session


DBDep = Annotated[Session, Depends(get_db)]


s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="minio_access_key",
    aws_secret_access_key="minio_secret_key",
)


def get_s3_client():
    return s3


S3Dep = Annotated[Any, Depends(get_s3_client)]

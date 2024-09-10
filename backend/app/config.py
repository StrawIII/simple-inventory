from __future__ import annotations

from typing import Annotated

from dotenv import find_dotenv
from fastapi import Depends
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=find_dotenv(), extra="ignore")

    project_name: str = "Simple Inventory"

    api_prefix: str = "/api/v1"
    cors_origins: list[str] = [
        "http://localhost:3000",
    ]

    root_username: str
    root_password: str

    cookie_key: str
    jwt_alg: str = "HS256"
    jwt_key: str
    max_age: int = 2592000  # 30 days in seconds

    csv_encoding: str = "cp1250"
    csv_delimiter: str = ";"
    csv_headers: list[str] = [
        "Typ",
        "Inv. číslo",
        "Název",
        "Výr. číslo",
        "Dat. zařazení",
        "NS",
        "Kód umístění",
        "Název umístění",
        "Klasifikace",
        "Vstupní účetní cena",
        "Zůst. cena",
        "Poznámka",
        "Hmot. odp.",
    ]

    item_statuses: list[str] = [
        "AVAILABLE",
        "UNAVAILABLE",
        "HIDDEN",
    ]
    borrow_statuses: list[str] = [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
    ]

    max_image_size: int = 2_000_000  # bytes = 2 MB

    smtp_enabled: bool = False
    smtp_host: str = ""
    smtp_port: int = 0
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_tls: bool = True

    postgres_host: str
    postgres_port: int
    postgres_user: str
    postgres_password: str
    postgres_db: str

    @computed_field
    @property
    def postgres_url(self) -> URL:
        return URL.create(
            drivername="postgresql+psycopg2",
            username=self.postgres_user,
            password=self.postgres_password,
            host=self.postgres_host,
            port=self.postgres_port,
            database=self.postgres_db,
        )

    minio_host: str
    minio_port: int
    minio_root_user: str
    minio_root_password: str


settings = Settings()

SettingsDep = Annotated[Settings, Depends(lambda: settings)]

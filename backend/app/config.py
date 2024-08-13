from typing import Annotated, List

from dotenv import find_dotenv
from fastapi import Depends
from pydantic import PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=find_dotenv(), extra="ignore")

    project_name: str = "Simple Inventory"

    # api_prefix: str = "/api/v1"
    api_prefix: str = ""
    cors_origins: List[str] = [
        "http://localhost:3000",
    ]

    root_username: str = "straw"
    root_password: str = "root"

    cookie_key: str = "simple_inventory"
    jwt_alg: str = "HS256"
    jwt_key: str
    max_age: int = 2592000  # 30 days in seconds

    csv_encoding: str = "cp1250"
    csv_delimiter: str = ";"
    csv_headers: List[str] = [
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

    max_image_size: int = 2_000_000  # bytes = 2 MB

    smtp_enabled: bool = False
    smtp_host: str = ""
    smtp_port: int = 0
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_tls: bool = True

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str
    postgres_password: str
    postgres_db: str

    @computed_field
    @property
    def postgres_dsn(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            username=self.postgres_user,
            password=self.postgres_password,
            host=self.postgres_host,
            port=self.postgres_port,
            path=self.postgres_db,
        )

    minio_host: str
    minio_port: int
    minio_root_user: str
    minio_root_password: str


settings = Settings()

SettingsDep = Annotated[Settings, Depends(lambda: settings)]

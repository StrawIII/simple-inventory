from typing import Annotated, List

from fastapi import Depends
from pydantic import PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    project_name: str = "Simple Inventory"

    api_prefix: str = "/api/v1"
    cors_origins: List[str] = [
        "http://localhost:3000",
    ]

    cookie_key: str = "simple_inventory"
    jwt_alg: str = "HS256"
    jwt_key: str = "secret"

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

    smtp_host: str = ""
    smtp_port: int = 0
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_tls: bool = True

    @computed_field
    @property
    def smtp(self) -> dict:
        return {}

    # TODO move to .env
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_db: str = "simple_inventory"

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

    # MINIO_SERVER: str
    # MINIO_PORT: int
    # MINIO_USER: str
    # MINIO_PASSWORD: str

    # class Config:
    #     env_file: str = find_dotenv()


settings = Settings()

SettingsDep = Annotated[Settings, Depends(lambda: settings)]

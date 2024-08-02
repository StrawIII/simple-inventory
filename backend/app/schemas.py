from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


# TODO implement "unhealthy" status (e.g., connectiong to database failed)
class Health(BaseModel):
    status: Literal["healthy", "unhealthy"]
    timestamp: datetime


class UserCreds(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    is_admin: bool = False


class UserDelete(BaseModel):
    username: str


class ItemCreateBulk(BaseModel):
    # item_type: str = Field(alias="Typ")
    external_id: str = Field(alias="Inv. číslo")
    name: str = Field(alias="Název")
    # serial_number: str = Field("", alias="Výr. číslo")
    # inclusion_date: datetime = Field(alias="Dat. zařazení")
    # ns: int = Field(alias="NS")
    # location_id: str = Field(alias="Kód umístění")
    location: str = Field(alias="Název umístění")
    # classification: str = Field(alias="Klasifikace")
    # initial_accounting_price: float = Field(alias="Vstupní účetní cena")
    # residual_price: float = Field(alias="Zůst. cena")
    comment: str = Field(alias="Poznámka")
    # tangible_deduction: bool = Field(alias="Hmot. odp.")

    # @field_validator("inclusion_date", mode="before")
    # def format_date(cls, v: str):
    #     try:
    #         return datetime.strptime(v, r"%d.%m.%Y")
    #     except ValueError:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail=f"Invalid date format: '{v}'. Expected date format: DD.MM.YYYY",
    #         )

    # @field_validator("initial_accounting_price", "residual_price", mode="before")
    # def format_price(cls, v: str):
    #     try:
    #         return float(re.sub(r"\s+", "", v).replace(",", "."))
    #     except ValueError:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail=f"Invalid number format: '{v}'. Expected number format: '1 234,56'",
    #         )

    # @field_validator("tangible_deduction", mode="before")
    # def tangible_deduction_validator(cls, v: str):
    #     if v == "ANO":
    #         return True

    #     if v == "NE":
    #         return False

    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail=f"Invalid value for 'Hmot. odp.': '{v}'. Expected 'ANO' or 'NE'.",
    #     )


class ItemCreate(BaseModel):
    name: str
    comment: Optional[str] = None
    location: Optional[str] = None
    location_comment: Optional[str] = None


class ItemUpdate(BaseModel):
    name: str
    comment: Optional[str] = None
    location: Optional[str] = None
    location_comment: Optional[str] = None


class BorrowRequest(BaseModel):
    item_id: int
    timestamp_from: datetime
    timestamp_to: datetime

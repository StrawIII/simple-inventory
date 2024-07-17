from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr


# TODO implement "unhealthy" status (e.g., connectiong to database failed)
class Health(BaseModel):
    status: Literal["healthy", "unhealthy"]
    timestamp: datetime


class UserCreds(BaseModel):
    email: EmailStr
    password: str


class UserBase(BaseModel):
    email: EmailStr


class ItemBase(BaseModel):
    pass


class ItemFromFile(ItemBase):
    item_type: str = Field(alias="Typ")
    id: str = Field(alias="Inv. číslo")
    name: str = Field(alias="Název")
    serial_number: str = Field("", alias="Výr. číslo")
    inclusion_date: datetime = Field(alias="Dat. zařazení")
    ns: int = Field(alias="NS")
    location_id: str = Field(alias="Kód umístění")
    location_name: str = Field(alias="Název umístění")
    classification: str = Field(alias="Klasifikace")
    initial_accounting_price: float = Field(alias="Vstupní účetní cena")
    residual_price: float = Field(alias="Zůst. cena")
    comment: str = Field(alias="Poznámka")
    tangible_deduction: bool = Field(alias="Hmot. odp.")

    @field_validator("inclusion_date", mode="before")
    def format_date(cls, v: str):
        try:
            return datetime.strptime(v, r"%d.%m.%Y")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid date format: '{v}'. Expected date format: DD.MM.YYYY",
            )

    @field_validator("initial_accounting_price", "residual_price", mode="before")
    def format_price(cls, v: str):
        try:
            float(re.sub(r"\s+", "", v).replace(",", "."))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid number format: '{v}'. Expected number format: '1 234,56'",
            )

    @field_validator("tangible_deduction", mode="before")
    def tangible_deduction_validator(cls, v: str):
        if v == "ANO":
            return True

        if v == "NE":
            return False

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid value for 'Hmot. odp.': '{v}'. Expected 'ANO' or 'NE'.",
        )


class ItemFromWeb(ItemBase):
    pass


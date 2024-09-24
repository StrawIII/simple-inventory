from datetime import datetime

from sqlalchemy import TIMESTAMP, Boolean, ForeignKey, Integer, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(Text, unique=True)
    email: Mapped[str] = mapped_column(Text, unique=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    hashed_password: Mapped[str] = mapped_column(Text)
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        default=func.now(),
        onupdate=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=func.now())


class Item(Base):
    __tablename__ = "item"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_id: Mapped[str] = mapped_column(Text, nullable=True, unique=True)
    name: Mapped[str] = mapped_column(Text)
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    status: Mapped[str] = mapped_column(
        ForeignKey("item_status.name"),
        default="AVAILABLE",
    )
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    location: Mapped[str] = mapped_column(Text)
    location_comment: Mapped[str] = mapped_column(Text, nullable=True)
    image: Mapped[str] = mapped_column(Text, nullable=True, unique=True)


class Borrow(Base):
    __tablename__ = "borrow"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    item_id: Mapped[int] = mapped_column(ForeignKey("item.id"))
    status: Mapped[str] = mapped_column(
        ForeignKey("borrow_status.name"),
        default="PENDING",
    )
    timestamp_from: Mapped[datetime] = mapped_column(TIMESTAMP)
    timestamp_to: Mapped[datetime] = mapped_column(TIMESTAMP)


class ItemStatus(Base):
    __tablename__ = "item_status"

    name: Mapped[str] = mapped_column(Text, primary_key=True)


class BorrowStatus(Base):
    __tablename__ = "borrow_status"

    name: Mapped[str] = mapped_column(Text, primary_key=True)

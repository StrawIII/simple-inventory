from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"
    # __table_args__ = {"schema": "simple_inventory"}  # docs recommend default "public" schema

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    # admin: Mapped[bool] = mapped_column(Boolean, default=False)


class Item(Base):
    __tablename__ = "item"

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    owner: Mapped[int] = mapped_column(ForeignKey("user.id"))
    comment: Mapped[str] = mapped_column(Text)
    location: Mapped[str] = mapped_column(String(255))
    location_comment: Mapped[str] = mapped_column(Text)

from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Base, User

engine = create_engine(str(settings.postgres_dsn), echo=True)

Base.metadata.create_all(engine)

with Session(engine) as session:
    print("adding user")
    roman = User(id=16, email="roman16.seiner@fs.cvut.cz")
    cyril = User(id=15, email="cyril15@fs.cvut.cz")
    # session.add(roman)
    # session.add_all([roman, cyril])
    session.commit()


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

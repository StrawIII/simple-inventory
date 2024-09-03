import subprocess
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.routers import auth, borrows, health, items, users
from app.config import settings
from app.db import engine
from app.security import verify_user
from app.startup import creata_root_user, create_item_statuses


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[FastAPI, None]:
    subprocess.run(["alembic", "upgrade", "head"], check=True)

    with Session(engine) as session:
        creata_root_user(db=session, settings=settings)
        create_item_statuses(db=session, settings=settings)
        # TODO: add create_borrow_status

    yield


app = FastAPI(title=settings.project_name, lifespan=lifespan)
# ! should not be needed when running behind a reverse proxy like nginx
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

protected_api_router = APIRouter(dependencies=[Depends(verify_user)])
protected_api_router.include_router(items.router, prefix="/items", tags=["Items"])
protected_api_router.include_router(borrows.router, prefix="/borrows", tags=["Borrows"])
protected_api_router.include_router(users.router, prefix="/users", tags=["Users"])

unprotected_api_router = APIRouter(tags=["Unprotected"])
unprotected_api_router.include_router(health.router, prefix="/health")
unprotected_api_router.include_router(auth.router, prefix="/auth")


app.include_router(protected_api_router, prefix=settings.api_prefix)
app.include_router(unprotected_api_router, prefix=settings.api_prefix)

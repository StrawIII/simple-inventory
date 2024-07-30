from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, borrows, health, items, users
from app.config import settings
from app.security import verify_access_token

app = FastAPI(title=settings.project_name)
# should not be needed when running behind a reverse proxy like nginx
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

protected_api_router = APIRouter(dependencies=[Depends(verify_access_token)])
protected_api_router.include_router(auth.router, prefix="/auth")
protected_api_router.include_router(items.router, prefix="/items")
protected_api_router.include_router(borrows.router, prefix="/borrows")
protected_api_router.include_router(users.router, prefix="/users")

unprotected_api_router = APIRouter()
unprotected_api_router.include_router(health.router, prefix="/health")


app.include_router(protected_api_router, prefix=settings.api_prefix)
app.include_router(unprotected_api_router, prefix=settings.api_prefix)

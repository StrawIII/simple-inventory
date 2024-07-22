from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, health, items
from app.config import settings

app = FastAPI(title=settings.project_name)  # add settings as DI

# should not be needed when running behind a reverse proxy like nginx
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health")
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(items.router, prefix="/items")


app.include_router(api_router, prefix=settings.api_prefix)

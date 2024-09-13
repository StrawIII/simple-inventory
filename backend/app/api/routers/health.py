from datetime import datetime

from fastapi import APIRouter

from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("")
def index() -> Health:
    return Health(status="healthy", timestamp=datetime.now())

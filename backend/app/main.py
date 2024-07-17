from csv import DictReader

from fastapi import APIRouter, FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, health
from app.config import settings

app = FastAPI(title=settings.project_name)

api_v1_router = APIRouter()
api_v1_router.include_router(health.router, prefix="/health")
api_v1_router.include_router(auth.router, prefix="/auth")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_v1_router, prefix=settings.api_prefix)


# TODO move/remove all routes below
@app.post("/file")
def put_files(upload_file: UploadFile):
    data = upload_file.file.read().decode("cp1250").splitlines()

    reader = DictReader(data, delimiter=";")
    print(reader.fieldnames)

    return {"data": reader.fieldnames}


@app.get("/api/v1/hello")
def hello():
    return "/api/v1/hello"

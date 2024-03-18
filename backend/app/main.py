from csv import DictReader

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routers import auth, health
from app.core.config import settings

allowed_origins = ['']

app = FastAPI(
	title=settings.PROJECT_NAME,
	openapi_url='/openapi.json',
)


app.add_middleware(
	CORSMiddleware,
	allow_origins=['*'],
	allow_credentials=True,
	allow_methods=['*'],
	allow_headers=['*'],
)

app.include_router(health.router)
app.include_router(auth.router)


@app.post('/file')
def put_files(upload_file: UploadFile):
	data = upload_file.file.read().decode('cp1250').split('\n')

	reader = DictReader(data, delimiter=';')
	print(reader.fieldnames)

	return {'data': reader.fieldnames}

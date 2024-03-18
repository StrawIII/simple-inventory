from datetime import datetime

from pydantic import BaseModel


class Health(BaseModel):
	status: str = 'healthy'
	timestamp: datetime

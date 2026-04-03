"""Request/response logging model"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RequestLog(BaseModel):
    id: Optional[str] = None
    endpoint: str
    method: str
    request_body: Optional[dict] = None
    response_body: Optional[dict] = None
    status_code: int = 200
    timestamp: str = ""

    def __init__(self, **data):
        super().__init__(**data)
        if not self.timestamp:
            self.timestamp = datetime.utcnow().isoformat()

"""Health assistant API routes"""
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.assistant_service import get_health_response

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat(req: ChatRequest):
    """Get health advice based on symptoms"""
    response = get_health_response(req.message)
    return response

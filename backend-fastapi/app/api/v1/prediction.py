"""Prediction API routes — ML-based wait time and demand prediction"""
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ml_model import predict_wait_time, predict_demand

router = APIRouter()


class WaitTimePredictionRequest(BaseModel):
    doctor_id: str
    queue_length: int = 0
    avg_consultation_time: int = 15  # minutes


class DemandPredictionRequest(BaseModel):
    hospital_id: str
    day_of_week: int = 0  # 0=Monday
    hour: int = 10


@router.post("/wait-time")
async def predict_wait(req: WaitTimePredictionRequest):
    """Predict estimated wait time for a patient"""
    result = predict_wait_time(req.doctor_id, req.queue_length, req.avg_consultation_time)
    return result


@router.post("/demand")
async def predict_hospital_demand(req: DemandPredictionRequest):
    """Predict hospital demand for a given time"""
    result = predict_demand(req.hospital_id, req.day_of_week, req.hour)
    return result

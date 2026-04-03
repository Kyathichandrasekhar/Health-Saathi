"""Prediction request/response schemas"""
from pydantic import BaseModel


class WaitTimePrediction(BaseModel):
    doctor_id: str
    estimated_wait_minutes: int
    queue_length: int
    confidence: float = 0.85


class DemandPrediction(BaseModel):
    hospital_id: str
    predicted_patients: int
    demand_level: str = "moderate"  # low, moderate, high

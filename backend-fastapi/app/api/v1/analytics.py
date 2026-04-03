"""Analytics API routes — hospital stats and insights"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/hospital/{hospital_id}/stats")
async def get_hospital_stats(hospital_id: str):
    """Get analytics/stats for a hospital"""
    # Placeholder — connect to real data in production
    return {
        "hospital_id": hospital_id,
        "avg_wait_time": 22,
        "total_patients_today": 45,
        "peak_hours": ["10:00 AM", "02:00 PM"],
        "avg_rating": 4.5,
    }


@router.get("/trends")
async def get_trends():
    """Get overall trends across hospitals"""
    return {
        "busiest_day": "Monday",
        "avg_patients_per_day": 120,
        "top_specialties": ["General", "Cardiology", "Orthopedics"],
    }

"""ML model service — wait time and demand prediction (placeholder for real ML)"""


def predict_wait_time(doctor_id: str, queue_length: int, avg_consultation_time: int = 15) -> dict:
    """Predict estimated wait time based on queue and consultation time"""
    # Simple heuristic; replace with trained model in production
    estimated_wait = queue_length * avg_consultation_time
    return {
        "doctor_id": doctor_id,
        "estimated_wait_minutes": estimated_wait,
        "queue_length": queue_length,
        "confidence": 0.85 if queue_length > 0 else 0.95,
    }


def predict_demand(hospital_id: str, day_of_week: int = 0, hour: int = 10) -> dict:
    """Predict hospital demand based on day/time patterns"""
    # Simple rule-based; replace with ML model in production
    base_demand = 30
    # Mondays and Tuesdays are busiest
    day_multiplier = 1.3 if day_of_week in [0, 1] else 1.0
    # Peak hours: 10-12 and 14-16
    hour_multiplier = 1.5 if 10 <= hour <= 12 or 14 <= hour <= 16 else 1.0

    predicted = int(base_demand * day_multiplier * hour_multiplier)
    demand_level = "high" if predicted > 50 else "moderate" if predicted > 30 else "low"

    return {
        "hospital_id": hospital_id,
        "predicted_patients": predicted,
        "demand_level": demand_level,
        "day_of_week": day_of_week,
        "hour": hour,
    }

"""General helper utilities"""
from datetime import datetime


def get_current_timestamp() -> str:
    return datetime.utcnow().isoformat()

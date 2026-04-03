"""
Smart Hospital — FastAPI AI Backend
Entry point for AI services (assistant, prediction, analytics)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Import API routes
from app.api.v1 import assistant, prediction, analytics

app = FastAPI(
    title="Health Saathi AI API",
    description="Smart Hospital AI Services — Assistant, Prediction, Analytics",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include AI route modules
app.include_router(assistant.router, prefix="/api/v1/assistant", tags=["Health Assistant"])
app.include_router(prediction.router, prefix="/api/v1/prediction", tags=["Prediction"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Health Saathi AI API (FastAPI)"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)

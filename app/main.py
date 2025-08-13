import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.database import create_tables
from datetime import datetime

app = FastAPI(
    title="Leave Management System",
    description="Mini Leave Management System MVP for startup with 50 employees",
    version="1.0.0"
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

allowed_origins = ["*"] if ENVIRONMENT == "development" else [FRONTEND_URL, "https://*.railway.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={
            "error": "Validation Error",
            "detail": str(exc),
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.get("/api/v1/health")
async def health_check():
    try:
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
            "environment": ENVIRONMENT,
            "service": "leave-management-backend"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@app.get("/health")
async def simple_health():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    try:
        create_tables()
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
        print("🔄 App will continue without database (will retry on first request)")

app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Leave Management System API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
        "simple_health": "/health"
    }



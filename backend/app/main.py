from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import aqi, routines, coach, impact, community, profile, alerts
from app.db.init_db import init_database

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent Hyperlocal GenAI Assistant for Proactive Smog Defense and Low-Emission Living."
)

# Initialize database schema and vector seeds
@app.on_event("startup")
def on_startup():
    try:
        init_database()
    except Exception as e:
        print(f"Database initialization notice: {e}")

# Enable CORS for Next.js frontend and mobile clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(aqi.router, prefix="/api/v1/aqi", tags=["Air Quality & Forecasting"])
app.include_router(routines.router, prefix="/api/v1/routines", tags=["Personalized Daily Routines"])
app.include_router(coach.router, prefix="/api/v1/chat", tags=["Grounded GenAI Coach"])
app.include_router(impact.router, prefix="/api/v1/impact", tags=["Deterministic Impact Engine"])
app.include_router(community.router, prefix="/api/v1/community", tags=["Community & Neighborhood Hub"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["Household & Lifestyle Profile"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Proactive Alert Pipeline"])

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

@app.get("/healthz")
def health_check():
    return {"status": "healthy"}

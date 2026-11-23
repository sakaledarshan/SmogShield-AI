"""
SQLAlchemy Models for SmogShield AI.
Matches PostgreSQL DDL from Section 8 of the PRD:
- users
- household_profiles
- aqi_snapshots
- routine_recommendations
- impact_logs
- community_reports
- rag_guidelines (with vector embeddings)
"""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, Float, Integer, DateTime, Date, Text, ForeignKey
)
from sqlalchemy.orm import relationship
from app.db.session import Base

class UserModel(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("HouseholdProfileModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    routines = relationship("RoutineRecommendationModel", back_populates="user", cascade="all, delete-orphan")
    impact_logs = relationship("ImpactLogModel", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("CommunityReportModel", back_populates="reporter")

class HouseholdProfileModel(Base):
    __tablename__ = "household_profiles"

    profile_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    home_lat = Column(Float, nullable=False, default=28.6139)
    home_lng = Column(Float, nullable=False, default=77.2090)
    has_infants = Column(Boolean, default=False)
    has_elderly = Column(Boolean, default=False)
    has_respiratory_conditions = Column(Boolean, default=False)
    home_type = Column(String(50), default="apartment")  # apartment, detached_house, townhouse
    has_hepa_filter = Column(Boolean, default=False)
    primary_commute_mode = Column(String(50), default="transit")  # walk, two_wheeler, transit, car
    budget_tier = Column(String(20), default="low")  # zero_cost, low, medium, high

    user = relationship("UserModel", back_populates="profile")

class AQISnapshotModel(Base):
    __tablename__ = "aqi_snapshots"

    snapshot_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    aqi_value = Column(Integer, nullable=False)
    dominant_pollutant = Column(String(10), nullable=False)
    pm25_concentration = Column(Float, nullable=False)
    pm10_concentration = Column(Float, nullable=False)
    source_api = Column(String(50), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class RoutineRecommendationModel(Base):
    __tablename__ = "routine_recommendations"

    recommendation_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    time_block = Column(String(50), nullable=False)
    action_title = Column(String(255), nullable=False)
    action_description = Column(Text, nullable=False)
    estimated_pm25_reduction_ug = Column(Float, nullable=False)
    is_completed = Column(Boolean, default=False)

    user = relationship("UserModel", back_populates="routines")

class ImpactLogModel(Base):
    __tablename__ = "impact_logs"

    log_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    logged_date = Column(Date, nullable=False, default=datetime.utcnow)
    pm25_avoided_ug = Column(Float, default=0.0)
    co2e_avoided_kg = Column(Float, default=0.0)
    cost_saved_usd = Column(Float, default=0.0)

    user = relationship("UserModel", back_populates="impact_logs")

class CommunityReportModel(Base):
    __tablename__ = "community_reports"

    report_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reporter_id = Column(String(36), ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    reporter_name = Column(String(100), default="Community Citizen")
    fuzzed_lat = Column(Float, nullable=False)
    fuzzed_lng = Column(Float, nullable=False)
    hazard_type = Column(String(50), nullable=False)  # waste_burning, crop_burning, industrial_smoke, other
    description = Column(Text, nullable=False)
    image_url = Column(String(512), nullable=True)
    status = Column(String(20), default="pending")  # pending, verified, resolved
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("UserModel", back_populates="reports")

class RAGGuidelineModel(Base):
    __tablename__ = "rag_guidelines"

    guideline_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    framework = Column(String(100), nullable=False)  # WHO, EPA, ASHRAE, CDC
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # nursery, filtration, ventilation, mopping
    content = Column(Text, nullable=False)
    # Stored embedding vector as serialized floats for pgvector/sqlite
    embedding_json = Column(Text, nullable=True)

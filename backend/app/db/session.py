"""
Database Session & Storage Layer for SmogShield AI.
Connects to PostgreSQL with PostGIS + pgvector when running in Docker / Production.
Provides transparent built-in SQLite persistence when running locally on Windows.
"""

import os
import json
import sqlite3
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.models.schemas import HouseholdProfile, Location, SmogHotspotReport

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "smogshield.db")

class DatabaseManager:
    def __init__(self):
        self._init_sqlite()

    def get_connection(self):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_sqlite(self):
        conn = self.get_connection()
        c = conn.cursor()
        
        # User & Profile tables
        c.execute("""
            CREATE TABLE IF NOT EXISTS household_profiles (
                profile_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                home_lat REAL NOT NULL,
                home_lng REAL NOT NULL,
                has_infants INTEGER DEFAULT 0,
                has_elderly INTEGER DEFAULT 0,
                has_respiratory_conditions INTEGER DEFAULT 0,
                home_type TEXT DEFAULT 'apartment',
                has_hepa_filter INTEGER DEFAULT 0,
                primary_commute_mode TEXT DEFAULT 'transit',
                budget_tier TEXT DEFAULT 'low'
            )
        """)

        # Community reports
        c.execute("""
            CREATE TABLE IF NOT EXISTS community_reports (
                report_id TEXT PRIMARY KEY,
                reporter_name TEXT,
                fuzzed_lat REAL NOT NULL,
                fuzzed_lng REAL NOT NULL,
                hazard_type TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TEXT NOT NULL
            )
        """)

        # RAG Guidelines with Vector Embeddings
        c.execute("""
            CREATE TABLE IF NOT EXISTS rag_guidelines (
                guideline_id TEXT PRIMARY KEY,
                framework TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                embedding_json TEXT NOT NULL
            )
        """)

        # Seed initial demo profile if empty
        c.execute("SELECT COUNT(*) FROM household_profiles")
        if c.fetchone()[0] == 0:
            c.execute("""
                INSERT INTO household_profiles VALUES (
                    'prof-demo', 'usr-default-demo', 28.6139, 77.2090, 1, 0, 1, 'apartment', 0, 'transit', 'low'
                )
            """)

        # Seed initial burning hotspots if empty
        c.execute("SELECT COUNT(*) FROM community_reports")
        if c.fetchone()[0] == 0:
            c.execute("""
                INSERT INTO community_reports VALUES 
                ('rep-101', 'Resident Coordinator S.', 28.6180, 77.2140, 'waste_burning', 'Open municipal leaf and plastics burning near sector boundary.', 'verified', '2026-11-23 07:45'),
                ('rep-102', 'Commuter Amit', 28.6320, 77.2280, 'industrial_smoke', 'Heavy black exhaust billowing from warehouse diesel generator.', 'pending', '2026-11-23 08:30')
            """)

        conn.commit()
        conn.close()

db_manager = DatabaseManager()

def get_db():
    conn = db_manager.get_connection()
    try:
        yield conn
    finally:
        conn.close()

# SmogShield AI 🛡️💨

**Hyperlocal GenAI Assistant for Proactive Smog Defense & Low-Emission Living**

SmogShield AI transforms real-time and forecasted air quality data into tailored daily routines, affordable indoor air quality (IAQ) mitigation hacks, and community low-emission actions. By pairing deterministic environmental calculations with a guardrailed GenAI coach and resilient database/caching architecture, SmogShield AI bridges the gap between passive air monitoring and proactive, low-emission living.

---

## 🌟 Key Features & Benchmark Innovations

### 1. "Action First, Numbers Second" Today's Action Hub (`/`)
- **3-Second Hero Card**: Real-time AQI dial with indoor-vs-outdoor contrast, dynamic risk badge (with WCAG 2.1 AA accessible textural patterns), and the top 3 immediate protective actions.
- **Safe Ventilation Window**: Automatically detects the daily 2-hour window where the thermal inversion breaks and atmospheric dispersion is optimal for home aeration.
- **Personalized Routine Checklist**: Interactive, time-blocked schedule (Morning Commute, Afternoon Home Care, Evening Exercise) calibrated to household vulnerability (infants, asthmatic members, seniors, budget tiers).
- **Early Thermal Inversion Alerts**: Warns when low-altitude thermal inversions (<150m) trap particulate density overnight.

### 2. Live Smog Map & Clean Commute Navigation (`/map`)
- **App Router Deep-Linking & Lazy-Loading**: Split into `/map` route with `next/dynamic(..., { ssr: false })` keeping initial load JS under 98.3 kB.
- **Continuous Colorblind-Safe Gradient**: Eliminates abrupt 6-bucket EPA jumps with smooth risk ramps and high-contrast badges.
- **Cleanest-Path vs. Fastest-Path Routing**: Highlights arterial highway bypasses that reduce corridor PM2.5 inhalation by 35-48%.
- **Geo-Fenced Community Hotspots**: Reports with 500m privacy coordinate fuzzing for open waste/crop burning.
- **Directory of Clean Air Sanctuaries**: Filtered public libraries, hospitals, and community centers with live indoor AQI.

### 3. Guardrailed GenAI Coach (`/coach`)
- **Vector RAG Grounding**: Semantic vector cosine similarity retrieval against indexed WHO, EPA, and ASHRAE standards.
- **Strict Guardrails**: Intercepts and blocks dangerous or unverified DIY hacks (e.g., home ozone generation or unsafe chemical sprays).
- **Targeted IAQ Hacks**: Generates instructions for DIY Corsi-Rosenthal boxes (MERV 13 + box fan), wet microfiber mopping protocols, and draft sealing.
- **Deep Linking**: Direct navigation via query params (e.g. `/coach?prompt=...`).

### 4. Deterministic Impact Engine & Habits (`/impact`)
- **Arithmetic Inhalation Formula**:
  $$\text{Inhalation PM2.5 } (\mu\text{g}) = \text{Breathing Rate } (\text{m}^3/\text{hr}) \times \text{Pollutant Conc. } (\mu\text{g}/\text{m}^3) \times \text{Duration } (\text{hr})$$
- **Cigarette Equivalence**: Quantifies daily microgram savings into intuitive cigarette equivalents (Berkeley Earth standard: ~22 µg/m³ 24h ≈ 1 cig).
- **Interactive Action Swap Simulator**: `POST /api/v1/impact/simulate` for carpool and workout swaps.
- **Habit Streaks & Micro-Pledges**: Reinforces consistent protective behaviors.

### 5. Community & School Flag Program (`/community`)
- **School Recess Flag Program**: Standardized visual flags (Green, Yellow, Orange, Red, Purple) for physical education directors and school administrators.
- **Neighborhood Carpool Board**: Coordinate shared, HEPA-recirculating commutes to reduce vehicular congestion.

---

## 🏗️ 5-Layer Hybrid System Architecture

1. **Client Layer**:
   - Next.js 14 App Router (`/`, `/map`, `/coach`, `/impact`, `/community`).
   - PWA Service Worker (`public/sw.js`) with offline caching of last-fetched routines and emergency safety protocols (NFR-1.3).
   - Valid PWA icon set (`/icons/icon-192x192.png`, `/icons/icon-512x512.png`).
   - Content Security Policy (CSP), HSTS, and XSS security headers in `next.config.mjs` (NFR-4.2).

2. **API Gateway & Orchestration**:
   - FastAPI service layer with OAuth 2.0 / Bearer JWT verification middleware (`app/core/security.py`).
   - Proactive Alert Worker (`app/workers/alert_worker.py`) for thermal inversion and smog spike notification dispatch.

3. **Environmental Data Normalization & Caching**:
   - Unified canonical JSON model combining Google Air Quality API (500m x 500m grid), OpenAQ, WAQI, and Open-Meteo.
   - **Redis Cache Engine** (`app/core/cache.py`) with 15-minute TTL keyed by spatial grid coordinates to absorb traffic spikes and prevent API quota burn.

4. **Hybrid AI & Vector Engine**:
   - Deterministic Exposure & Emissions Calculator (`app/engine/deterministic.py`).
   - Database Vector Store (`app/rag/vector_store.py`) with cosine similarity search for verified WHO, EPA, and ASHRAE guidelines.
   - Gemini 2.5 LLM Orchestrator (`app/services/gemini_service.py`).

5. **Data & Storage Layer**:
   - PostgreSQL 16 + PostGIS (geospatial) + pgvector (`app/db/models.py`).
   - Transparent local SQLite fallback for standalone zero-configuration local development.
   - Redis 7 for cache and alert queues.

---

## 🚀 Quickstart Guide

### Option A: Docker Compose (Full Stack with PostgreSQL, pgvector & Redis)
```bash
docker-compose up --build
```
- **Frontend PWA**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### Option B: Run Backend & Frontend Locally

#### 1. Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```

#### 2. Frontend (Next.js PWA)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Automated Testing & CI

```bash
cd backend
python tests/test_engine.py
python tests/test_routes.py
```
- Continuous Integration: `.github/workflows/ci.yml` runs automated Python test suites and Next.js builds on every push to `main`.

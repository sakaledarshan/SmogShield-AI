# SmogShield AI 🛡️💨

**Hyperlocal GenAI Assistant for Proactive Smog Defense & Low-Emission Living**

SmogShield AI transforms real-time and forecasted air quality data into tailored daily routines, affordable indoor air quality (IAQ) mitigation hacks, and community low-emission actions. By pairing deterministic environmental calculations with a guardrailed GenAI coach, SmogShield AI bridges the gap between passive air monitoring and proactive, low-emission living.

---

## 🌟 Key Features & Benchmark Innovations

### 1. "Action First, Numbers Second" Today's Action Hub
- **3-Second Hero Card**: Real-time AQI dial with indoor-vs-outdoor contrast, dynamic risk badge (with WCAG 2.1 AA accessible textural patterns), and the top 3 immediate protective actions.
- **Safe Ventilation Window**: Automatically detects the daily 2-hour window where the thermal inversion breaks and atmospheric dispersion is optimal for home aeration.
- **Personalized Routine Checklist**: Interactive, time-blocked schedule (Morning Commute, Afternoon Home Care, Evening Exercise) calibrated to household vulnerability (infants, asthmatic members, seniors, budget tiers).
- **Early Thermal Inversion Alerts**: Warns when low-altitude thermal inversions (<150m) trap particulate density overnight.

### 2. Live Smog Map & Clean Commute Navigation
- **Continuous Colorblind-Safe Gradient**: Eliminates abrupt 6-bucket EPA jumps with smooth risk ramps and high-contrast badges.
- **Cleanest-Path vs. Fastest-Path Routing**: Highlights arterial highway bypasses that reduce corridor PM2.5 inhalation by 35-48%.
- **Geo-Fenced Community Hotspots**: Reports with 500m privacy coordinate fuzzing for open waste/crop burning.
- **Directory of Clean Air Sanctuaries**: Filtered public libraries, hospitals, and community centers with live indoor AQI.

### 3. Guardrailed GenAI Coach (WHO & EPA Grounded)
- **Pre-Loaded Context**: Synchronized with live ambient metrics, inversion height, and household profile parameters.
- **Strict Guardrails**: Intercepts and blocks dangerous or unverified DIY hacks (e.g., home ozone generation or unsafe chemical sprays).
- **Targeted IAQ Hacks**: Generates instructions for DIY Corsi-Rosenthal boxes (MERV 13 + box fan), wet microfiber mopping protocols, and draft sealing.
- **Non-Diagnostic Medical Disclaimers**: Affixes clear guidance separating environmental lifestyle advice from clinical prescriptions.

### 4. Deterministic Impact Engine & Habits
- **Arithmetic Inhalation Formula**:
  $$\text{Inhalation PM2.5 } (\mu\text{g}) = \text{Breathing Rate } (\text{m}^3/\text{hr}) \times \text{Pollutant Conc. } (\mu\text{g}/\text{m}^3) \times \text{Duration } (\text{hr})$$
- **Cigarette Equivalence**: Quantifies daily microgram savings into intuitive cigarette equivalents (Berkeley Earth standard: ~22 µg/m³ 24h ≈ 1 cig).
- **CO2e & NOx Emission Savings**: Calculates tailpipe avoidance from carpooling or transit swaps.
- **Habit Streaks & Micro-Pledges**: Reinforces consistent protective behaviors.

### 5. Community & School Flag Program
- **School Recess Flag Program**: Instant visual flags (Green, Yellow, Orange, Red, Purple) for physical education directors and school administrators.
- **Neighborhood Carpool Board**: Coordinate shared, HEPA-recirculating commutes to reduce vehicular congestion.

---

## 🏗️ 5-Layer System Architecture

1. **Client Layer**: Next.js 14 (React 18+, TypeScript, Tailwind CSS), Progressive Web App (PWA) with offline caching.
2. **API Gateway & Orchestration**: FastAPI service layer with Pydantic validation, CORS, and rate limiting.
3. **Environmental Data Normalization Layer**: Unified canonical schema combining Google Air Quality API (500m x 500m grid), OpenAQ, WAQI, and Open-Meteo thermal inversion indicators with a 15-minute TTL cache.
4. **Hybrid AI & Deterministic Engine**:
   - Deterministic Exposure & Emissions Calculator (pure Python).
   - RAG Knowledge Base with indexed WHO, EPA, and ASHRAE 62.2 standards.
   - Gemini 2.5 LLM Orchestrator with structured JSON outputs and fallback rule engine.
5. **Data & Storage Layer**: PostgreSQL + PostGIS (geospatial), pgvector (RAG embeddings), and Redis (cache & queue).

---

## 🚀 Quickstart Guide

### Option A: Run Backend & Frontend Locally

#### 1. Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
Backend will be live at: `http://localhost:8000`  
Interactive OpenAPI Docs: `http://localhost:8000/docs`

#### 2. Frontend (Next.js PWA)
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at: `http://localhost:3000`

---

### Option B: Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 API Endpoints

- `GET /api/v1/aqi/current?lat=28.6139&lng=77.2090`: Real-time normalized AQI, dominant pollutant, safe ventilation window, and inversion alert.
- `GET /api/v1/aqi/forecast?lat=28.6139&lng=77.2090`: 96-hour continuous hourly AQI forecast timeline.
- `POST /api/v1/routines/daily`: Time-blocked personal smog defense routine.
- `POST /api/v1/chat/coach`: RAG-grounded conversational AI coach with guardrails.
- `POST /api/v1/impact/simulate`: Deterministic calculator for action swaps (carpools, workout shifts, filtration).
- `GET /api/v1/impact/ledger`: Weekly cumulative PM2.5 avoidance, CO2e savings, and habit streaks.
- `GET /api/v1/community/hotspots`: List verified and pending smog burning hotspots.
- `POST /api/v1/community/hotspots`: Report new hotspot with ~500m coordinate privacy fuzzing.
- `GET /api/v1/community/recess-flags`: School air quality recess flag statuses.
- `GET /api/v1/community/sanctuaries`: Verified clean-air sanctuaries directory.

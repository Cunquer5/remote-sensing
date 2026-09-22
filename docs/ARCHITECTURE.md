# CaneSense AI - System Architecture

## Overview

CaneSense AI is a full-stack precision agriculture platform built with modern web technologies and remote sensing capabilities.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CANESENSE AI ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                       FRONTEND (React)                         │    │
│  │  • Dashboard & Analytics                                      │    │
│  │  • GIS Map Interface (Mapbox GL JS)                           │    │
│  │  • Field Intelligence Panels                                  │    │
│  │  • Time-Series Visualizations                                 │    │
│  │  • Data Source Documentation                                  │    │
│  │  • CaneSense Copilot (AI Assistant)                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ↕ (REST API)                               │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    BACKEND API (Express.js)                    │    │
│  │  • Dashboard Summary Endpoint                                  │    │
│  │  • Field Data API                                             │    │
│  │  • Vegetation Indices Service                                 │    │
│  │  • Irrigation Advisory Engine                                 │    │
│  │  • Time-Series Data Retrieval                                 │    │
│  │  • Data Sources Catalog                                       │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ↕                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │              REMOTE SENSING PROCESSING LAYER                   │    │
│  │  • Satellite Data Access (GEE API)                             │    │
│  │  • Feature Engineering                                         │    │
│  │  • Cloud Filtering & QA                                        │    │
│  │  • Temporal Compositing                                        │    │
│  │  • Vegetation Index Calculation                                │    │
│  │  • ML Model Inference                                          │    │
│  │  • Irrigation Advisory Generation                              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ↕                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                 DATA SOURCES & SERVICES                         │    │
│  │  • Sentinel-1 & Sentinel-2 (Copernicus / ESA)                 │    │
│  │  • Landsat 8/9 (USGS / EROS)                                  │    │
│  │  • Google Earth Engine (Satellite Data Platform)               │    │
│  │  • Weather / Rainfall (IMD / MERRA-2)                          │    │
│  │  • Evapotranspiration (FAO WaPOR)                              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              ↕                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │          SPATIAL DATABASE & DATA STORAGE (PostGIS)             │    │
│  │  • Field Geometries & Boundaries                               │    │
│  │  • Classification Results                                      │    │
│  │  • Time-Series Observations                                    │    │
│  │  • Metadata & Quality Flags                                    │    │
│  │  • Cache (Redis)                                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Descriptions

### Frontend (React + TypeScript)

**Technology Stack:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Mapbox GL JS for GIS mapping
- Recharts/Chart.js for data visualization
- React Router for navigation
- Axios for HTTP requests

**Key Components:**
- `pages/`: Main application pages (Dashboard, MapExplorer, FieldIntelligence, etc.)
- `components/`: Reusable UI components (layout, dashboard cards, charts)
- `maps/`: GIS map integration and controls
- `services/`: API client services
- `hooks/`: Custom React hooks for data fetching and state
- `types/`: TypeScript type definitions for domain models
- `utils/`: Helper functions and utilities

**Pages:**
1. **LandingPage** - Hero section with CTAs
2. **DashboardPage** - Executive summary with key metrics
3. **MapExplorerPage** - GIS interface for Baitul study area
4. **FieldIntelligencePage** - Detailed field analysis
5. **DataSourcesPage** - Data source documentation
6. **SettingsPage** - Application configuration

### Backend API (Express.js + TypeScript)

**Technology Stack:**
- Express.js for REST API
- TypeScript for type safety
- PostgreSQL + PostGIS for spatial data
- Google Earth Engine API for satellite data
- Redis for caching

**Main Routes:**
- `GET /api` - API information
- `GET /api/dashboard` - Dashboard summary
- `GET /api/fields` - Field list
- `GET /api/fields/:id` - Field details
- `GET /api/indices` - Vegetation indices
- `GET /api/advisory` - Irrigation advisories
- `GET /api/data-sources` - Data source specs

### Remote Sensing Processing Layer

**Responsibilities:**
1. **Data Access**: Retrieve satellite imagery from GEE/Copernicus
2. **Quality Control**: Filter clouds and low-quality observations
3. **Feature Extraction**: Calculate vegetation indices and spectral features
4. **Temporal Analysis**: Composite multi-temporal data
5. **ML Classification**: Sugarcane detection, growth stage, stress assessment
6. **Advisory Generation**: Rule-based + AI irrigation recommendations

**ML Models:**
- Crop Classification: Random Forest / XGBoost / SVM
- Growth Stage Detection: Time-series ML / LSTM
- Moisture Stress Detection: Ensemble method combining multiple indices
- ML Model Selection: Configurable via settings

### Spatial Database (PostGIS)

**Core Tables:**
- `fields` - Field geometries and properties
- `classifications` - Crop type classifications
- `vegetation_indices` - Time-series spectral indices
- `growth_stages` - Stage classifications
- `stress_analysis` - Moisture stress scores
- `irrigation_advisory` - Recommendations
- `time_series_data` - Temporal observations
- `metadata` - Data quality flags

**Spatial Capabilities:**
- GIS geometry storage and querying
- Spatial indexing for performance
- Area calculations
- Overlay analysis
- Buffer operations

### Study Area Definition

**Geographic Focus:** Baitul (Betul) District, Madhya Pradesh, India

```
Center: 21.75°N, 76.2°E
Bounding Box:
  North: 22.2°N
  South: 21.3°N
  East: 76.8°E
  West: 75.6°E
Total Area: 10,043 km²
```

All data processing and analysis is scoped to this region using spatial filters.

## Data Flow

### 1. Satellite Data Pipeline

```
GEE Sentinel-2 Collection
       ↓
    Cloud Filter (QA60 band)
       ↓
   Crop Classification
       ↓
  Sugarcane Field Mask
       ↓
Extract Spectral Features
       ↓
Calculate Vegetation Indices
    (NDVI, NDMI, NDWI, EVI, etc.)
       ↓
Temporal Compositing
    (5-day / 10-day windows)
       ↓
Store in PostGIS
       ↓
Trigger ML Analysis
```

### 2. ML Analysis Pipeline

```
Vegetation Indices
   + SAR Features
   + Temporal Data
   + Weather Context
       ↓
Feature Normalization
       ↓
Model Inference
   (Crop Classification)
       ↓
   Growth Stage Detection
   (Phenology Monitoring)
       ↓
   Moisture Stress Detection
   (Composite Scoring)
       ↓
Generate Irrigation Advisory
   (Rule-based + AI)
       ↓
Store Results & Confidence Scores
       ↓
Visualize in Frontend
```

### 3. User Request Flow

```
User Action (Frontend)
       ↓
REST API Call (Axios)
       ↓
Express Route Handler
       ↓
Query PostGIS Database
       ↓
Format Response
       ↓
Cache in Redis (if applicable)
       ↓
Return JSON to Frontend
       ↓
React State Update & Render
```

## Demo Mode

During development/prototyping, the application operates in **DEMO MODE**:

- All satellite data is simulated and clearly labeled as `DEMO DATA`
- Field geometries are realistic GeoJSON for UI testing
- Results show realistic values but are not from live satellite processing
- All API responses include `isDemo: true` flag
- UI displays prominent `🏷️ DEMO DATA` badges

**Switching to Production:**
1. Configure GEE project ID and credentials
2. Set up PostgreSQL with real data
3. Connect to live Copernicus/USGS APIs
4. Deploy ML models (local or cloud inference)
5. Update environment variables
6. Set `IS_DEMO_MODE=false`

## Deployment Architecture

### Development
```
Frontend Dev Server (Vite)
  ↓ (port 3000)
Backend Dev Server (Node)
  ↓ (port 5000)
PostGIS (localhost)
  ↓
GEE Sandbox
```

### Production
```
Frontend (Static Build)
  → CDN / Web Server
    ↓
Backend API (Node.js Cluster)
  → Load Balancer
    ↓
PostgreSQL + PostGIS (Managed DB)
  ↓
Google Earth Engine (Cloud)
  ↓
Cache (Redis)
```

## Security Considerations

1. **API Authentication**: JWT tokens for user management (Phase 2)
2. **Rate Limiting**: Prevent API abuse
3. **CORS**: Restrict frontend origin
4. **Environment Variables**: Sensitive data in .env
5. **SQL Injection**: Parameterized queries via ORM
6. **GEE Credentials**: Stored securely on backend
7. **HTTPS**: Enforce in production

## Scalability

- **Horizontal**: Node.js processes behind load balancer
- **Vertical**: Database connection pooling
- **Caching**: Redis for frequently accessed data
- **Asynchronous**: Queue long-running satellite processing tasks
- **Microservices** (Future): Separate ML processing service

## Monitoring & Logging

- Pino logger for structured logging
- Request/response logging middleware
- Error tracking (Sentry integration planned)
- Performance monitoring (APM planned)
- Database query logging
- API response time tracking

## Technology Rationale

| Component | Choice | Reason |
|-----------|--------|--------|
| Frontend Framework | React | Ecosystem, component reusability, strong typing with TS |
| Styling | Tailwind CSS | Rapid UI development, consistent design system |
| Mapping | Mapbox GL JS | High performance, WebGL rendering, vectortile support |
| Backend | Express.js | Lightweight, fast, large ecosystem |
| Database | PostgreSQL + PostGIS | Mature, spatial capabilities, open source |
| Satellite Data | Google Earth Engine | Free high-resolution data, processing pipeline, Python API |
| Cache | Redis | Fast in-memory store, session management |
| Deployment | Docker / Cloud | Reproducible, scalable, managed services available |

## Future Enhancements (Phase 2+)

1. **Real-time Notifications**: Field alerts when stress thresholds crossed
2. **Mobile Application**: Native iOS/Android farmer interface
3. **Predictive Forecasting**: ML models for future stress prediction
4. **Yield Estimation**: Integrate yield models with growth stage & stress data
5. **Irrigation Optimization**: Genetic algorithms for optimal irrigation scheduling
6. **Multi-season Analysis**: Year-over-year comparison and trend analysis
7. **Advanced UI**: 3D field visualization, drone imagery integration
8. **Market Integration**: Crop prices, climate data, market predictions
9. **IoT Integration**: Ground sensors, weather stations, soil moisture probes
10. **API Ecosystem**: Third-party integrations for farm management systems

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-21  
**Status:** DEMO MODE

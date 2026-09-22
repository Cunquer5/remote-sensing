# CaneSense AI

**AI-Native Sugarcane Crop Intelligence for Crop Mapping, Moisture-Stress Detection & Irrigation Advisory**

## Project Overview

CaneSense AI is a modern, research-grade remote sensing and artificial intelligence platform designed specifically for sugarcane monitoring in **Baitul (Betul), Madhya Pradesh, India**.

The system leverages satellite imagery (Sentinel-1/2, Landsat) and machine learning to automatically:

1. **Detect and map sugarcane crop fields**
2. **Identify sugarcane growth/development stages**
3. **Detect crop moisture and water stress**
4. **Monitor crop health using satellite-derived indicators (NDVI, NDMI, NDWI)**
5. **Generate stage-specific irrigation advisories**
6. **Visualize spatial maps and field-level insights**
7. **Provide historical and time-series analysis**
8. **Convert satellite observations into actionable agricultural recommendations**

## Key Features

### 1. Satellite Data Integration
- **Sentinel-2** optical imagery (10m resolution)
- **Sentinel-1** SAR data (cloud-independent monitoring)
- **Landsat 8/9** for historical analysis
- **Google Earth Engine** processing pipeline
- Weather & precipitation data integration

### 2. AI/ML Pipeline
- Spectral feature extraction
- Crop type classification (sugarcane vs. non-sugarcane)
- Growth stage identification
- Moisture stress detection & classification
- Confidence scores & uncertainty quantification

### 3. Core Intelligence Modules
- **Crop Detection**: Automatic sugarcane field mapping with confidence
- **Growth Stage Identification**: Classification into establishment, vegetative, grand growth, maturity stages
- **Moisture Stress Engine**: 0-100 stress score with 5-level classification (no stress → severe stress)
- **Irrigation Advisory**: Rule-based + AI-assisted recommendations with reasoning
- **Field-Level Dashboard**: Comprehensive field intelligence with time-series analysis

### 4. User Interface
- **Landing Page**: Hero section with CTA
- **Dashboard**: Executive summary of study area
- **Map Explorer**: GIS-style interface with Baitul study boundary
- **Field Intelligence**: Detailed field analysis and recommendations
- **Time Series**: Temporal trend analysis
- **Data Sources**: Transparency about data provenance
- **CaneSense Copilot**: AI assistant for natural language queries
- **Settings**: User preferences and configuration

## Study Area

**Primary Focus:** Baitul (Betul) District, Madhya Pradesh, India

The application operates exclusively on the selected Baitul study region. Map is centered on Baitul with:
- Study area boundary layer
- Agricultural land classification
- Sugarcane field mapping
- Area of Interest (AOI) selection capability

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Mapbox GL JS** for GIS mapping
- **Chart.js / Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostGIS** for spatial database (PostgreSQL + GIS extension)
- **Google Earth Engine API** for satellite data
- **scikit-learn / TensorFlow** integration for ML models
- **Redis** for caching

### Data & Processing
- **Google Earth Engine** satellite data access
- **Python** microservices for ML/remote sensing
- **PostGIS/PostgreSQL** for spatial data storage
- **REST API** for frontend-backend communication

## Project Structure

```
CaneSense AI/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── maps/            # Mapbox integration
│   │   ├── context/         # React Context for state management
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                  # Express.js API server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/      # Business logic
│   │   ├── services/        # Data services
│   │   ├── models/          # Database schemas
│   │   ├── ml/              # ML/AI pipeline
│   │   ├── gee/             # Google Earth Engine integration
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Express app setup
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── data/
│   └── demo/                # Demo/test data (clearly marked)
│
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATA_SOURCES.md
│   ├── API_REFERENCE.md
│   └── ML_PIPELINE.md
│
└── README.md

```

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+ (for ML services)
- PostgreSQL 12+ with PostGIS extension
- Google Earth Engine account (for satellite data)

### Installation

```bash
# Install all dependencies
npm run install:all

# Install frontend dependencies
npm install --prefix frontend

# Install backend dependencies
npm install --prefix backend
```

### Environment Setup

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/canesense
GEE_PROJECT_ID=your-gee-project-id
MAPBOX_TOKEN=your-mapbox-token
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your-mapbox-token
```

### Running the Application

**Development Mode (both frontend & backend)**
```bash
npm run dev
```

**Frontend Only**
```bash
npm run dev:frontend
```

**Backend Only**
```bash
npm run dev:backend
```

## Demo Data

⚠️ **IMPORTANT**: The initial version uses **DEMO DATA** clearly labeled as such. This allows testing of the complete UI/UX before live satellite data integration.

All demo data is marked with:
- `[DEMO DATA]` badges in the UI
- `isDemo: true` flags in API responses
- Clear data source attribution

Real satellite data will be connected via:
1. Google Earth Engine API integration
2. Copernicus data access
3. Custom remote sensing pipelines

## Data Sources Documentation

See [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) for:
- Sentinel-1 & Sentinel-2 specifications
- Landsat data details
- Weather data sources
- Soil/ET data integration points
- Data update frequencies

## ML/AI Pipeline

See [docs/ML_PIPELINE.md](docs/ML_PIPELINE.md) for:
- Feature engineering approach
- Model architectures
- Training data requirements
- Confidence score methodology
- Uncertainty quantification

## API Reference

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for:
- All REST endpoints
- Request/response schemas
- Authentication
- Rate limiting
- Error handling

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for:
- System design overview
- Data flow diagrams
- Database schema
- Deployment architecture

## Features Roadmap

### Phase 1 (MVP)
- ✅ Baitul study area mapping
- ✅ Sugarcane field detection
- ✅ Vegetation indices (NDVI, NDMI, NDWI)
- ✅ Moisture stress classification
- ✅ Growth stage detection
- ✅ Irrigation advisory engine
- ✅ Field intelligence dashboard
- ✅ Executive dashboard

### Phase 2
- Sentinel-1 SAR integration
- Weather/rainfall data
- Evapotranspiration data
- Advanced ML models
- Historical time-series
- CaneSense Copilot AI assistant
- Automated alerts

### Phase 3
- Field-level notifications
- Mobile farmer interface
- Predictive stress forecasting
- Yield-risk estimation
- Irrigation optimization
- Multi-season comparison

## Data Quality & Uncertainty

Every AI-generated output includes:
- ✅ Confidence scores
- ✅ Observation dates
- ✅ Data sources
- ✅ Quality indicators
- ✅ Cloud cover information

If data is insufficient, the system displays "Insufficient data" rather than generating unreliable results.

## Important Notes

### No Fake Data
This application does NOT invent satellite observations or fake accuracy metrics. All outputs are either:
1. Based on real processed satellite data
2. Clearly marked as DEMO DATA for UI/UX prototyping

### Scientific Rigor
- Stage boundaries are configurable, not hard-coded
- Confidence levels are always displayed
- Uncertainty is quantified
- Data provenance is transparent

### Regional Focus
CaneSense AI is **specifically designed for Baitul, Madhya Pradesh sugarcane monitoring**. It is not a generic worldwide agricultural dashboard.

## Contributing

Instructions for contributing will be added as the project develops.

## License

MIT License - See LICENSE file for details

## Contact & Support

For questions, issues, or contributions, please check the project documentation or create an issue in the repository.

---

**Built with ❤️ for precision agriculture and sustainable sugarcane farming.**

**CaneSense AI** — Satellite-powered intelligence for every stage of sugarcane growth.

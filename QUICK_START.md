# CaneSense AI - Quick Start (5 Minutes)

## 🚀 TL;DR - Get Running Immediately

```bash
# Navigate to project
cd "CaneSense AI"

# Install everything
npm run install:all

# Start both frontend and backend
npm run dev
```

That's it! Open http://localhost:3000

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** (included with Node.js)
- **Git** (optional, for version control)

## 🎯 Step-by-Step Startup

### 1. Install Dependencies (2 min)
```bash
cd "CaneSense AI"
npm run install:all
```

This installs packages for both frontend and backend.

### 2. Configuration (optional - not needed for demo)
Demo mode works out of the box! No configuration required.

To customize later:
- Frontend: `frontend/.env.local`
- Backend: `backend/.env`

### 3. Start Development Servers (1 min)
```bash
npm run dev
```

Wait for:
```
  VITE v5.0.0 ready in 500 ms
  ➜  Local:   http://localhost:3000/
  
  Server running on http://localhost:5000
```

### 4. Open Application (1 min)
- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## 🎮 What to Explore First

### Landing Page
1. Go to http://localhost:3000
2. See hero section with CaneSense AI branding
3. Click "Explore Baitul Study Area" button

### Dashboard
1. View executive summary with key metrics
2. See stress distribution charts
3. View high-priority fields list
4. Check NDVI and NDMI averages

### Field Intelligence
1. Click on a field in dashboard
2. View detailed moisture stress analysis
3. See irrigation advisory with reasoning
4. Check time-series data evolution

### Data Sources
1. Navigate to "Data Sources" in sidebar
2. View all satellite data specifications
3. See data pipeline explanation
4. Check integration information

## 📁 Browse the Code

### Frontend Components
```
frontend/src/
├── pages/
│   ├── LandingPage.tsx         ← Hero section
│   ├── DashboardPage.tsx        ← Main dashboard
│   ├── FieldIntelligencePage.tsx ← Field details
│   └── DataSourcesPage.tsx      ← Documentation
├── components/
│   ├── layout/                  ← Sidebar, Header
│   └── dashboard/               ← Cards, Charts
└── types/index.ts               ← Type definitions
```

### Backend API
```
backend/src/
├── server.ts                    ← Express server
└── routes/
    ├── dashboard.ts             ← Summary endpoint
    ├── fields.ts                ← Field data
    ├── advisory.ts              ← Irrigation advisory
    └── dataSources.ts           ← Data specifications
```

## 🌐 API Testing

### Test Dashboard Endpoint
```bash
curl http://localhost:5000/api/dashboard
```

### Test Fields Endpoint
```bash
curl http://localhost:5000/api/fields
```

### Test Field Details
```bash
curl http://localhost:5000/api/fields/BTL-001
```

### Test Advisory
```bash
curl http://localhost:5000/api/advisory?fieldId=BTL-001
```

## 📊 Demo Data Overview

**6 Sugarcane Fields Included:**
- BTL-001: High stress (requires irrigation)
- BTL-002: Low stress (no irrigation needed)
- BTL-003: Moderate stress (monitor)
- BTL-004: Critical stress (urgent)
- BTL-005: Moderate stress (prepare)
- BTL-006: Low stress (healthy)

**All marked as:** 🏷️ DEMO DATA

## 🔧 Common Tasks

### Stop Servers
```bash
# Press Ctrl+C in terminal
```

### Update Demo Data
Edit: `data/demo/demoData.ts`

Then restart: `npm run dev`

### Frontend Only (no backend needed)
```bash
npm run dev:frontend
# Opens http://localhost:3000
# Uses mock data from demoData.ts
```

### Backend Only
```bash
npm run dev:backend
# API available at http://localhost:5000
```

### Check Backend Health
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-21T10:30:00.000Z",
  "environment": "development",
  "mode": "DEMO DATA"
}
```

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Installation & setup |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) | Data integration |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | API endpoints |
| [docs/ML_PIPELINE.md](docs/ML_PIPELINE.md) | ML models & analysis |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# If port 3000 is taken:
npm run dev:frontend -- --port 3001

# If port 5000 is taken:
PORT=5001 npm run dev:backend
```

### npm install fails
```bash
# Clear cache and try again
npm cache clean --force
npm run install:all
```

### Module not found errors
```bash
# Reinstall from scratch
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

## 🎓 Learning Path

1. **Start Here**: Landing page (understand the project)
2. **Explore**: Dashboard (see the metrics)
3. **Dive Deep**: Field Intelligence (detailed analysis)
4. **Technical**: Data Sources (understand the data)
5. **Code**: Review `/frontend/src` and `/backend/src`
6. **Documentation**: Read `/docs` folder

## ✨ Key Features to Try

- 🗺️ **Interactive Dashboard** - Real-time metrics and visualizations
- 🌾 **Field Details** - Comprehensive analysis of each sugarcane field
- 💧 **Stress Analysis** - Moisture stress scoring and indicators
- 💦 **Irrigation Advisory** - AI recommendations with confidence
- 📈 **Time Series** - Field condition history and trends
- 📊 **Data Documentation** - Full transparency on data sources

## 🚀 Next Steps

### To Customize:
1. Modify demo data in `data/demo/demoData.ts`
2. Update colors in `frontend/tailwind.config.js`
3. Add new pages in `frontend/src/pages/`
4. Extend API routes in `backend/src/routes/`

### To Deploy:
1. Follow [GETTING_STARTED.md](GETTING_STARTED.md) for production setup
2. Configure `.env` files with real credentials
3. Connect to PostgreSQL + PostGIS database
4. Integrate with Google Earth Engine API
5. Deploy to your hosting platform

### To Integrate Real Data:
1. Set up Google Earth Engine account
2. Configure GEE credentials in backend
3. Connect to Copernicus/USGS APIs
4. Update data source endpoints
5. Depl oyment ML processing pipeline

## 💡 Tips

- **Demo Mode**: All data is simulated for testing
- **DEMO BADGES**: Look for 🏷️ badges throughout UI
- **Confidence Scores**: Every prediction shows confidence
- **Realistic Values**: Demo data looks authentic
- **Easy to Modify**: Change demo data, see results immediately

## 📞 Need Help?

1. Check documentation in `/docs` folder
2. Review code comments in source files
3. Read API reference in `docs/API_REFERENCE.md`
4. Check demo data structure in `data/demo/demoData.ts`

## 🎉 You're Ready!

Everything is set up to explore and develop with CaneSense AI.

**Start here:** `npm run dev` and open http://localhost:3000

---

**CaneSense AI** — Satellite-powered intelligence for every stage of sugarcane growth.

Built for Baitul, Madhya Pradesh sugarcane monitoring. 🌾

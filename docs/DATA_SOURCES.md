# CaneSense AI - Data Sources & Integration Guide

## Overview

CaneSense AI integrates multiple satellite imagery and environmental data sources to provide comprehensive sugarcane monitoring for Baitul, Madhya Pradesh.

## Primary Data Sources

### 1. Sentinel-2 (Optical Imagery)

**Provider:** European Space Agency (ESA) / Copernicus  
**Access:** Google Earth Engine, Copernicus Data Hub  
**Resolution:** 10-60m (band dependent)  
**Temporal Frequency:** 5 days (global, Sentinel-2A + 2B)  
**Cloud Cover:** Highly variable (monsoon area)  
**Coverage Status:** ✅ Available

**Relevant Bands for Sugarcane:**
- B2: Blue (490nm) - Atmospheric correction
- B3: Green (560nm) - GNDVI calculation
- B4: Red (665nm) - NDVI core
- B5: vegetation Red Edge (705nm) - Plant stress
- B6: Red Edge (740nm) - Chlorophyll
- B7: Red Edge (783nm) - LAI, biomass
- B8: NIR (842nm) - NDVI, vegetation vigor
- B8A: Narrow NIR (865nm) - Fine vegetation detail
- B11: SWIR 1 (1610nm) - Moisture content, NDMI
- B12: SWIR 2 (2190nm) - Crop stress, soil moisture

**Key Indices Calculated:**
- NDVI = (B8 - B4) / (B8 + B4) — Vegetation vigor
- NDMI = (B8 - B11) / (B8 + B11) — Canopy moisture
- NDWI = (B8 - B11) / (B8 + B11) — Water content
- EVI = 2.5 × (B8 - B4) / (B8 + 6×B4 - 7.5×B2 + 1) — Enhanced vegetation
- GNDVI = (B8 - B3) / (B8 + B3) — Green normalized
- SAVI = ((B8 - B4) / (B8 + B4 + 0.5)) × 1.5 — Soil-adjusted
- RED_EDGE_NDVI = (B8A - B5) / (B8A + B5) — Red-edge stress

**Integration:**
```javascript
// Google Earth Engine example
const s2Collection = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(bailtuAOI)
  .filterDate('2026-07-01', '2026-09-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));
```

### 2. Sentinel-1 (SAR - Synthetic Aperture Radar)

**Provider:** European Space Agency (ESA) / Copernicus  
**Access:** Google Earth Engine, Copernicus Data Hub  
**Resolution:** 10m  
**Temporal Frequency:** 6 days (ascending + descending)  
**Cloud Cover:** None (radar penetrates clouds)  
**Coverage Status:** ✅ Available

**Polarizations:**
- VV (Vertical-Vertical) — Crop structure, moisture
- VH (Vertical-Horizontal) — Volume scattering, biomass

**Key Metrics:**
- VV/VH Ratio — Crop moisture estimation
- Temporal coherence — Growth stage transitions
- Backscatter intensity — Biomass, LAI

**Use Cases:**
- Cloud-independent monitoring during monsoon
- Growth stage boundary detection
- Moisture stress complementary assessment
- SAR time-series phenology

**Integration:**
```javascript
const s1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(bailtuAOI)
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));
```

### 3. Landsat 8 & 9 (Thermal + SWIR)

**Provider:** United States Geological Survey (USGS) / EROS  
**Access:** Google Earth Engine, USGS EarthExplorer  
**Resolution:** 30m (optical), 100m (thermal)  
**Temporal Frequency:** 16 days (combined 8+9)  
**Cloud Cover:** Variable, often higher than Sentinel-2  
**Coverage Status:** ✅ Available

**Relevant Bands:**
- B1-B7: Standard optical (similar to Sentinel-2)
- B10: TIRS 1 (10.6-11.2 μm) — Land Surface Temperature
- B11: TIRS 2 (11.5-12.5 μm) — LST refinement

**Key Applications:**
- Land Surface Temperature (LST) for thermal stress
- Historical time-series (archives back to 1984)
- Long-baseline trend analysis
- Thermal stress supplementary assessment

**Integration:**
```javascript
const l8Collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(bailtuAOI)
  .filterDate('2026-07-01', '2026-09-30');
```

### 4. MODIS (Moderate Resolution Imaging Spectroradiometer)

**Provider:** NASA (Aqua/Terra satellites)  
**Access:** Google Earth Engine, NASA DAAC  
**Resolution:** 250m (daily)  
**Temporal Frequency:** Daily (near-global)  
**Cloud Cover:** Limited due to resolution  
**Coverage Status:** ✅ Available

**Products Used:**
- MOD13Q1 / MYD13Q1: Vegetation Indices (16-day composite)
- MOD11A2 / MYD11A2: Land Surface Temperature (8-day)
- MOD44B: Vegetation Continuous Fields

**Use Cases:**
- Regional context and validation
- Seasonal trends
- Large-scale drought monitoring
- Climate context

### 5. Weather & Precipitation

**Data Sources:**
1. **MERRA-2** (Modern-Era Retrospective for Research)
   - Resolution: ~27km
   - Variables: Precip, Temp, Humidity, Wind
   - Frequency: Hourly
   - Access: NASA GES DISC

2. **India Meteorological Department (IMD)**
   - Resolution: ~4km (Monsoon forecasts)
   - Variables: Rainfall, Temperature, Humidity
   - Frequency: Daily/Real-time
   - Access: IMD API

3. **NOAA Climate Prediction Center**
   - Seasonal forecasts
   - Climate indices

**Integration Example:**
```javascript
const rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterBounds(bailtuAOI)
  .filterDate('2026-07-01', '2026-09-30');
```

### 6. Evapotranspiration & Soil Moisture

**FAO WaPOR (Water Productivity Open Access Portal)**
- Spatial Resolution: 250m
- Temporal Resolution: Decadal (10-day)
- Variables: Total ET, Green ET, Net Primary Productivity
- Suitable for: Water balance, irrigation demand calculation

**Integration Framework:**
```
Water Balance = Rainfall - ET - ΔSoilMoisture
```

## Model Selection & ML Pipeline

### Crop Classification Models

**Available Models:**
1. **Random Forest** - Fast, interpretable
2. **XGBoost** - Gradient boosting, strong performance
3. **Support Vector Machine (SVM)** - Good with limited training data
4. **Gradient Boosting** - Robust, handles imbalance
5. **Neural Network** - Deep learning if abundant training data
6. **Ensemble** - Combine multiple models

**Model Selection Logic:**
```
IF training_data_available > 1000 samples:
  USE: XGBoost or Neural Network
ELSE:
  USE: SVM or Random Forest
```

### Growth Stage Detection

**Approach: Time-Series Phenology**

Combine temporal vegetation signatures:
1. NDVI time-series progression
2. Stage-specific NDVI ranges
3. Rate of change detection
4. Comparison with regional phenology models

**Stage Definitions (Sugarcane):**

| Stage | NDVI Range | Characteristics | Duration | Validation Indices |
|-------|-----------|-----------------|----------|-------------------|
| Establishment | 0.2-0.4 | Sparse canopy, emerging shoots | 60-80 days | Low LAI, visible soil |
| Early Vegetative | 0.4-0.6 | Tillering begins, canopy thickening | 60-90 days | Increasing tiller count |
| Tillering | 0.6-0.7 | Active tillering, canopy closure | 60-90 days | Peak LAI growth rate |
| Grand Growth | 0.7-0.8 | Peak biomass accumulation | 120-150 days | Maximum LAI, high ET |
| Maturity | 0.75-0.8 | Lignification, ripening | 60-90 days | NDVI plateau, declining NDMI |
| Harvest | <0.7 | Post-harvest field condition | Variable | Senescence patterns |

### Moisture Stress Detection

**Multi-Index Composite Approach:**

```
Stress Score = (0.30 × NDVI_stress + 
                0.35 × NDMI_stress + 
                0.20 × NDWI_stress + 
                0.15 × LST_stress) × 100
```

**Where:**
- Each metric normalized to 0-1 stress scale
- NDVI_stress = 1 - (NDVI / NDVI_expected)
- NDMI_stress = 1 - (NDMI / NDMI_healthy)
- Growth stage-specific expected values
- LST_stress adjusted for season/climate

**Classification Thresholds:**
- 0-20: No Stress
- 21-40: Low Stress  
- 41-60: Moderate Stress
- 61-80: High Stress
- 81-100: Severe Stress

## Data Quality & Uncertainty

### Quality Flags

Every observation includes:
- Cloud coverage percentage
- Sensor QA flags
- Data source reliability
- Confidence score (0-100%)
- Temporal gap from last valid observation

### Missing Data Handling

1. **Cloud Cover >50%**: Mark as low quality, consider for removal
2. **Temporal Gaps >30 days**: Flag for interpolation uncertainty
3. **Sensor Failures**: Use alternative data source if available
4. **Validation Data Unavailable**: Display "Insufficient data" rather than estimates

### Uncertainty Quantification

Each prediction includes confidence bounds:

```
Moisture Stress: 68 ± 12 points (68% confidence interval)
Recommendation Confidence: 84% ± 5%
```

## Data Pipeline Implementation

### Google Earth Engine Integration

```typescript
// CaneSense AI - GEE Processing Script Outline
const bailtuAOI = ee.Geometry.Polygon([[/* coordinates */]]);

// 1. Load Sentinel-2
const s2 = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(bailtuAOI)
  .filterDate('2026-07-01', '2026-09-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

// 2. Calculate indices
const indices = s2.map(function(image) {
  const ndvi = image.normalizedDifference(['B8', 'B4']);
  const ndmi = image.normalizedDifference(['B8', 'B11']);
  return image.addBands([ndvi.rename('NDVI'), 
                         ndmi.rename('NDMI')]);
});

// 3. Temporal compositing
const composite = indices.median();

// 4. ML classification (trained model)
const trained = classifier.train(trainingData, 'label', features);
const classified = composite.classify(trained);

// 5. Export to PostGIS/Cloud Storage
Export.image.toCloudStorage({
  image: classified,
  region: bailtuAOI,
  fileName: 'sugarcane_classification_2026_09_18'
});
```

### Backend Data Connection

```typescript
// Backend receives GEE output and stores in PostGIS
const geoJSON = fetchFromGEE('sugarcane_classification_2026_09_18');
const insertQuery = `
  INSERT INTO fields (geometry, crop_type, classification_confidence)
  VALUES (ST_GeomFromGeoJSON($1), $2, $3)
`;
```

## Data Refresh Schedule

| Data Source | Frequency | Latency |
|-------------|-----------|---------|
| Sentinel-2 | 5 days | 1-2 days |
| Sentinel-1 | 6 days | 1-2 days |
| Landsat 8/9 | 16 days | 2-3 days |
| Weather (IMD) | Daily | Same-day |
| MODIS VI | 16 days | 3-5 days |
| FAO WaPOR | Decadal | 10-15 days |

## Testing & Validation

### Demo Data Validation

Demo data includes:
- Realistic NDVI/NDMI ranges for sugarcane
- Authentic field geometries (sub-50ha typical)
- Representative stress patterns
- Plausible growth stage progression
- Realistic advisory recommendations

### Real Data Validation

When transitioning to live data:
1. Compare against ground-truth surveys
2. Validate classifications with farmer reports
3. Benchmark growth stage against phenology models
4. Test irrigation advisory accuracy

## Transitioning from Demo to Production

### Step 1: GEE Setup
```bash
pip install earthengine-api
earthengine authenticate  # Set up credentials
```

### Step 2: Configure Credentials
```env
GEE_PROJECT_ID=your-project-id
GEE_CREDENTIALS_PATH=./credentials.json
```

### Step 3: Deploy Processing Functions
```bash
# Deploy GEE processing scripts to production
gcloud functions deploy processSatelliteData --runtime python39
```

### Step 4: Connect Database
```bash
# Initialize PostGIS and schema
psql -U postgres -d canesense -f database/schema.sql
```

### Step 5: Verify Live Data
```bash
# Run diagnostic checks
npm run test:satellite-data
npm run test:ml-pipeline
npm run test:api-endpoints
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-21  
**Status:** DEMO MODE - Real data integration guide

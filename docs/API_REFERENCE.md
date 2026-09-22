# CaneSense AI - API Reference

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Dashboard Summary

**GET** `/dashboard`

Returns executive summary of Baitul study area.

**Response:**
```json
{
  "success": true,
  "data": {
    "studyAreaKm2": 10043,
    "sugarcaneAreaHa": 100.9,
    "sugarcaneAreaAcres": 249.2,
    "totalFields": 28,
    "healthyPercentage": 39,
    "stressedPercentage": 32,
    "severeStressFields": 9,
    "irrigationPriorityFields": 9,
    "averageNdvi": 0.72,
    "averageNdmi": 0.41,
    "latestObservationDate": "2026-09-18",
    "dataCoverage": 89,
    "isDemo": true
  },
  "timestamp": "2026-09-21T10:30:00.000Z"
}
```

### 2. Fields List

**GET** `/fields`

Returns list of all sugarcane fields.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "BTL-001",
      "cropType": "sugarcane",
      "cropConfidence": 94,
      "areaHa": 47.3,
      "growthStage": "grand_growth",
      "growthStageConfidence": 87,
      "moistureStressScore": 68,
      "moistureStressLevel": "high",
      "ndvi": 0.72,
      "ndmi": 0.31,
      "ndwi": 0.38,
      "lastObservationDate": "2026-09-18",
      "isDemo": true
    }
  ],
  "timestamp": "2026-09-21T10:30:00.000Z"
}
```

### 3. Field Details

**GET** `/fields/:id`

Returns detailed information for a specific field.

**Path Parameters:**
- `id`: Field ID (e.g., BTL-001)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "BTL-001",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[76.25, 21.80], ...]]
    },
    "cropType": "sugarcane",
    "cropConfidence": 94,
    "areaHa": 47.3,
    "areaAcres": 116.8,
    "lastObservationDate": "2026-09-18",
    "growthStage": "grand_growth",
    "growthStageConfidence": 87,
    "moistureStressScore": 68,
    "moistureStressLevel": "high",
    "ndvi": 0.72,
    "ndmi": 0.31,
    "ndwi": 0.38,
    "irrigationAdvisory": {
      "status": "required",
      "priority": "high",
      "reason": "High moisture stress...",
      "confidence": 84,
      "recommendation": "Irrigate within 2-3 days...",
      "estimatedWaterRequirement": 35
    },
    "dataQuality": "good",
    "cloudCover": 5,
    "daysInCurrentStage": 18,
    "isDemo": true
  },
  "timestamp": "2026-09-21T10:30:00.000Z"
}
```

### 4. Vegetation Indices

**GET** `/indices`

Returns vegetation indices for a field.

**Query Parameters:**
- `fieldId`: Field ID (default: BTL-001)

**Response:**
```json
{
  "success": true,
  "data": {
    "fieldId": "BTL-001",
    "ndvi": 0.72,
    "ndmi": 0.31,
    "ndwi": 0.38,
    "evi": 0.64,
    "savi": 0.68,
    "gndvi": 0.55,
    "lst": 38.2,
    "timestamp": "2026-09-18",
    "confidence": 87
  },
  "timestamp": "2026-09-21T10:30:00.000Z"
}
```

### 5. Irrigation Advisory

**GET** `/advisory`

Returns irrigation recommendation for a field.

**Query Parameters:**
- `fieldId`: Field ID (default: BTL-001)

**Response:**
```json
{
  "success": true,
  "data": {
    "fieldId": "BTL-001",
    "status": "required",
    "priority": "high",
    "recommendation": "Irrigate within 2-3 days. Apply 30-40mm water.",
    "reason": "High moisture stress detected during Grand Growth stage...",
    "confidence": 84,
    "estimatedWaterRequirement": 35,
    "dataTimestamp": "2026-09-18",
    "contributingIndicators": ["declining NDMI", "elevated stress score", "Grand Growth stage"]
  },
  "timestamp": "2026-09-21T10:30:00.000Z"
}
```

**Advisory Status Values:**
- `required` - Irrigation needed immediately
- `can_delay` - Can be postponed
- `monitor` - Monitor closely
- `not_required` - No immediate need

**Priority Values:**
- `critical` - Urgent
- `high` - Important
- `medium` - Moderate
- `low` - Low priority

### 6. Data Sources

**GET** `/data-sources`

Returns specifications of all data sources used.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Sentinel-2",
      "provider": "European Space Agency",
      "spatialResolution": "10m (optical), 20m (SWIR)",
      "temporalResolution": "5 days",
      "currentAvailability": "available",
      "lastUpdate": "2026-09-18"
    }
  ],
  "timestamp": "2026-09-21T10:30:00.000Z"
}
```

## Error Handling

**Standard Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad request
- `404` - Not found
- `500` - Server error

## Demo Mode Flag

All responses include `isDemo: true` when running in demo mode. This indicates:
- Data is simulated for UI/UX prototyping
- Not real satellite observations
- Suitable for development and testing

When transitioning to production:
1. Connect live GEE API
2. Install real PostgreSQL database
3. Deploy ML processing pipeline
4. Remove demo flag
5. Set `IS_DEMO_MODE=false` in environment

## Rate Limiting

Current implementation: No rate limiting (development mode)

Production recommendations:
- 100 requests per minute (authenticated)
- 10 requests per minute (unauthenticated)
- Per-IP rate limiting

## Authentication

Currently not implemented (development mode)

Production: JWT tokens required for all endpoints

## CORS

Configured to allow requests from frontend (localhost:3000 in dev)

Production: Restrict to allowed origins only

---

**API Version:** 1.0.0  
**Status:** DEMO MODE  
**Last Updated:** 2026-09-21

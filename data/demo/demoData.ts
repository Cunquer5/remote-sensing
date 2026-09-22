/**
 * Demo Data Generator for CaneSense AI
 * 
 * ⚠️ IMPORTANT: This data is CLEARLY MARKED as DEMO DATA
 * 
 * Used for UI/UX prototyping and testing before live satellite data integration.
 * Real satellite data will be connected via Google Earth Engine.
 */

import {
  CropField,
  GrowthStage,
  StressLevel,
  DashboardSummary,
  VegetationIndices,
  TimeSeriesDataPoint,
  SatelliteDataSpecification,
} from '../types';

// ============================================================================
// DEMO CROP FIELDS
// ============================================================================

export const DEMO_FIELDS: CropField[] = [
  {
    id: 'BTL-001',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.25, 21.80],
          [76.27, 21.80],
          [76.27, 21.78],
          [76.25, 21.78],
          [76.25, 21.80],
        ],
      ],
    },
    cropType: 'sugarcane',
    cropConfidence: 94,
    areaHa: 47.3,
    areaAcres: 116.8,
    lastObservationDate: '2026-09-18',
    growthStage: 'grand_growth',
    growthStageConfidence: 87,
    moistureStressScore: 68,
    moistureStressLevel: 'high',
    ndvi: 0.72,
    ndmi: 0.31,
    ndwi: 0.38,
    irrigationAdvisory: {
      status: 'required',
      priority: 'high',
      reason:
        'High moisture stress detected during the Grand Growth stage, combined with low recent rainfall and elevated estimated crop water demand.',
      confidence: 84,
      recommendation: 'Irrigate within 2-3 days. Apply 30-40mm water.',
      dataTimestamp: '2026-09-18',
      contributingIndicators: [
        'declining NDMI',
        'elevated stress score',
        'Grand Growth stage',
      ],
      estimatedWaterRequirement: 35,
    },
    dataQuality: 'good',
    cloudCover: 5,
    daysInCurrentStage: 18,
    isDemo: true,
  },
  {
    id: 'BTL-002',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.30, 21.82],
          [76.32, 21.82],
          [76.32, 21.80],
          [76.30, 21.80],
          [76.30, 21.82],
        ],
      ],
    },
    cropType: 'sugarcane',
    cropConfidence: 96,
    areaHa: 63.8,
    areaAcres: 157.6,
    lastObservationDate: '2026-09-18',
    growthStage: 'grand_growth',
    growthStageConfidence: 91,
    moistureStressScore: 32,
    moistureStressLevel: 'low',
    ndvi: 0.78,
    ndmi: 0.52,
    ndwi: 0.45,
    irrigationAdvisory: {
      status: 'can_delay',
      priority: 'low',
      reason:
        'Moderate to good canopy moisture levels detected. Recent rainfall adequate. Field shows healthy vegetation indices.',
      confidence: 88,
      recommendation: 'Irrigation can be delayed. Monitor in 7-10 days.',
      dataTimestamp: '2026-09-18',
      contributingIndicators: [
        'stable NDMI',
        'low stress score',
        'recent rainfall',
      ],
    },
    dataQuality: 'excellent',
    cloudCover: 2,
    daysInCurrentStage: 22,
    isDemo: true,
  },
  {
    id: 'BTL-003',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.18, 21.75],
          [76.20, 21.75],
          [76.20, 21.73],
          [76.18, 21.73],
          [76.18, 21.75],
        ],
      ],
    },
    cropType: 'sugarcane',
    cropConfidence: 91,
    areaHa: 54.2,
    areaAcres: 133.9,
    lastObservationDate: '2026-09-18',
    growthStage: 'maturity',
    growthStageConfidence: 85,
    moistureStressScore: 45,
    moistureStressLevel: 'moderate',
    ndvi: 0.75,
    ndmi: 0.42,
    ndwi: 0.41,
    irrigationAdvisory: {
      status: 'monitor',
      priority: 'medium',
      reason:
        'Moderate stress during maturity stage. Water demand is declining but field requires monitoring for stress progression.',
      confidence: 79,
      recommendation: 'Monitor field closely. Irrigate if stress increases.',
      dataTimestamp: '2026-09-18',
      contributingIndicators: [
        'moderate NDMI decline',
        'maturity stage approaching harvest',
      ],
    },
    dataQuality: 'good',
    cloudCover: 8,
    daysInCurrentStage: 35,
    isDemo: true,
  },
  {
    id: 'BTL-004',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.35, 21.70],
          [76.37, 21.70],
          [76.37, 21.68],
          [76.35, 21.68],
          [76.35, 21.70],
        ],
      ],
    },
    cropType: 'sugarcane',
    cropConfidence: 88,
    areaHa: 38.6,
    areaAcres: 95.3,
    lastObservationDate: '2026-09-18',
    growthStage: 'grand_growth',
    growthStageConfidence: 83,
    moistureStressScore: 78,
    moistureStressLevel: 'high',
    ndvi: 0.68,
    ndmi: 0.24,
    ndwi: 0.32,
    irrigationAdvisory: {
      status: 'required',
      priority: 'critical',
      reason:
        'Severe moisture stress indicators detected. Very low NDMI, declining vegetation condition. Critical water requirement.',
      confidence: 92,
      recommendation: 'URGENT: Irrigate immediately. Apply 40-50mm water.',
      dataTimestamp: '2026-09-18',
      contributingIndicators: [
        'very low NDMI',
        'declining NDVI',
        'high stress score',
        'Grand Growth stage',
      ],
      estimatedWaterRequirement: 45,
    },
    dataQuality: 'fair',
    cloudCover: 15,
    daysInCurrentStage: 20,
    isDemo: true,
  },
  {
    id: 'BTL-005',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.12, 21.82],
          [76.14, 21.82],
          [76.14, 21.80],
          [76.12, 21.80],
          [76.12, 21.82],
        ],
      ],
    },
    cropType: 'sugarcane',
    cropConfidence: 93,
    areaHa: 71.5,
    areaAcres: 176.6,
    lastObservationDate: '2026-09-18',
    growthStage: 'grand_growth',
    growthStageConfidence: 88,
    moistureStressScore: 42,
    moistureStressLevel: 'moderate',
    ndvi: 0.76,
    ndmi: 0.48,
    ndwi: 0.43,
    irrigationAdvisory: {
      status: 'monitor',
      priority: 'medium',
      reason:
        'Adequate moisture levels but approaching moderate stress. Regular monitoring recommended during this critical Grand Growth phase.',
      confidence: 86,
      recommendation: 'Monitor closely. Prepare for irrigation in 5-7 days.',
      dataTimestamp: '2026-09-18',
      contributingIndicators: [
        'stable NDMI',
        'Grand Growth phase',
        'moderate stress score',
      ],
    },
    dataQuality: 'good',
    cloudCover: 3,
    daysInCurrentStage: 19,
    isDemo: true,
  },
  {
    id: 'BTL-006',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [76.42, 21.78],
          [76.44, 21.78],
          [76.44, 21.76],
          [76.42, 21.76],
          [76.42, 21.78],
        ],
      ],
    },
    cropType: 'sugarcane',
    cropConfidence: 92,
    areaHa: 55.3,
    areaAcres: 136.6,
    lastObservationDate: '2026-09-18',
    growthStage: 'early_vegetative',
    growthStageConfidence: 81,
    moistureStressScore: 35,
    moistureStressLevel: 'low',
    ndvi: 0.62,
    ndmi: 0.55,
    ndwi: 0.52,
    irrigationAdvisory: {
      status: 'not_required',
      priority: 'low',
      reason:
        'Early vegetative stage with good soil moisture. Establishment establishment phase typically requires regular watering schedule but current moisture is adequate.',
      confidence: 82,
      recommendation: 'Continue management as planned. Next irrigation in 10-14 days.',
      dataTimestamp: '2026-09-18',
      contributingIndicators: [
        'early vegetative stage',
        'good soil moisture',
        'low stress score',
      ],
    },
    dataQuality: 'excellent',
    cloudCover: 1,
    daysInCurrentStage: 12,
    isDemo: true,
  },
];

// ============================================================================
// DEMO DASHBOARD SUMMARY
// ============================================================================

export const DEMO_DASHBOARD_SUMMARY: DashboardSummary = {
  studyAreaKm2: 10043,
  sugarcaneAreaHa: 100.9,
  sugarcaneAreaAcres: 249.2,
  totalFields: 28,
  healthyPercentage: 39,
  stressedPercentage: 32,
  severeStressFields: 9,
  irrigationPriorityFields: 9,
  averageNdvi: 0.72,
  averageNdmi: 0.41,
  latestObservationDate: '2026-09-18',
  dataCoverage: 89,
  isDemo: true,
};

// ============================================================================
// DEMO TIME SERIES DATA
// ============================================================================

export const DEMO_TIME_SERIES_BTL001: TimeSeriesDataPoint[] = [
  {
    date: '2026-07-15',
    ndvi: 0.42,
    ndmi: 0.65,
    ndwi: 0.58,
    rainfall: 15,
    et: 4.2,
    stressScore: 22,
    growthStage: 'establishment',
    cloudCover: 10,
  },
  {
    date: '2026-07-29',
    ndvi: 0.52,
    ndmi: 0.62,
    ndwi: 0.55,
    rainfall: 45,
    et: 4.8,
    stressScore: 28,
    growthStage: 'early_vegetative',
    cloudCover: 8,
  },
  {
    date: '2026-08-12',
    ndvi: 0.61,
    ndmi: 0.58,
    ndwi: 0.52,
    rainfall: 28,
    et: 5.1,
    stressScore: 35,
    growthStage: 'tillering',
    cloudCover: 12,
  },
  {
    date: '2026-08-26',
    ndvi: 0.68,
    ndmi: 0.48,
    ndwi: 0.45,
    rainfall: 8,
    et: 5.5,
    stressScore: 52,
    growthStage: 'grand_growth',
    cloudCover: 5,
  },
  {
    date: '2026-09-09',
    ndvi: 0.70,
    ndmi: 0.35,
    ndwi: 0.40,
    rainfall: 2,
    et: 5.2,
    stressScore: 62,
    growthStage: 'grand_growth',
    cloudCover: 3,
  },
  {
    date: '2026-09-18',
    ndvi: 0.72,
    ndmi: 0.31,
    ndwi: 0.38,
    rainfall: 0,
    et: 5.0,
    stressScore: 68,
    growthStage: 'grand_growth',
    cloudCover: 5,
  },
];

// ============================================================================
// DEMO VEGETATION INDICES
// ============================================================================

export const DEMO_VEGETATION_INDICES: VegetationIndices = {
  ndvi: 0.72,
  ndmi: 0.31,
  ndwi: 0.38,
  evi: 0.64,
  savi: 0.68,
  gndvi: 0.55,
  lst: 38.2, // degrees Celsius
  timestamp: '2026-09-18',
  confidence: 87,
};

// ============================================================================
// DEMO DATA SOURCES
// ============================================================================

export const DEMO_DATA_SOURCES: SatelliteDataSpecification[] = [
  {
    name: 'Sentinel-2',
    source: 'Copernicus / ESA',
    provider: 'European Space Agency',
    bands: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B11'],
    temporalResolution: '5 days',
    spatialResolution: '10m (optical), 20m (SWIR)',
    currentAvailability: 'available',
    lastUpdate: '2026-09-18',
    usageInPipeline: [
      'Spectral feature extraction',
      'Vegetation indices (NDVI, NDMI, NDWI, EVI)',
      'Red-edge analysis',
      'Crop classification',
      'Crop health monitoring',
    ],
    dataUrl: 'https://scihub.copernicus.eu/',
  },
  {
    name: 'Sentinel-1',
    source: 'Copernicus / ESA',
    provider: 'European Space Agency',
    bands: ['VV', 'VH'],
    temporalResolution: '6 days',
    spatialResolution: '10m',
    currentAvailability: 'available',
    lastUpdate: '2026-09-18',
    usageInPipeline: [
      'Cloud-independent monitoring',
      'Crop structural analysis',
      'Moisture indication',
      'Monsoon-period monitoring',
    ],
    dataUrl: 'https://scihub.copernicus.eu/',
  },
  {
    name: 'Landsat 8/9',
    source: 'USGS',
    provider: 'United States Geological Survey',
    bands: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10'],
    temporalResolution: '16 days (combined 8/9)',
    spatialResolution: '30m (optical), 100m (thermal)',
    currentAvailability: 'available',
    lastUpdate: '2026-09-20',
    usageInPipeline: [
      'Historical analysis',
      'Land surface temperature (LST)',
      'Long-term vegetation trends',
      'Supporting thermal stress analysis',
    ],
    dataUrl: 'https://www.usgs.gov/landsat/',
  },
  {
    name: 'Google Earth Engine',
    source: 'GEE / Google Cloud',
    provider: 'Google',
    bands: ['Multi-source'],
    temporalResolution: 'Real-time',
    spatialResolution: 'Variable by source',
    currentAvailability: 'available',
    lastUpdate: '2026-09-18',
    usageInPipeline: [
      'Data processing platform',
      'Temporal compositing',
      'Cloud filtering',
      'Index calculation',
      'Feature engineering',
    ],
    dataUrl: 'https://earthengine.google.com/',
  },
  {
    name: 'Weather / Rainfall Data',
    source: 'MERRA-2 / IMD',
    provider: 'NASA GMAO / India Meteorological Department',
    bands: ['Precipitation', 'Temperature', 'Humidity'],
    temporalResolution: 'Daily',
    spatialResolution: '~27km (MERRA-2), ~4km (IMD)',
    currentAvailability: 'available',
    lastUpdate: '2026-09-18',
    usageInPipeline: [
      'Water balance analysis',
      'Irrigation context',
      'Stress factor analysis',
      'Advisory generation',
    ],
    dataUrl: 'https://imd.gov.in/',
  },
  {
    name: 'FAO WaPOR',
    source: 'FAO / World Bank',
    provider: 'Food and Agriculture Organization',
    bands: ['ET', 'Productivity'],
    temporalResolution: 'Decadal',
    spatialResolution: '250m',
    currentAvailability: 'limited',
    lastUpdate: '2026-09-01',
    usageInPipeline: [
      'Evapotranspiration estimation',
      'Water productivity analysis',
      'Seasonal water demand',
    ],
    dataUrl: 'https://www.fao.org/wapor/',
  },
];

// ============================================================================
// DEMO METADATA
// ============================================================================

export const DEMO_DATA_BADGE = '🏷️ DEMO DATA';
export const DEMO_DATA_DISCLAIMER =
  'This demo uses simulated satellite data for UI/UX prototyping. Real satellite data integration will be configured via Google Earth Engine, Copernicus API, and weather services.';

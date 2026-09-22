/**
 * CaneSense AI - Backend Demo Data
 * Simulated satellite observations and agricultural data for Baitul study area
 */

// Dashboard summary
export const dashboardSummaryData = {
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

// Sample fields data
export const fieldsData = [
  {
    id: 'BTL-001',
    cropType: 'sugarcane',
    cropConfidence: 94,
    areaHa: 47.3,
    growthStage: 'grand_growth',
    growthStageConfidence: 87,
    moistureStressScore: 68,
    moistureStressLevel: 'high',
    ndvi: 0.72,
    ndmi: 0.31,
    ndwi: 0.38,
    lastObservationDate: '2026-09-18',
    isDemo: true,
  },
  {
    id: 'BTL-002',
    cropType: 'sugarcane',
    cropConfidence: 96,
    areaHa: 63.8,
    growthStage: 'grand_growth',
    growthStageConfidence: 91,
    moistureStressScore: 32,
    moistureStressLevel: 'low',
    ndvi: 0.78,
    ndmi: 0.52,
    ndwi: 0.45,
    lastObservationDate: '2026-09-18',
    isDemo: true,
  },
];

// Data sources specifications
export const dataSourcesData = [
  {
    name: 'Sentinel-2',
    provider: 'European Space Agency',
    spatialResolution: '10m (optical), 20m (SWIR)',
    temporalResolution: '5 days',
    currentAvailability: 'available',
    lastUpdate: '2026-09-18',
  },
  {
    name: 'Sentinel-1',
    provider: 'European Space Agency',
    spatialResolution: '10m',
    temporalResolution: '6 days',
    currentAvailability: 'available',
    lastUpdate: '2026-09-18',
  },
  {
    name: 'Landsat 8/9',
    provider: 'United States Geological Survey',
    spatialResolution: '30m (optical), 100m (thermal)',
    temporalResolution: '16 days (combined)',
    currentAvailability: 'available',
    lastUpdate: '2026-09-20',
  },
];

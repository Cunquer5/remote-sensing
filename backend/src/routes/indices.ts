import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/indices
 * Returns vegetation indices for sugarcane fields
 */
router.get('/', (req: Request, res: Response) => {
  const fieldId = req.query.fieldId || 'BTL-001';

  res.json({
    success: true,
    data: {
      fieldId,
      ndvi: 0.72,
      ndmi: 0.31,
      ndwi: 0.38,
      evi: 0.64,
      savi: 0.68,
      gndvi: 0.55,
      lst: 38.2,
      timestamp: '2026-09-18',
      confidence: 87,
      note: 'NDVI: Vegetation Vigour, NDMI: Canopy Moisture, NDWI: Water Content, EVI: Enhanced Vegetation, SAVI: Soil-Adjusted, GNDVI: Green Normalized, LST: Land Surface Temperature',
    },
    timestamp: new Date().toISOString(),
    isDemo: true,
  });
});

export default router;

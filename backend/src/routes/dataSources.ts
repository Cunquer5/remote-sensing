import { Router, Request, Response } from 'express';
import { dataSourcesData } from '../services/demoData';

const router = Router();

/**
 * GET /api/data-sources
 * Returns data source specifications and availability
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: dataSourcesData,
    timestamp: new Date().toISOString(),
    isDemo: true,
    note: 'All satellite data, weather data, and processing specifications for CaneSense AI',
  });
});

export default router;

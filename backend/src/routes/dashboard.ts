import { Router, Request, Response } from 'express';
import { dashboardSummaryData } from '../services/demoData';

const router = Router();

/**
 * GET /api/dashboard
 * Returns executive dashboard summary for Baitul study area
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: dashboardSummaryData,
    timestamp: new Date().toISOString(),
    isDemo: true,
  });
});

export default router;

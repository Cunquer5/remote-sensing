import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/advisory
 * Returns irrigation advisories for sugarcane fields
 */
router.get('/', (req: Request, res: Response) => {
  const fieldId = req.query.fieldId || 'BTL-001';

  res.json({
    success: true,
    data: {
      fieldId,
      status: 'required',
      priority: 'high',
      recommendation: 'Irrigate within 2-3 days. Apply 30-40mm water.',
      reason:
        'High moisture stress detected during the Grand Growth stage, combined with low recent rainfall and elevated estimated crop water demand.',
      confidence: 84,
      estimatedWaterRequirement: 35,
      dataTimestamp: '2026-09-18',
      contributingIndicators: ['declining NDMI', 'elevated stress score', 'Grand Growth stage'],
    },
    timestamp: new Date().toISOString(),
    isDemo: true,
  });
});

export default router;

import { Router, Request, Response } from 'express';
import { fieldsData } from '../services/demoData';

const router = Router();

/**
 * GET /api/fields
 * Returns list of all sugarcane fields in Baitul study area
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: fieldsData,
    timestamp: new Date().toISOString(),
    isDemo: true,
  });
});

/**
 * GET /api/fields/:id
 * Returns detailed information about a specific field
 */
router.get('/:id', (req: Request, res: Response) => {
  const field = fieldsData.find((f) => f.id === req.params.id);

  if (!field) {
    return res.status(404).json({
      success: false,
      error: `Field ${req.params.id} not found`,
    });
  }

  res.json({
    success: true,
    data: field,
    timestamp: new Date().toISOString(),
    isDemo: true,
  });
});

export default router;

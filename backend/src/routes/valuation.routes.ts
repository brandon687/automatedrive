import { Router } from 'express';
import {
  getValuationByVIN,
  getSubmissionValuation,
  refreshSubmissionValuation,
  getMarketAnalytics
} from '../controllers/valuation.controller';

const router = Router();

// Get valuation by VIN
router.get('/:vin', getValuationByVIN);

// Get valuation for a submission
router.get('/submission/:submissionId', getSubmissionValuation);

// Refresh valuation for a submission
router.post('/submission/:submissionId/refresh', refreshSubmissionValuation);

// Admin analytics
router.get('/admin/analytics', getMarketAnalytics);

export default router;

import express from 'express';
import * as marketResearchController from '../controllers/market-research.controller';

const router = express.Router();

/**
 * POST /api/market-research/analyze
 * Perform comprehensive market research for a vehicle
 */
router.post('/analyze', marketResearchController.analyzeVehicle);

/**
 * GET /api/market-research/:submissionId
 * Get stored market research for a submission
 */
router.get('/:submissionId', marketResearchController.getMarketResearch);

/**
 * POST /api/market-research/:submissionId/refresh
 * Refresh market research with latest data
 */
router.post('/:submissionId/refresh', marketResearchController.refreshMarketResearch);

/**
 * GET /api/market-research/sources
 * Get available market research sources and their status
 */
router.get('/sources', marketResearchController.getAvailableSources);

export default router;

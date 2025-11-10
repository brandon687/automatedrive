import { Router } from 'express';
import {
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  forwardToDealer,
  exportSubmissionMedia,
  generateShareableLink,
  getSubmissionPricing,
  refreshSubmissionPricing,
  getDashboardStats,
} from '../controllers/admin.controller';

const router = Router();

// TODO: Add authentication middleware here
// router.use(authMiddleware);

// Get all submissions with filtering
router.get('/submissions', getAllSubmissions);

// Get submission by ID
router.get('/submissions/:id', getSubmissionById);

// Update submission status
router.patch('/submissions/:id/status', updateSubmissionStatus);

// Forward submission to dealer
router.post('/submissions/:id/forward', forwardToDealer);

// Generate shareable link
router.get('/submissions/:id/share', generateShareableLink);

// Export submission media as ZIP
router.get('/submissions/:id/export', exportSubmissionMedia);

// Get detailed pricing data with state-by-state breakdown
router.get('/submissions/:id/pricing', getSubmissionPricing);

// Manually refresh pricing research
router.post('/submissions/:id/refresh-pricing', refreshSubmissionPricing);

// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

export default router;

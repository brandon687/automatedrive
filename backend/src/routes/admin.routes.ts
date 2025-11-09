import { Router } from 'express';
import {
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  forwardToDealer,
  exportSubmissionMedia,
  generateShareableLink,
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

export default router;

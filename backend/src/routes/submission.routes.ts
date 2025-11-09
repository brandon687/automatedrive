import { Router } from 'express';
import { mediaUpload } from '../middleware/upload.middleware';
import {
  createSubmission,
  getSubmissionByTicket,
  uploadMedia,
  downloadMedia,
} from '../controllers/submission.controller';

const router = Router();

// Create new submission
router.post('/', createSubmission);

// Upload media files for a submission
router.post('/:submissionId/media', mediaUpload, uploadMedia);

// Get submission by ticket number
router.get('/:ticketNumber', getSubmissionByTicket);

// Download media file
router.get('/media/:mediaId/download', downloadMedia);

export default router;

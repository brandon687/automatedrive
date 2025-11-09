import { Router } from 'express';
import {
  getDealerSubmissions,
  submitQuote,
} from '../controllers/dealer.controller';

const router = Router();

// TODO: Add dealer authentication middleware
// router.use(dealerAuthMiddleware);

// Get submissions assigned to dealer
router.get('/submissions', getDealerSubmissions);

// Submit a quote for a submission
router.post('/submissions/:submissionId/quote', submitQuote);

export default router;

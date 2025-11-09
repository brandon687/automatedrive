import { Router } from 'express';
import { lookupPlate, getStates } from '../controllers/licensePlate.controller';

const router = Router();

// POST /api/license-plate/lookup
router.post('/lookup', lookupPlate);

// GET /api/license-plate/states
router.get('/states', getStates);

export default router;

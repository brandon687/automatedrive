import { Router } from 'express';
import { decodeVINRoute } from '../controllers/vin.controller';

const router = Router();

// Decode VIN
router.get('/decode/:vin', decodeVINRoute);

export default router;

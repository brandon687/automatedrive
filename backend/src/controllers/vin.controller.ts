import { Request, Response } from 'express';
import { decodeVIN, isValidVIN } from '../services/vin.service';

/**
 * Decode VIN endpoint
 */
export async function decodeVINRoute(req: Request, res: Response) {
  try {
    const { vin } = req.params;

    if (!isValidVIN(vin)) {
      return res.status(400).json({ error: 'Invalid VIN format' });
    }

    const vehicleData = await decodeVIN(vin);

    res.json({
      success: true,
      data: vehicleData,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

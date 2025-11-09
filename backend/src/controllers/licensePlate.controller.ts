import { Request, Response } from 'express';
import { lookupLicensePlate, getUSStates } from '../services/licensePlate.service';

/**
 * POST /api/license-plate/lookup
 * Convert license plate to VIN and vehicle details
 */
export async function lookupPlate(req: Request, res: Response) {
  try {
    const { plateNumber, state } = req.body;

    if (!plateNumber || !state) {
      return res.status(400).json({
        success: false,
        error: 'License plate number and state are required'
      });
    }

    const result = await lookupLicensePlate(plateNumber, state);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'License plate not found or API key not configured. Please enter VIN manually.',
        message: 'To enable license plate lookup, add your Auto.dev API key to .env file'
      });
    }

    return res.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('[License Plate Lookup] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to lookup license plate',
      message: error.message
    });
  }
}

/**
 * GET /api/license-plate/states
 * Get list of US states for dropdown
 */
export async function getStates(req: Request, res: Response) {
  try {
    const states = getUSStates();
    return res.json({
      success: true,
      data: states
    });
  } catch (error: any) {
    console.error('[Get States] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get states list',
      message: error.message
    });
  }
}

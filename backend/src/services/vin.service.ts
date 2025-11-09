import axios from 'axios';

interface VehicleData {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vehicleType?: string;
  manufacturer?: string;
  bodyClass?: string;
  engineCylinders?: string;
  engineModel?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  abs?: string;
  [key: string]: any;
}

/**
 * Decode VIN using NHTSA vPIC API
 * @param vin Vehicle Identification Number
 * @returns Decoded vehicle data
 */
export async function decodeVIN(vin: string): Promise<VehicleData> {
  try {
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
    );

    const data = response.data.Results[0];

    if (!data) {
      throw new Error('Invalid VIN or unable to decode');
    }

    // ErrorCode 0 = success, 8 = partial data, others may still have some data
    // We'll accept it as long as we have Make and Year

    // Map the response to our data structure
    return {
      vin: vin.toUpperCase(),
      year: data.ModelYear ? parseInt(data.ModelYear) : undefined,
      make: data.Make || undefined,
      model: data.Model || undefined,
      trim: data.Trim || undefined,
      vehicleType: data.VehicleType || undefined,
      manufacturer: data.Manufacturer || undefined,
      bodyClass: data.BodyClass || undefined,
      engineCylinders: data.EngineCylinders || undefined,
      engineModel: data.EngineModel || undefined,
      fuelType: data.FuelTypePrimary || undefined,
      transmission: data.TransmissionStyle || undefined,
      driveType: data.DriveType || undefined,
      abs: data.ABS || undefined,
      // Store full response for reference
      fullSpecs: data,
    };
  } catch (error: any) {
    console.error('VIN decode error:', error.message);
    throw new Error(`Failed to decode VIN: ${error.message}`);
  }
}

/**
 * Validate VIN format (basic check)
 * @param vin Vehicle Identification Number
 * @returns boolean
 */
export function isValidVIN(vin: string): boolean {
  // VIN must be exactly 17 characters
  if (!vin || vin.length !== 17) {
    return false;
  }

  // VIN should not contain I, O, or Q
  if (/[IOQ]/i.test(vin)) {
    return false;
  }

  // VIN should only contain alphanumeric characters
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return false;
  }

  return true;
}

import axios from 'axios';

interface LicensePlateResult {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  drivetrain?: string;
  engine?: string;
  transmission?: string;
  plateNumber: string;
  state: string;
  success: boolean;
}

/**
 * Convert a US license plate to VIN using Auto.dev API
 * API Docs: https://api.auto.dev
 * Endpoint: GET /plate/{state}/{plate}
 */
export async function lookupLicensePlate(
  plateNumber: string,
  state: string
): Promise<LicensePlateResult | null> {
  try {
    const apiKey = process.env.AUTO_DEV_API_KEY;

    if (!apiKey) {
      console.warn('[Auto.dev Plate API] API key not configured');
      return null;
    }

    // Clean up plate number (remove spaces, special chars)
    const cleanPlate = plateNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const cleanState = state.toUpperCase();

    console.log(`[Auto.dev Plate API] Looking up plate: ${cleanPlate} in ${cleanState}`);

    const response = await axios.get(
      `https://api.auto.dev/plate/${cleanState}/${cleanPlate}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data.vin) {
      console.log(`[Auto.dev Plate API] Success! VIN found: ${response.data.vin}`);

      return {
        vin: response.data.vin,
        year: response.data.year,
        make: response.data.make,
        model: response.data.model,
        trim: response.data.trim,
        drivetrain: response.data.drivetrain,
        engine: response.data.engine,
        transmission: response.data.transmission,
        plateNumber: cleanPlate,
        state: cleanState,
        success: true
      };
    }

    console.warn('[Auto.dev Plate API] No VIN found in response');
    return null;

  } catch (error: any) {
    if (error.response) {
      // API returned an error response
      console.error(`[Auto.dev Plate API] Error ${error.response.status}:`, error.response.data);

      if (error.response.status === 404) {
        console.log('[Auto.dev Plate API] Plate not found in database');
      } else if (error.response.status === 401) {
        console.error('[Auto.dev Plate API] Invalid API key');
      } else if (error.response.status === 429) {
        console.error('[Auto.dev Plate API] Rate limit exceeded');
      }
    } else if (error.request) {
      console.error('[Auto.dev Plate API] No response received:', error.message);
    } else {
      console.error('[Auto.dev Plate API] Error:', error.message);
    }

    return null;
  }
}

/**
 * Get list of US states for dropdown
 */
export function getUSStates(): Array<{ code: string; name: string }> {
  return [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
    { code: 'DC', name: 'District of Columbia' }
  ];
}

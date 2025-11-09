import axios from 'axios';
import prisma from '../utils/prisma';

export interface MarketValuation {
  vin: string;
  marketValue?: {
    low: number;
    average: number;
    high: number;
    currency: string;
  };
  confidence?: string;
  source: string;
  timestamp: Date;
}

export interface PricingInsights {
  estimatedRetail: number;
  estimatedWholesale: number;
  estimatedPrivateParty: number;
  marketTrend: 'increasing' | 'stable' | 'decreasing';
  demandLevel: 'high' | 'medium' | 'low';
  daysToSell: number;
  competitivePrice: number;
}

/**
 * Get market valuation from Auto.dev API
 */
export async function getAutoDevValuation(vin: string): Promise<MarketValuation | null> {
  try {
    const apiKey = process.env.AUTO_DEV_API_KEY;

    if (!apiKey) {
      console.warn('[Auto.dev] API key not configured');
      return null;
    }

    const response = await axios.get(
      `https://api.auto.dev/v1/vin/${vin}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data.marketValue) {
      return {
        vin,
        marketValue: {
          low: response.data.marketValue.low || response.data.marketValue.min,
          average: response.data.marketValue.average || response.data.marketValue.avg,
          high: response.data.marketValue.high || response.data.marketValue.max,
          currency: 'USD'
        },
        confidence: response.data.confidence || 'medium',
        source: 'auto.dev',
        timestamp: new Date()
      };
    }

    return null;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.error('[Auto.dev] Rate limit exceeded');
    } else if (error.response?.status === 401) {
      console.error('[Auto.dev] Invalid API key');
    } else {
      console.error('[Auto.dev] Error:', error.message);
    }
    return null;
  }
}

/**
 * Get market valuation from Vincario API
 */
export async function getVincarioValuation(vin: string): Promise<MarketValuation | null> {
  try {
    const apiKey = process.env.VINCARIO_API_KEY;

    if (!apiKey) {
      console.warn('[Vincario] API key not configured');
      return null;
    }

    const response = await axios.get(
      `https://api.vindecoder.eu/3.0/${apiKey}/decode/${vin}.json`,
      {
        timeout: 10000
      }
    );

    if (response.data && response.data.market_price_usd) {
      return {
        vin,
        marketValue: {
          low: Math.round(response.data.market_price_usd * 0.85),
          average: response.data.market_price_usd,
          high: Math.round(response.data.market_price_usd * 1.15),
          currency: 'USD'
        },
        confidence: 'medium',
        source: 'vincario',
        timestamp: new Date()
      };
    }

    return null;
  } catch (error: any) {
    console.error('[Vincario] Error:', error.message);
    return null;
  }
}

/**
 * Estimate valuation based on vehicle specs when APIs fail
 */
export async function estimateValuation(
  year: number,
  make: string,
  model: string,
  mileage: number
): Promise<MarketValuation | null> {
  try {
    // Simple depreciation model as fallback
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // Base MSRP estimates by vehicle type (very rough)
    const baseMSRPMap: { [key: string]: number } = {
      'honda': 28000,
      'toyota': 30000,
      'ford': 32000,
      'chevrolet': 31000,
      'bmw': 45000,
      'mercedes-benz': 50000,
      'tesla': 45000,
      'nissan': 27000,
      'hyundai': 25000,
      'kia': 24000,
      'default': 30000
    };

    const baseMSRP = baseMSRPMap[make.toLowerCase()] || baseMSRPMap['default'];

    // Depreciation: ~15% first year, ~10% subsequent years
    let depreciationRate = age === 0 ? 0 : (age === 1 ? 0.15 : 0.15 + (age - 1) * 0.10);
    depreciationRate = Math.min(depreciationRate, 0.80); // Max 80% depreciation

    // Mileage adjustment: -$0.10 per mile over expected
    const expectedMileage = age * 12000;
    const excessMileage = Math.max(0, mileage - expectedMileage);
    const mileageAdjustment = excessMileage * 0.10;

    const estimatedValue = Math.max(
      baseMSRP * (1 - depreciationRate) - mileageAdjustment,
      baseMSRP * 0.10 // Minimum 10% of MSRP
    );

    return {
      vin: '',
      marketValue: {
        low: Math.round(estimatedValue * 0.85),
        average: Math.round(estimatedValue),
        high: Math.round(estimatedValue * 1.15),
        currency: 'USD'
      },
      confidence: 'low',
      source: 'estimated',
      timestamp: new Date()
    };
  } catch (error: any) {
    console.error('[Estimation] Error:', error.message);
    return null;
  }
}

/**
 * Get comprehensive market valuation with fallbacks
 */
export async function getComprehensiveValuation(
  vin: string,
  year: number,
  make: string,
  model: string,
  mileage: number
): Promise<MarketValuation> {
  // Try Auto.dev first (best source)
  const autoDevData = await getAutoDevValuation(vin);
  if (autoDevData) {
    console.log('[Valuation] Using Auto.dev data');
    return autoDevData;
  }

  // Try Vincario as backup
  const vincarioData = await getVincarioValuation(vin);
  if (vincarioData) {
    console.log('[Valuation] Using Vincario data');
    return vincarioData;
  }

  // Fall back to estimation
  console.log('[Valuation] Using estimation model');
  const estimated = await estimateValuation(year, make, model, mileage);

  return estimated || {
    vin,
    marketValue: {
      low: 0,
      average: 0,
      high: 0,
      currency: 'USD'
    },
    confidence: 'none',
    source: 'unavailable',
    timestamp: new Date()
  };
}

/**
 * Calculate pricing insights for dealers
 */
export function calculatePricingInsights(
  marketValue: MarketValuation['marketValue'],
  mileage: number,
  condition: 'excellent' | 'good' | 'fair' | 'poor' = 'good'
): PricingInsights | null {
  if (!marketValue || marketValue.average === 0) {
    return null;
  }

  const { low, average, high } = marketValue;

  // Condition adjustments
  const conditionMultiplier = {
    excellent: 1.10,
    good: 1.00,
    fair: 0.90,
    poor: 0.75
  }[condition];

  // Pricing calculations
  const estimatedRetail = Math.round(high * conditionMultiplier);
  const estimatedWholesale = Math.round(low * conditionMultiplier);
  const estimatedPrivateParty = Math.round(average * conditionMultiplier);

  // Competitive dealer buy price (10-15% below retail)
  const competitivePrice = Math.round(estimatedPrivateParty * 0.85);

  // Market trend (simplified - would use historical data in production)
  const marketTrend = 'stable'; // Would analyze price changes over time

  // Demand level based on price spread
  const priceSpread = (high - low) / average;
  const demandLevel = priceSpread > 0.30 ? 'high' : priceSpread > 0.20 ? 'medium' : 'low';

  // Days to sell estimate based on demand
  const daysToSell = {
    high: 15,
    medium: 30,
    low: 60
  }[demandLevel];

  return {
    estimatedRetail,
    estimatedWholesale,
    estimatedPrivateParty,
    marketTrend,
    demandLevel,
    daysToSell,
    competitivePrice
  };
}

/**
 * Store valuation data in database
 */
export async function storeValuation(
  submissionId: string,
  valuation: MarketValuation,
  insights?: PricingInsights
): Promise<void> {
  try {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        estimatedValueLow: valuation.marketValue?.low || null,
        estimatedValueAvg: valuation.marketValue?.average || null,
        estimatedValueHigh: valuation.marketValue?.high || null,
        valuationSource: valuation.source,
        valuationConfidence: valuation.confidence || 'unknown',
        valuationDate: valuation.timestamp,
        // Store insights as JSON
        pricingInsights: insights ? JSON.stringify(insights) : null
      }
    });

    console.log(`[Valuation] Stored data for submission ${submissionId}`);
  } catch (error: any) {
    console.error('[Valuation] Error storing data:', error.message);
  }
}

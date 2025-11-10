/**
 * Market Research Controller
 * Handles API requests for vehicle pricing research
 */

import { Request, Response } from 'express';
import { marketResearch, VehicleSearchParams } from '../services/market-research.service';
import prisma from '../utils/prisma';

/**
 * POST /api/market-research/analyze
 * Perform market research for a vehicle
 */
export async function analyzeVehicle(req: Request, res: Response) {
  try {
    const { submissionId, vin, year, make, model, trim, mileage, zipCode } = req.body;

    // Validation
    if (!year || !make || !model || !mileage) {
      return res.status(400).json({
        error: 'Missing required fields: year, make, model, mileage'
      });
    }

    console.log('[Market Research API] Starting analysis:', { year, make, model, submissionId });

    // Build search params
    const searchParams: VehicleSearchParams = {
      vin,
      year: parseInt(year),
      make,
      model,
      trim,
      mileage: parseInt(mileage),
      zipCode: zipCode || '10001'
    };

    // Perform research
    const results = await marketResearch.performResearch(searchParams);

    // If submissionId provided, store results
    if (submissionId) {
      await marketResearch.storeResearchResults(submissionId, results);

      // Update submission with pricing data
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          estimatedValueLow: results.marketLow,
          estimatedValueAvg: results.marketAverage,
          estimatedValueHigh: results.marketHigh,
          valuationSource: 'market_research',
          valuationConfidence: results.overallConfidence,
          valuationDate: new Date(),
        }
      });
    }

    return res.json({
      success: true,
      data: {
        pricing: {
          marketLow: results.marketLow,
          marketAverage: results.marketAverage,
          marketHigh: results.marketHigh,
          recommendedAskingPrice: results.recommendedAskingPrice,
          recommendedDealerOffer: results.recommendedDealerOffer,
        },
        market: {
          totalComparableListings: results.totalComparableListings,
          averageDaysToSell: results.averageDaysToSell,
          marketDemand: results.marketDemand,
          priceTrend: results.priceTrend,
        },
        confidence: {
          dataSourcesCount: results.dataSourcesCount,
          overallConfidence: results.overallConfidence,
        },
        insights: results.marketInsights,
        recommendation: results.pricingRecommendation,
        // Don't send full source data to keep response size reasonable
        sampleListings: results.sources.slice(0, 5).map(s => ({
          source: s.sourceName,
          price: s.askingPrice,
          mileage: s.mileage,
          location: s.dealerLocation,
        }))
      }
    });
  } catch (error: any) {
    console.error('[Market Research API] Error:', error);
    return res.status(500).json({
      error: 'Failed to perform market research',
      message: error.message
    });
  }
}

/**
 * GET /api/market-research/:submissionId
 * Get stored market research for a submission
 */
export async function getMarketResearch(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;

    const marketAnalysis = await prisma.marketAnalysis.findUnique({
      where: { submissionId },
      include: {
        submission: {
          select: {
            vin: true,
            year: true,
            make: true,
            model: true,
            trim: true,
            mileage: true,
          }
        }
      }
    });

    if (!marketAnalysis) {
      return res.status(404).json({
        error: 'Market research not found for this submission'
      });
    }

    // Get source data
    const sources = await prisma.marketPriceSource.findMany({
      where: { submissionId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get price history
    const priceHistory = await prisma.priceHistory.findMany({
      where: { submissionId },
      orderBy: { recordedAt: 'desc' },
      take: 30
    });

    return res.json({
      success: true,
      data: {
        vehicle: marketAnalysis.submission,
        pricing: {
          marketLow: marketAnalysis.marketLow,
          marketAverage: marketAnalysis.marketAverage,
          marketHigh: marketAnalysis.marketHigh,
          recommendedAskingPrice: marketAnalysis.recommendedAskingPrice,
          recommendedDealerOffer: marketAnalysis.recommendedDealerOffer,
        },
        market: {
          totalComparableListings: marketAnalysis.totalComparableListings,
          averageDaysToSell: marketAnalysis.averageDaysToSell,
          marketDemand: marketAnalysis.marketDemand,
          priceTrend: marketAnalysis.priceTrend,
          localMarketListings: marketAnalysis.localMarketListings,
          nationalMarketListings: marketAnalysis.nationalMarketListings,
        },
        confidence: {
          dataSourcesCount: marketAnalysis.dataSourcesCount,
          overallConfidence: marketAnalysis.overallConfidence,
          lastUpdated: marketAnalysis.lastUpdated,
        },
        insights: marketAnalysis.marketInsights,
        recommendation: marketAnalysis.pricingRecommendation,
        sources: sources.map(s => ({
          source: s.sourceName,
          price: s.askingPrice,
          mileage: s.mileage,
          dealer: s.dealerName,
          location: s.dealerLocation,
          daysOnMarket: s.daysOnMarket,
          url: s.sourceUrl,
        })),
        priceHistory: priceHistory.map(h => ({
          date: h.recordedAt,
          average: h.marketAverage,
          sources: h.sourceCount,
          change: h.changeAmount,
          changePercent: h.changePercentage,
        }))
      }
    });
  } catch (error: any) {
    console.error('[Market Research API] Error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve market research',
      message: error.message
    });
  }
}

/**
 * POST /api/market-research/:submissionId/refresh
 * Refresh market research for a submission
 */
export async function refreshMarketResearch(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;

    // Get submission details
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Perform fresh research
    const searchParams: VehicleSearchParams = {
      vin: submission.vin,
      year: submission.year || 2020,
      make: submission.make || '',
      model: submission.model || '',
      trim: submission.trim || undefined,
      mileage: submission.mileage,
    };

    const results = await marketResearch.performResearch(searchParams);
    await marketResearch.storeResearchResults(submissionId, results);

    // Update submission
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        estimatedValueLow: results.marketLow,
        estimatedValueAvg: results.marketAverage,
        estimatedValueHigh: results.marketHigh,
        valuationSource: 'market_research',
        valuationConfidence: results.overallConfidence,
        valuationDate: new Date(),
      }
    });

    return res.json({
      success: true,
      message: 'Market research refreshed successfully',
      data: {
        marketLow: results.marketLow,
        marketAverage: results.marketAverage,
        marketHigh: results.marketHigh,
        confidence: results.overallConfidence,
        sources: results.dataSourcesCount,
      }
    });
  } catch (error: any) {
    console.error('[Market Research API] Refresh error:', error);
    return res.status(500).json({
      error: 'Failed to refresh market research',
      message: error.message
    });
  }
}

/**
 * GET /api/market-research/sources
 * Get available market research sources and their status
 */
export async function getAvailableSources(req: Request, res: Response) {
  return res.json({
    success: true,
    sources: [
      {
        name: 'cargurus',
        displayName: 'CarGurus',
        available: true,
        description: 'Leading automotive marketplace with extensive listings',
        confidence: 0.85,
      },
      {
        name: 'autotrader',
        displayName: 'AutoTrader',
        available: true,
        description: 'Major automotive marketplace with dealer and private listings',
        confidence: 0.85,
      },
      {
        name: 'kbb',
        displayName: 'Kelley Blue Book',
        available: false,
        description: 'Industry-standard valuation service (API integration pending)',
        confidence: 0.90,
      },
      {
        name: 'nada',
        displayName: 'NADA Guides',
        available: false,
        description: 'Professional-grade valuation tool (API integration pending)',
        confidence: 0.90,
      },
      {
        name: 'blackbook',
        displayName: 'Black Book',
        available: false,
        description: 'Wholesale and trade-in value specialist (API integration pending)',
        confidence: 0.95,
      }
    ]
  });
}

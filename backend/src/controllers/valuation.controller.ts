import { Request, Response } from 'express';
import {
  getComprehensiveValuation,
  calculatePricingInsights,
  storeValuation
} from '../services/valuation.service';
import prisma from '../utils/prisma';

/**
 * Get market valuation for a VIN
 * GET /api/valuation/:vin
 */
export async function getValuationByVIN(req: Request, res: Response) {
  try {
    const { vin } = req.params;
    const { mileage, year, make, model } = req.query;

    if (!vin) {
      return res.status(400).json({ error: 'VIN is required' });
    }

    // Get valuation from APIs or estimation
    const valuation = await getComprehensiveValuation(
      vin,
      parseInt(year as string) || new Date().getFullYear(),
      (make as string) || '',
      (model as string) || '',
      parseInt(mileage as string) || 0
    );

    // Calculate pricing insights
    const insights = valuation.marketValue
      ? calculatePricingInsights(valuation.marketValue, parseInt(mileage as string) || 0)
      : null;

    res.json({
      success: true,
      valuation,
      insights
    });
  } catch (error: any) {
    console.error('Get valuation error:', error);
    res.status(500).json({ error: 'Failed to get valuation' });
  }
}

/**
 * Get valuation for a submission
 * GET /api/submissions/:submissionId/valuation
 */
export async function getSubmissionValuation(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;

    // Get submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if we have cached valuation (less than 24 hours old)
    if (
      submission.valuationDate &&
      submission.estimatedValueAvg &&
      Date.now() - submission.valuationDate.getTime() < 24 * 60 * 60 * 1000
    ) {
      // Return cached data
      return res.json({
        success: true,
        cached: true,
        valuation: {
          vin: submission.vin,
          marketValue: {
            low: submission.estimatedValueLow || 0,
            average: submission.estimatedValueAvg || 0,
            high: submission.estimatedValueHigh || 0,
            currency: 'USD'
          },
          confidence: submission.valuationConfidence || 'unknown',
          source: submission.valuationSource || 'cached',
          timestamp: submission.valuationDate
        },
        insights: submission.pricingInsights ? JSON.parse(submission.pricingInsights) : null
      });
    }

    // Fetch fresh valuation
    const valuation = await getComprehensiveValuation(
      submission.vin,
      submission.year || new Date().getFullYear(),
      submission.make || '',
      submission.model || '',
      submission.mileage
    );

    // Calculate insights
    const insights = valuation.marketValue
      ? calculatePricingInsights(valuation.marketValue, submission.mileage)
      : null;

    // Store in database
    await storeValuation(submissionId, valuation, insights || undefined);

    res.json({
      success: true,
      cached: false,
      valuation,
      insights
    });
  } catch (error: any) {
    console.error('Get submission valuation error:', error);
    res.status(500).json({ error: 'Failed to get valuation' });
  }
}

/**
 * Refresh valuation for a submission (force update)
 * POST /api/submissions/:submissionId/valuation/refresh
 */
export async function refreshSubmissionValuation(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Fetch fresh valuation
    const valuation = await getComprehensiveValuation(
      submission.vin,
      submission.year || new Date().getFullYear(),
      submission.make || '',
      submission.model || '',
      submission.mileage
    );

    // Calculate insights
    const insights = valuation.marketValue
      ? calculatePricingInsights(valuation.marketValue, submission.mileage)
      : null;

    // Store in database
    await storeValuation(submissionId, valuation, insights || undefined);

    res.json({
      success: true,
      message: 'Valuation refreshed successfully',
      valuation,
      insights
    });
  } catch (error: any) {
    console.error('Refresh valuation error:', error);
    res.status(500).json({ error: 'Failed to refresh valuation' });
  }
}

/**
 * Get market analytics for admin dashboard
 * GET /api/admin/analytics/market
 */
export async function getMarketAnalytics(req: Request, res: Response) {
  try {
    // Get all submissions with valuations
    const submissions = await prisma.submission.findMany({
      where: {
        estimatedValueAvg: { not: null }
      },
      select: {
        id: true,
        ticketNumber: true,
        year: true,
        make: true,
        model: true,
        mileage: true,
        estimatedValueLow: true,
        estimatedValueAvg: true,
        estimatedValueHigh: true,
        valuationSource: true,
        valuationConfidence: true,
        valuationDate: true,
        pricingInsights: true,
        createdAt: true,
        quotes: {
          select: {
            amount: true,
            dealer: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate analytics
    const totalSubmissions = submissions.length;
    const avgMarketValue = submissions.length > 0
      ? Math.round(submissions.reduce((sum, s) => sum + (s.estimatedValueAvg || 0), 0) / submissions.length)
      : 0;

    // Count by valuation source
    const sourceCounts = submissions.reduce((acc: any, s) => {
      const source = s.valuationSource || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    // Calculate quote vs market value comparison
    const quotedSubmissions = submissions.filter(s => s.quotes.length > 0);
    const avgQuoteValue = quotedSubmissions.length > 0
      ? Math.round(
          quotedSubmissions.reduce((sum, s) => {
            const highestQuote = Math.max(...s.quotes.map(q => Number(q.amount)));
            return sum + highestQuote;
          }, 0) / quotedSubmissions.length
        )
      : 0;

    res.json({
      success: true,
      analytics: {
        totalSubmissions,
        avgMarketValue,
        avgQuoteValue,
        quotedSubmissions: quotedSubmissions.length,
        valuationSources: sourceCounts,
        recentSubmissions: submissions.slice(0, 10).map(s => ({
          ticketNumber: s.ticketNumber,
          vehicle: `${s.year} ${s.make} ${s.model}`,
          marketValue: s.estimatedValueAvg,
          quotes: s.quotes.length,
          source: s.valuationSource
        }))
      }
    });
  } catch (error: any) {
    console.error('Get market analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
}

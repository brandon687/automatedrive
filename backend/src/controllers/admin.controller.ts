import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

/**
 * Get all submissions with filtering and pagination
 */
export async function getAllSubmissions(req: Request, res: Response) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const where: any = {};

    // Filter by status
    if (status && typeof status === 'string') {
      where.status = status;
    }

    // Search by VIN, ticket number, or vehicle info
    if (search && typeof search === 'string') {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { vin: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          submitter: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          media: true,
          quotes: {
            include: {
              dealer: true,
            },
          },
          marketAnalysis: {
            select: {
              marketLow: true,
              marketAverage: true,
              marketHigh: true,
              recommendedDealerOffer: true,
              overallConfidence: true,
              marketDemand: true,
              averageDaysToSell: true,
              lastUpdated: true,
            }
          },
          marketResearchJobs: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              status: true,
              completedAt: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.submission.count({ where }),
    ]);

    res.json({
      submissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to retrieve submissions' });
  }
}

/**
 * Get single submission by ID
 */
export async function getSubmissionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        submitter: true,
        media: true,
        quotes: {
          include: {
            dealer: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error: any) {
    console.error('Get submission error:', error);
    res.status(500).json({ error: 'Failed to retrieve submission' });
  }
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'forwarded', 'quoted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const submission = await prisma.submission.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, submission });
  } catch (error: any) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
}

/**
 * Forward submission to dealer
 */
export async function forwardToDealer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { dealerIds } = req.body;

    if (!dealerIds || !Array.isArray(dealerIds) || dealerIds.length === 0) {
      return res.status(400).json({ error: 'Dealer IDs are required' });
    }

    // TODO: Send email notifications to dealers

    // Update submission status
    await prisma.submission.update({
      where: { id },
      data: { status: 'forwarded' },
    });

    res.json({
      success: true,
      message: `Submission forwarded to ${dealerIds.length} dealer(s)`,
    });
  } catch (error: any) {
    console.error('Forward to dealer error:', error);
    res.status(500).json({ error: 'Failed to forward submission' });
  }
}

/**
 * Generate shareable link for submission
 */
export async function generateShareableLink(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      select: {
        ticketNumber: true,
        year: true,
        make: true,
        model: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const shareableLink = `${frontendUrl}/submission/${submission.ticketNumber}`;

    res.json({
      success: true,
      link: shareableLink,
      ticketNumber: submission.ticketNumber,
      vehicle: `${submission.year} ${submission.make} ${submission.model}`,
    });
  } catch (error: any) {
    console.error('Generate shareable link error:', error);
    res.status(500).json({ error: 'Failed to generate shareable link' });
  }
}

/**
 * Get detailed pricing data for a submission with state-by-state breakdown
 */
export async function getSubmissionPricing(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        marketAnalysis: true,
        marketPriceSources: {
          orderBy: { scrapeTimestamp: 'desc' },
        },
        comparableVehicles: true,
        priceHistory: {
          orderBy: { recordedAt: 'desc' },
          take: 30, // Last 30 price updates
        },
        marketResearchJobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Calculate state-by-state breakdown
    const stateBreakdown: any = {};
    submission.comparableVehicles.forEach(comp => {
      const stateMatch = comp.location?.match(/,\s*([A-Z]{2})$/);
      const state = stateMatch ? stateMatch[1] : 'Unknown';

      if (!stateBreakdown[state]) {
        stateBreakdown[state] = {
          count: 0,
          prices: [],
          avgPrice: 0,
          minPrice: Infinity,
          maxPrice: 0,
        };
      }

      if (comp.askingPrice) {
        stateBreakdown[state].count++;
        stateBreakdown[state].prices.push(comp.askingPrice);
        stateBreakdown[state].minPrice = Math.min(stateBreakdown[state].minPrice, comp.askingPrice);
        stateBreakdown[state].maxPrice = Math.max(stateBreakdown[state].maxPrice, comp.askingPrice);
      }
    });

    // Calculate averages for each state
    Object.keys(stateBreakdown).forEach(state => {
      const data = stateBreakdown[state];
      if (data.prices.length > 0) {
        data.avgPrice = Math.round(data.prices.reduce((a: number, b: number) => a + b, 0) / data.prices.length);
      }
      delete data.prices; // Remove raw prices array from response
    });

    // Sort states by listing count
    const sortedStates = Object.entries(stateBreakdown)
      .sort((a: any, b: any) => b[1].count - a[1].count)
      .reduce((obj: any, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    res.json({
      submissionId: submission.id,
      vehicle: {
        year: submission.year,
        make: submission.make,
        model: submission.model,
        trim: submission.trim,
        vin: submission.vin,
        mileage: submission.mileage,
      },
      marketAnalysis: submission.marketAnalysis,
      stateBreakdown: sortedStates,
      totalComparables: submission.comparableVehicles.length,
      dataSources: submission.marketPriceSources.length,
      priceHistory: submission.priceHistory,
      researchJobs: submission.marketResearchJobs,
      lastUpdated: submission.marketAnalysis?.lastUpdated || submission.updatedAt,
    });
  } catch (error: any) {
    console.error('Get submission pricing error:', error);
    res.status(500).json({ error: 'Failed to retrieve pricing data' });
  }
}

/**
 * Manually trigger pricing research refresh for a submission
 */
export async function refreshSubmissionPricing(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      select: {
        id: true,
        vin: true,
        year: true,
        make: true,
        model: true,
        trim: true,
        mileage: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Create new research job
    const job = await prisma.marketResearchJob.create({
      data: {
        submissionId: submission.id,
        jobType: 'manual_refresh',
        priority: 10, // High priority for manual refreshes
        status: 'pending',
        sourcesChecked: '[]',
        sourcesSuccessful: '[]',
      },
    });

    // Trigger research in background
    const { marketResearch } = require('../services/market-research.service');

    setImmediate(async () => {
      try {
        await prisma.marketResearchJob.update({
          where: { id: job.id },
          data: {
            status: 'processing',
            startedAt: new Date(),
          },
        });

        const results = await marketResearch.performResearch({
          vin: submission.vin,
          year: submission.year,
          make: submission.make,
          model: submission.model,
          trim: submission.trim,
          mileage: submission.mileage,
        });

        await marketResearch.storeResearchResults(submission.id, results);

        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            estimatedValueLow: results.marketLow,
            estimatedValueAvg: results.marketAverage,
            estimatedValueHigh: results.marketHigh,
            valuationSource: 'market_research_manual',
            valuationConfidence: results.overallConfidence,
            valuationDate: new Date(),
          },
        });

        await prisma.marketResearchJob.update({
          where: { id: job.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
            sourcesChecked: JSON.stringify(['cargurus', 'autotrader']),
            sourcesSuccessful: JSON.stringify(['cargurus', 'autotrader']),
          },
        });

        console.log(`[Manual Refresh] Completed for submission ${submission.id}`);
      } catch (error: any) {
        console.error(`[Manual Refresh] Error for ${submission.id}:`, error);
        await prisma.marketResearchJob.update({
          where: { id: job.id },
          data: {
            status: 'failed',
            completedAt: new Date(),
            errorMessage: error.message,
          },
        });
      }
    });

    res.json({
      success: true,
      message: 'Pricing refresh triggered',
      jobId: job.id,
      vehicle: `${submission.year} ${submission.make} ${submission.model}`,
    });
  } catch (error: any) {
    console.error('Refresh pricing error:', error);
    res.status(500).json({ error: 'Failed to trigger pricing refresh' });
  }
}

/**
 * Get dashboard statistics with pricing insights
 */
export async function getDashboardStats(req: Request, res: Response) {
  try {
    // Get overall counts
    const [
      totalSubmissions,
      submissionsWithPricing,
      pendingResearchJobs,
      completedToday,
    ] = await Promise.all([
      prisma.submission.count(),
      prisma.submission.count({
        where: {
          marketAnalysis: {
            isNot: null,
          },
        },
      }),
      prisma.marketResearchJob.count({
        where: {
          status: { in: ['pending', 'processing'] },
        },
      }),
      prisma.submission.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Get average pricing confidence
    const pricingStats = await prisma.marketAnalysis.aggregate({
      _avg: {
        marketAverage: true,
      },
      _count: {
        id: true,
      },
    });

    // Get recent research jobs
    const recentJobs = await prisma.marketResearchJob.findMany({
      where: {
        status: 'completed',
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 10,
      include: {
        submission: {
          select: {
            ticketNumber: true,
            year: true,
            make: true,
            model: true,
          },
        },
      },
    });

    // Calculate success rate
    const jobStats = await prisma.marketResearchJob.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const totalJobs = jobStats.reduce((sum, stat) => sum + stat._count.status, 0);
    const completedJobs = jobStats.find(s => s.status === 'completed')?._count.status || 0;
    const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

    res.json({
      overview: {
        totalSubmissions,
        submissionsWithPricing,
        pricingCoverage: totalSubmissions > 0
          ? Math.round((submissionsWithPricing / totalSubmissions) * 100)
          : 0,
        completedToday,
        pendingResearchJobs,
      },
      pricing: {
        averageMarketValue: pricingStats._avg?.marketAverage || 0,
        totalAnalyses: pricingStats._count?.id || 0,
      },
      research: {
        totalJobs,
        completedJobs,
        successRate,
        pendingJobs: pendingResearchJobs,
      },
      recentActivity: recentJobs.map(job => ({
        jobId: job.id,
        ticketNumber: job.submission.ticketNumber,
        vehicle: `${job.submission.year} ${job.submission.make} ${job.submission.model}`,
        completedAt: job.completedAt,
        duration: job.startedAt && job.completedAt
          ? Math.round((job.completedAt.getTime() - job.startedAt.getTime()) / 1000)
          : null,
      })),
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics' });
  }
}

/**
 * Export submission media as ZIP file
 */
export async function exportSubmissionMedia(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Get submission with media
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        submitter: true,
        media: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (!submission.media || submission.media.length === 0) {
      return res.status(404).json({ error: 'No media files found for this submission' });
    }

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Set response headers
    const zipFilename = `${submission.ticketNumber}_${submission.year}_${submission.make}_${submission.model}.zip`
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');

    res.attachment(zipFilename);
    res.setHeader('Content-Type', 'application/zip');

    // Pipe archive to response
    archive.pipe(res);

    // Create a README with submission details
    const readmeContent = `
DealerTrade Submission Export
================================

Ticket Number: ${submission.ticketNumber}
VIN: ${submission.vin}
Vehicle: ${submission.year} ${submission.make} ${submission.model}
${submission.trim ? `Trim: ${submission.trim}` : ''}
Mileage: ${submission.mileage.toLocaleString()} miles

Submitter Information:
${submission.submitter ? `
Name: ${submission.submitter.name || 'N/A'}
Email: ${submission.submitter.email || 'N/A'}
Phone: ${submission.submitter.phone || 'N/A'}
` : 'No submitter information available'}

Status: ${submission.status}
Submission Date: ${submission.createdAt.toLocaleString()}

Media Files Included:
${submission.media.map((m, i) => `${i + 1}. ${m.type}: ${path.basename(m.filePath)}`).join('\n')}

================================
Exported: ${new Date().toLocaleString()}
`;

    archive.append(readmeContent, { name: 'README.txt' });

    // Add all media files to the archive
    for (const media of submission.media) {
      const filePath = media.filePath;

      if (fs.existsSync(filePath)) {
        // Organize files by type in folders
        const folderName = media.type === 'video' ? 'video' : 'photos';
        const fileExtension = path.extname(filePath);
        const cleanFilename = `${media.type}${fileExtension}`;

        archive.file(filePath, { name: `${folderName}/${cleanFilename}` });
      } else {
        console.warn(`Media file not found: ${filePath}`);
      }
    }

    // Finalize the archive
    await archive.finalize();

    console.log(`📦 Exported media for submission ${submission.ticketNumber}`);
  } catch (error: any) {
    console.error('Export media error:', error);

    // Check if headers already sent
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to export media files' });
    }
  }
}

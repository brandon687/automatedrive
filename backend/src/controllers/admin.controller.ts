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

import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Get submissions for a dealer
 */
export async function getDealerSubmissions(req: Request, res: Response) {
  try {
    // TODO: Get dealer ID from auth token
    const dealerId = req.query.dealerId as string;

    if (!dealerId) {
      return res.status(400).json({ error: 'Dealer ID required' });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        status: { in: ['forwarded', 'quoted'] },
      },
      include: {
        media: true,
        quotes: {
          where: { dealerId },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(submissions);
  } catch (error: any) {
    console.error('Get dealer submissions error:', error);
    res.status(500).json({ error: 'Failed to retrieve submissions' });
  }
}

/**
 * Submit a quote for a submission
 */
export async function submitQuote(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;
    const { dealerId, amount, notes, expiresAt } = req.body;

    // TODO: Get dealer ID from auth token instead

    if (!dealerId || !amount) {
      return res.status(400).json({ error: 'Dealer ID and amount are required' });
    }

    // Verify submission exists
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        submissionId,
        dealerId,
        amount: parseFloat(amount),
        notes,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
      include: {
        dealer: true,
      },
    });

    // Update submission status to quoted
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'quoted' },
    });

    res.status(201).json({ success: true, quote });
  } catch (error: any) {
    console.error('Submit quote error:', error);
    res.status(500).json({ error: 'Failed to submit quote' });
  }
}

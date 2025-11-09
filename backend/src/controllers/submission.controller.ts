import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { generateTicketNumber } from '../utils/ticketGenerator';
import { decodeVIN, isValidVIN } from '../services/vin.service';
import { sendSubmissionConfirmation, sendAdminNotification } from '../services/email.service';

/**
 * Create a new vehicle submission
 */
export async function createSubmission(req: Request, res: Response) {
  try {
    const { vin, mileage, email, phone, name, referralCode } = req.body;

    // Validate required fields
    if (!vin || !mileage) {
      return res.status(400).json({ error: 'VIN and mileage are required' });
    }

    // Validate VIN format
    if (!isValidVIN(vin)) {
      return res.status(400).json({ error: 'Invalid VIN format' });
    }

    // Decode VIN to get vehicle data
    let vehicleData;
    try {
      vehicleData = await decodeVIN(vin);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }

    // Generate unique ticket number
    const ticketNumber = await generateTicketNumber();

    // Create submitter if contact info provided
    let submitter = null;
    if (email || phone) {
      submitter = await prisma.submitter.create({
        data: { email, phone, name },
      });
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        ticketNumber,
        vin: vehicleData.vin,
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        trim: vehicleData.trim,
        mileage: parseInt(mileage),
        vehicleSpecs: vehicleData.fullSpecs || {},
        submitterId: submitter?.id,
      },
      include: {
        submitter: true,
      },
    });

    // Send confirmation email if email provided
    if (email) {
      await sendSubmissionConfirmation({
        email,
        name,
        ticketNumber,
        vin: vehicleData.vin,
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
      });
    }

    // Notify admin
    const vehicleInfo = `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`;
    await sendAdminNotification(ticketNumber, vehicleInfo);

    res.status(201).json({
      success: true,
      ticketNumber,
      submissionId: submission.id,
      vehicle: {
        vin: vehicleData.vin,
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
      },
    });
  } catch (error: any) {
    console.error('Submission creation error:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
}

/**
 * Upload media files for a submission
 */
export async function uploadMedia(req: Request, res: Response) {
  try {
    const { submissionId } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Verify submission exists
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Save media records
    const mediaRecords = [];
    for (const [fieldName, fileArray] of Object.entries(files)) {
      for (const file of fileArray) {
        const media = await prisma.media.create({
          data: {
            submissionId,
            type: fieldName,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype,
          },
        });
        mediaRecords.push(media);
      }
    }

    res.json({
      success: true,
      uploaded: mediaRecords.length,
      files: mediaRecords,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
}

/**
 * Get submission by ticket number
 */
export async function getSubmissionByTicket(req: Request, res: Response) {
  try {
    const { ticketNumber } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { ticketNumber },
      include: {
        media: true,
        submitter: {
          select: {
            name: true,
            email: true,
            phone: true,
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
 * Download a media file
 */
export async function downloadMedia(req: Request, res: Response) {
  try {
    const { mediaId } = req.params;

    // Find the media record
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      include: {
        submission: true,
      },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    // Extract filename from the path
    const filename = media.filePath.split('/').pop() || 'download';

    // Set proper content type and force download
    res.setHeader('Content-Type', media.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send the file
    res.sendFile(media.filePath, { root: '.' }, (err) => {
      if (err) {
        console.error('File download error:', err);
        if (!res.headersSent) {
          res.status(404).json({ error: 'File not found on server' });
        }
      }
    });
  } catch (error: any) {
    console.error('Download media error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download media' });
    }
  }
}

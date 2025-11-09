import prisma from './prisma';

/**
 * Generates a unique ticket number in format: DT-YYYY-#####
 * Example: DT-2025-00042
 */
export async function generateTicketNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DT-${year}-`;

  // Get the last ticket for this year
  const lastTicket = await prisma.submission.findFirst({
    where: {
      ticketNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Extract number from last ticket or start from 0
  const lastNumber = lastTicket
    ? parseInt(lastTicket.ticketNumber.split('-')[2])
    : 0;

  // Increment and pad with zeros
  const nextNumber = (lastNumber + 1).toString().padStart(5, '0');

  return `${prefix}${nextNumber}`;
}

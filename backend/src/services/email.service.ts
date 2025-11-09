import nodemailer from 'nodemailer';

// Check if SMTP is configured
const isSmtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

interface SubmissionEmailData {
  email: string;
  name?: string;
  ticketNumber: string;
  vin: string;
  year?: number;
  make?: string;
  model?: string;
}

/**
 * Send confirmation email to submitter
 */
export async function sendSubmissionConfirmation(data: SubmissionEmailData) {
  const { email, name, ticketNumber, vin, year, make, model } = data;

  const vehicleInfo = year && make && model
    ? `${year} ${make} ${model}`
    : `VIN: ${vin}`;

  // If SMTP not configured, just log to console
  if (!isSmtpConfigured || !transporter) {
    console.log('\n📧 EMAIL (console mode - SMTP not configured):');
    console.log(`To: ${email}`);
    console.log(`Subject: Vehicle Appraisal Received - ${ticketNumber}`);
    console.log(`Vehicle: ${vehicleInfo}`);
    console.log(`Ticket: ${ticketNumber}`);
    console.log('✅ Email logged to console\n');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@dealertrade.com',
      to: email,
      subject: `Vehicle Appraisal Received - ${ticketNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin-top: 20px; }
            .ticket { font-size: 24px; font-weight: bold; color: #0ea5e9; margin: 20px 0; }
            .info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DealerTrade</h1>
              <p>Vehicle Appraisal Submission Confirmed</p>
            </div>
            <div class="content">
              <p>Hi ${name || 'there'},</p>
              <p>Thank you for submitting your vehicle for appraisal! We've received your information and our team will review it shortly.</p>

              <div class="info">
                <p><strong>Your Submission Number:</strong></p>
                <div class="ticket">${ticketNumber}</div>
                <p><strong>Vehicle:</strong> ${vehicleInfo}</p>
              </div>

              <p>You can reference this submission number when contacting us. We'll notify you once we receive quotes from our dealer partners.</p>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team reviews your submission</li>
                <li>We forward your vehicle information to our dealer partners</li>
                <li>Dealers submit their quotes</li>
                <li>We'll email you with the best offers</li>
              </ul>

              <p>If you have any questions, feel free to reply to this email with your submission number.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} DealerTrade. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✅ Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw - email failure shouldn't block submission
  }
}

/**
 * Send notification to admin about new submission
 */
export async function sendAdminNotification(ticketNumber: string, vehicleInfo: string) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!isSmtpConfigured || !transporter) {
    console.log('\n📧 ADMIN NOTIFICATION (console mode):');
    console.log(`Ticket: ${ticketNumber}`);
    console.log(`Vehicle: ${vehicleInfo}`);
    console.log('✅ Notification logged\n');
    return;
  }

  if (!adminEmail) return;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@dealertrade.com',
      to: adminEmail,
      subject: `New Vehicle Submission - ${ticketNumber}`,
      html: `
        <h2>New Vehicle Appraisal Submission</h2>
        <p><strong>Ticket:</strong> ${ticketNumber}</p>
        <p><strong>Vehicle:</strong> ${vehicleInfo}</p>
        <p>View in admin dashboard: ${process.env.FRONTEND_URL}/admin/submissions/${ticketNumber}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

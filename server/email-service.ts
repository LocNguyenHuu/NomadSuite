import { Resend } from 'resend';
import type { Invoice, Client, User } from '@shared/schema';
import { generateInvoicePDF } from './pdf-generator';

export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  isConfigured(): boolean {
    return this.resend !== null;
  }

  async sendInvoiceEmail(
    invoice: Invoice,
    client: Client,
    user: User,
    recipientEmail?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      return {
        success: false,
        error: 'Email service not configured. Please add RESEND_API_KEY to your environment variables.'
      };
    }

    const toEmail = recipientEmail || client.email;
    if (!toEmail) {
      return {
        success: false,
        error: 'Client email address not found.'
      };
    }

    const fromEmail = user.email || 'invoices@nomadsuite.app';

    try {
      // Generate PDF as buffer
      const doc = generateInvoicePDF({ invoice, client, user });
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      
      await new Promise<void>((resolve, reject) => {
        doc.on('end', () => resolve());
        doc.on('error', reject);
        doc.end();
      });

      const pdfBuffer = Buffer.concat(chunks);

      // Send email with PDF attachment
      const { data, error } = await this.resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `Invoice ${invoice.invoiceNumber} from ${user.businessName || user.name}`,
        html: this.generateEmailHTML(invoice, client, user),
        attachments: [
          {
            filename: `invoice-${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error('Resend error:', error);
        return {
          success: false,
          error: error.message || 'Failed to send email'
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private generateEmailHTML(invoice: Invoice, client: Client, user: User): string {
    const supplierName = user.businessName || user.name;
    const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              border-bottom: 3px solid #0066cc;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .invoice-details {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .amount {
              font-size: 24px;
              font-weight: bold;
              color: #0066cc;
              margin: 10px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; color: #0066cc;">Invoice from ${supplierName}</h1>
          </div>
          
          <p>Dear ${client.name},</p>
          
          <p>Thank you for your business. Please find attached invoice <strong>${invoice.invoiceNumber}</strong>.</p>
          
          <div class="invoice-details">
            <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${dueDate}</p>
            <p style="margin: 5px 0;"><strong>Amount Due:</strong></p>
            <div class="amount">${invoice.currency} ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          
          <p>The invoice is attached to this email as a PDF document.</p>
          
          ${invoice.reverseCharge ? '<p style="background: #fff3cd; padding: 15px; border-radius: 5px;"><strong>Note:</strong> This invoice uses reverse charge mechanism. You are responsible for accounting for VAT.</p>' : ''}
          
          <p>If you have any questions about this invoice, please don't hesitate to contact me.</p>
          
          <p>Best regards,<br>${user.name}</p>
          
          <div class="footer">
            <p>This invoice was generated and sent via NomadSuite.</p>
            ${user.businessAddress ? `<p>${user.businessAddress}</p>` : ''}
            ${user.vatId ? `<p>VAT ID: ${user.vatId}</p>` : ''}
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();

import PDFDocument from 'pdfkit';
import type { Invoice, Client, User } from '@shared/schema';

interface InvoicePDFData {
  invoice: Invoice;
  client: Client;
  user: User;
}

export function generateInvoicePDF(data: InvoicePDFData): PDFKit.PDFDocument {
  const { invoice, client, user } = data;
  const doc = new PDFDocument({ margin: 50 });

  // Header
  doc.fontSize(20).text('INVOICE', { align: 'right' });
  doc.moveDown(0.5);
  
  // Invoice details (top right)
  doc.fontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, { align: 'right' });
  doc.text(`Date: ${invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}`, { align: 'right' });
  doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, { align: 'right' });
  doc.text(`Currency: ${invoice.currency}`, { align: 'right' });
  if (invoice.language && invoice.language !== 'en') {
    doc.text(`Language: ${invoice.language.toUpperCase()}`, { align: 'right' });
  }
  
  doc.moveDown(2);
  
  // From (Supplier) - left side
  doc.fontSize(12).text('From:', 50, 150);
  doc.fontSize(10);
  doc.text(user.name || 'Your Business', 50, 170);
  if (user.businessName) {
    doc.text(user.businessName, 50, 185);
  }
  if (user.businessAddress) {
    doc.text(user.businessAddress, 50, 200, { width: 250 });
  }
  if (user.vatId) {
    doc.text(`VAT ID: ${user.vatId}`, 50, 230);
  }
  if (user.email) {
    doc.text(`Email: ${user.email}`, 50, 245);
  }
  
  // To (Customer) - right side
  doc.fontSize(12).text('Bill To:', 350, 150);
  doc.fontSize(10);
  doc.text(client.name, 350, 170);
  if (client.email) {
    doc.text(client.email, 350, 185);
  }
  if (client.country) {
    doc.text(`Country: ${client.country}`, 350, 200);
  }
  if (invoice.customerVatId) {
    doc.text(`Customer VAT ID: ${invoice.customerVatId}`, 350, 215);
  }
  
  // Items table
  const tableTop = 320;
  doc.moveDown(2);
  
  // Table header
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Description', 50, tableTop);
  doc.text('Amount', 450, tableTop, { align: 'right', width: 100 });
  
  // Line under header
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  
  // Table items
  doc.font('Helvetica');
  let yPosition = tableTop + 25;
  
  const items = invoice.items as { description: string; amount: number }[];
  items.forEach((item, index) => {
    doc.text(item.description, 50, yPosition, { width: 380 });
    doc.text(
      `${invoice.currency} ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      450,
      yPosition,
      { align: 'right', width: 100 }
    );
    yPosition += 30;
  });
  
  // Subtotal, tax, total
  yPosition += 10;
  doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
  yPosition += 15;
  
  // Total
  doc.font('Helvetica-Bold');
  doc.fontSize(12);
  doc.text('TOTAL', 350, yPosition);
  doc.text(
    `${invoice.currency} ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    450,
    yPosition,
    { align: 'right', width: 100 }
  );
  
  // Compliance notes
  yPosition += 40;
  doc.font('Helvetica');
  doc.fontSize(9);
  
  if (invoice.reverseCharge) {
    doc.text(
      'Reverse Charge: VAT reverse charge applies. Customer is responsible for VAT payment.',
      50,
      yPosition,
      { width: 500, align: 'left' }
    );
    yPosition += 30;
  }
  
  if (user.taxRegime === 'kleinunternehmer') {
    doc.text(
      'Tax Note: Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
      50,
      yPosition,
      { width: 500, align: 'left' }
    );
    yPosition += 30;
  }
  
  if (invoice.exchangeRate && invoice.exchangeRate !== '1.0' && invoice.exchangeRate !== '1') {
    doc.text(
      `Exchange Rate: ${invoice.exchangeRate} (for reference only)`,
      50,
      yPosition,
      { width: 500, align: 'left' }
    );
    yPosition += 30;
  }
  
  // Payment terms at bottom
  yPosition = 700;
  doc.fontSize(8).fillColor('gray');
  doc.text(
    'Payment Terms: Payment is due by the due date shown above. Please reference the invoice number on your payment.',
    50,
    yPosition,
    { width: 500, align: 'center' }
  );
  
  // Footer
  doc.fontSize(8);
  doc.text(
    `Invoice generated on ${new Date().toLocaleDateString()} by NomadSuite`,
    50,
    750,
    { align: 'center', width: 500 }
  );
  
  return doc;
}

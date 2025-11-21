import PDFDocument from 'pdfkit';
import type { Invoice, Client, User } from '@shared/schema';
import { getTranslations, formatDate, formatCurrency } from './i18n-invoice';

interface InvoicePDFData {
  invoice: Invoice;
  client: Client;
  user: User;
}

export function generateInvoicePDF(data: InvoicePDFData): PDFKit.PDFDocument {
  const { invoice, client, user } = data;
  const doc = new PDFDocument({ margin: 50 });
  
  // Get localized translations
  const lang = invoice.language || 'en';
  const t = getTranslations(lang);

  // Header
  doc.fontSize(20).text(t.invoice, { align: 'right' });
  doc.moveDown(0.5);
  
  // Invoice details (top right)
  doc.fontSize(10);
  doc.text(`${t.invoiceNumber}: ${invoice.invoiceNumber}`, { align: 'right' });
  doc.text(`${t.date}: ${invoice.issuedAt ? formatDate(new Date(invoice.issuedAt), lang) : formatDate(new Date(), lang)}`, { align: 'right' });
  doc.text(`${t.dueDate}: ${formatDate(new Date(invoice.dueDate), lang)}`, { align: 'right' });
  doc.text(`${t.currency}: ${invoice.currency}`, { align: 'right' });
  if (invoice.language && invoice.language !== 'en') {
    doc.text(`${t.language}: ${invoice.language.toUpperCase()}`, { align: 'right' });
  }
  
  doc.moveDown(2);
  
  // From (Supplier) - left side
  doc.fontSize(12).text(t.from, 50, 150);
  doc.fontSize(10);
  doc.text(user.name || 'Your Business', 50, 170);
  if (user.businessName) {
    doc.text(user.businessName, 50, 185);
  }
  if (user.businessAddress) {
    doc.text(user.businessAddress, 50, 200, { width: 250 });
  }
  if (user.vatId) {
    doc.text(`${t.vatId}: ${user.vatId}`, 50, 230);
  }
  if (user.email) {
    doc.text(`${t.email}: ${user.email}`, 50, 245);
  }
  
  // To (Customer) - right side
  doc.fontSize(12).text(t.billTo, 350, 150);
  doc.fontSize(10);
  doc.text(client.name, 350, 170);
  if (client.email) {
    doc.text(client.email, 350, 185);
  }
  if (client.country) {
    doc.text(`${t.country}: ${client.country}`, 350, 200);
  }
  if (invoice.customerVatId) {
    doc.text(`${t.customerVatId}: ${invoice.customerVatId}`, 350, 215);
  }
  
  // Items table
  const tableTop = 320;
  doc.moveDown(2);
  
  // Table header
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text(t.description, 50, tableTop);
  doc.text(t.quantity, 320, tableTop, { width: 40 });
  doc.text(t.unitPrice, 370, tableTop, { width: 60, align: 'right' });
  doc.text(t.subtotal, 450, tableTop, { align: 'right', width: 100 });
  
  // Line under header
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  
  // Table items
  doc.font('Helvetica');
  let yPosition = tableTop + 25;
  
  const items = invoice.items as any[];
  items.forEach((item) => {
    // Support both old and new format for backward compatibility
    if ('unitPrice' in item && 'quantity' in item) {
      // New format with detailed line items
      doc.text(item.description, 50, yPosition, { width: 260 });
      doc.text(item.quantity.toString(), 320, yPosition, { width: 40 });
      doc.text(
        `${invoice.currency} ${(item.unitPrice / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        370,
        yPosition,
        { width: 60, align: 'right' }
      );
      doc.text(
        `${invoice.currency} ${(item.subtotal / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        450,
        yPosition,
        { align: 'right', width: 100 }
      );
    } else {
      // Old format (fallback for backward compatibility)
      doc.text(item.description, 50, yPosition, { width: 380 });
      doc.text(
        `${invoice.currency} ${(item.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        450,
        yPosition,
        { align: 'right', width: 100 }
      );
    }
    yPosition += 30;
  });
  
  // Subtotal, tax, total section
  yPosition += 10;
  doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
  yPosition += 15;
  
  // Subtotal
  const subtotal = invoice.amount - (invoice.tax || 0);
  doc.font('Helvetica');
  doc.fontSize(10);
  doc.text(t.subtotalLabel, 350, yPosition);
  doc.text(
    formatCurrency(subtotal, invoice.currency, lang),
    450,
    yPosition,
    { align: 'right', width: 100 }
  );
  yPosition += 20;
  
  // Tax (if applicable)
  if (invoice.tax && invoice.tax > 0) {
    doc.text(t.tax, 350, yPosition);
    doc.text(
      formatCurrency(invoice.tax, invoice.currency, lang),
      450,
      yPosition,
      { align: 'right', width: 100 }
    );
    yPosition += 20;
  }
  
  // Total
  doc.font('Helvetica-Bold');
  doc.fontSize(12);
  doc.text(t.total, 350, yPosition);
  doc.text(
    formatCurrency(invoice.amount, invoice.currency, lang),
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
      `${t.reverseCharge}: ${t.reverseChargeNote}`,
      50,
      yPosition,
      { width: 500, align: 'left' }
    );
    yPosition += 25;
  }
  
  if (user.taxRegime === 'kleinunternehmer') {
    const kleinunternehmerText = lang === 'de' 
      ? 'Steuerhinweis: Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
      : 'Tax Note: No VAT charged under small business exemption (§19 UStG).';
    doc.text(
      kleinunternehmerText,
      50,
      yPosition,
      { width: 500, align: 'left' }
    );
    yPosition += 25;
  }
  
  if (invoice.exchangeRate && invoice.exchangeRate !== '1.0' && invoice.exchangeRate !== '1') {
    const exchangeRateText = lang === 'de' 
      ? `Wechselkurs: ${invoice.exchangeRate} (nur zur Information)`
      : lang === 'fr'
      ? `Taux de change: ${invoice.exchangeRate} (à titre indicatif)`
      : `Exchange Rate: ${invoice.exchangeRate} (for reference only)`;
    doc.text(
      exchangeRateText,
      50,
      yPosition,
      { width: 500, align: 'left' }
    );
    yPosition += 25;
  }
  
  // Payment terms - positioned dynamically below compliance notes
  yPosition += 30;
  doc.fontSize(8).fillColor('gray');
  doc.text(
    t.paymentTerms,
    50,
    yPosition,
    { width: 500, align: 'center' }
  );
  
  // Footer - positioned at bottom of page
  doc.fontSize(8);
  doc.text(
    t.generatedBy.replace('{date}', formatDate(new Date(), lang)),
    50,
    720,
    { align: 'center', width: 500 }
  );
  
  return doc;
}

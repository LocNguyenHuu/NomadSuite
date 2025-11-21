import { storage } from './storage';

/**
 * Generate next invoice number in format: NS-{year}-{sequential}
 * Example: NS-2025-00012
 * 
 * Sequential number is per user, per year
 */
export async function generateInvoiceNumber(userId: number): Promise<string> {
  const year = new Date().getFullYear();
  
  // Get all invoices for this user in the current year
  const allInvoices = await storage.getInvoices(userId);
  const currentYearInvoices = allInvoices.filter(invoice => {
    const invoiceYear = invoice.issuedAt ? new Date(invoice.issuedAt).getFullYear() : new Date().getFullYear();
    return invoiceYear === year;
  });
  
  // Find the highest sequential number for this year
  let maxNumber = 0;
  currentYearInvoices.forEach(invoice => {
    // Extract number from invoice number (NS-2025-00012 -> 12)
    const match = invoice.invoiceNumber.match(/NS-\d{4}-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  // Increment and format with leading zeros (5 digits)
  const nextNumber = maxNumber + 1;
  const formattedNumber = nextNumber.toString().padStart(5, '0');
  
  return `NS-${year}-${formattedNumber}`;
}

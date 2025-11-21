/**
 * Invoice Status Normalization Utility
 * Ensures consistent status values across all invoice operations
 */

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

/**
 * Normalize invoice status to canonical capitalized format
 * Prevents status inconsistencies from breaking business logic
 */
export function normalizeInvoiceStatus(status: string | undefined): InvoiceStatus {
  if (!status) return 'Draft';
  
  const normalized = status.trim().toLowerCase();
  
  switch (normalized) {
    case 'draft':
      return 'Draft';
    case 'sent':
      return 'Sent';
    case 'paid':
      return 'Paid';
    case 'overdue':
      return 'Overdue';
    default:
      // Default to Draft for unknown statuses
      console.warn(`Unknown invoice status "${status}", defaulting to Draft`);
      return 'Draft';
  }
}

/**
 * Validate if a status string is a valid invoice status
 */
export function isValidInvoiceStatus(status: string): boolean {
  const normalized = normalizeInvoiceStatus(status);
  return ['Draft', 'Sent', 'Paid', 'Overdue'].includes(normalized);
}

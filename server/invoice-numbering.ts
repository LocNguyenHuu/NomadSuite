import { db } from './db';
import { invoiceCounters } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Generate next invoice number in format: {prefix}{year}-{sequential}
 * Example: NS-2025-00012
 * 
 * Sequential number is per user, per year
 * Uses atomic database counter with row-level locking for concurrency safety
 */
export async function generateInvoiceNumber(userId: number, prefix: string = "NS-"): Promise<string> {
  const year = new Date().getFullYear();
  
  // Use database transaction with row-level locking for atomicity
  const result = await db.transaction(async (tx) => {
    // Try to get existing counter with FOR UPDATE lock
    const existingCounter = await tx
      .select()
      .from(invoiceCounters)
      .where(and(
        eq(invoiceCounters.userId, userId),
        eq(invoiceCounters.year, year)
      ))
      .for('update') // Row-level lock
      .limit(1);
    
    let nextNumber: number;
    
    if (existingCounter.length > 0) {
      // Increment existing counter
      nextNumber = existingCounter[0].counter + 1;
      await tx
        .update(invoiceCounters)
        .set({ counter: nextNumber })
        .where(eq(invoiceCounters.id, existingCounter[0].id));
    } else {
      // Create new counter for this user/year
      nextNumber = 1;
      await tx.insert(invoiceCounters).values({
        userId,
        year,
        counter: nextNumber
      });
    }
    
    return nextNumber;
  });
  
  // Format with leading zeros (5 digits)
  const formattedNumber = result.toString().padStart(5, '0');
  
  return `${prefix}${year}-${formattedNumber}`;
}

/**
 * FX Rate Service using exchangerate.host API (free tier)
 * Provides real-time currency exchange rates
 */

interface ExchangeRateResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

const EXCHANGE_RATE_API = 'https://api.exchangerate.host/latest';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Simple in-memory cache
const cache: Map<string, { rate: number; timestamp: number }> = new Map();

/**
 * Get exchange rate from base currency to target currency
 * @param from Base currency code (e.g., 'USD')
 * @param to Target currency code (e.g., 'EUR')
 * @returns Exchange rate (e.g., 0.85 means 1 USD = 0.85 EUR)
 */
export async function getExchangeRate(from: string, to: string): Promise<number> {
  // If same currency, rate is 1
  if (from === to) {
    return 1.0;
  }

  const cacheKey = `${from}-${to}`;
  const now = Date.now();

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.rate;
  }

  try {
    // Fetch from API with base currency
    const response = await fetch(`${EXCHANGE_RATE_API}?base=${from}`);
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();

    if (!data.success || !data.rates[to]) {
      throw new Error(`Exchange rate not available for ${from} to ${to}`);
    }

    const rate = data.rates[to];

    // Cache the result
    cache.set(cacheKey, { rate, timestamp: now });

    return rate;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    
    // Return cached rate if available, even if expired
    if (cached) {
      console.log('Using expired cache for exchange rate');
      return cached.rate;
    }

    // Fallback to 1.0 if no data available
    console.warn(`No exchange rate data available for ${from} to ${to}, using 1.0`);
    return 1.0;
  }
}

/**
 * Convert amount from one currency to another
 * @param amount Amount in base currency (in cents)
 * @param from Base currency
 * @param to Target currency
 * @returns Converted amount in target currency (in cents)
 */
export async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  const rate = await getExchangeRate(from, to);
  return Math.round(amount * rate);
}

import { differenceInDays, isWithinInterval, startOfYear, endOfYear, subDays, addDays } from 'date-fns';

export interface Trip {
  id: number;
  country: string;
  entryDate: Date;
  exitDate: Date | null;
}

export interface CountryDays {
  country: string;
  days: number;
  alertLevel: 'none' | 'yellow' | 'red';
  message: string;
}

export interface SchengenStatus {
  daysUsed: number;
  daysRemaining: number;
  alertLevel: 'none' | 'yellow' | 'red';
  message: string;
}

export interface TravelSummary {
  totalCountries: number;
  countrySummaries: Array<{
    country: string;
    totalDays: number;
    visits: number;
    longestStay: number;
  }>;
}

// Schengen Area countries
const SCHENGEN_COUNTRIES = [
  'Austria', 'Belgium', 'Croatia', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Iceland', 'Italy', 'Latvia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway',
  'Poland', 'Portugal', 'Slovakia', 'Slovenia', 'Spain',
  'Sweden', 'Switzerland'
];

/**
 * Calculate days in a trip (inclusive of both entry and exit dates)
 */
export function calculateTripDays(entryDate: Date, exitDate: Date | null): number {
  const exit = exitDate || new Date(); // Use today if still traveling
  return differenceInDays(exit, entryDate) + 1; // +1 to include both entry and exit days
}

/**
 * Check if two trips overlap
 */
export function tripsOverlap(trip1: { entryDate: Date; exitDate: Date | null }, trip2: { entryDate: Date; exitDate: Date | null }): boolean {
  const exit1 = trip1.exitDate || new Date();
  const exit2 = trip2.exitDate || new Date();
  
  // Trip 1 starts during trip 2, or trip 2 starts during trip 1
  return (
    isWithinInterval(trip1.entryDate, { start: trip2.entryDate, end: exit2 }) ||
    isWithinInterval(trip2.entryDate, { start: trip1.entryDate, end: exit1 }) ||
    isWithinInterval(exit1, { start: trip2.entryDate, end: exit2 }) ||
    isWithinInterval(exit2, { start: trip1.entryDate, end: exit1 })
  );
}

/**
 * Validate trip doesn't overlap with existing trips
 */
export function validateNoOverlap(newTrip: { entryDate: Date; exitDate: Date | null }, existingTrips: Trip[], excludeTripId?: number): { valid: boolean; message?: string } {
  const relevantTrips = excludeTripId 
    ? existingTrips.filter(t => t.id !== excludeTripId)
    : existingTrips;

  for (const trip of relevantTrips) {
    if (tripsOverlap(newTrip, trip)) {
      const tripCountry = trip.country;
      const tripDate = trip.entryDate.toISOString().split('T')[0];
      return {
        valid: false,
        message: `Trip overlaps with existing trip to ${tripCountry} starting ${tripDate}`
      };
    }
  }
  
  return { valid: true };
}

/**
 * Calculate 183-day rule for tax residency (per country, per calendar year)
 */
export function calculate183DayRule(trips: Trip[], year: number = new Date().getFullYear()): CountryDays[] {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 0, 1));
  
  // Group trips by country
  const countryDays = new Map<string, number>();
  
  trips.forEach(trip => {
    const exit = trip.exitDate || new Date();
    
    // Only count trips that overlap with the target year
    if (exit < yearStart || trip.entryDate > yearEnd) {
      return;
    }
    
    // Calculate overlap with the year
    const overlapStart = trip.entryDate > yearStart ? trip.entryDate : yearStart;
    const overlapEnd = exit < yearEnd ? exit : yearEnd;
    
    const days = differenceInDays(overlapEnd, overlapStart) + 1;
    
    const current = countryDays.get(trip.country) || 0;
    countryDays.set(trip.country, current + days);
  });
  
  // Convert to array with alert levels
  return Array.from(countryDays.entries()).map(([country, days]) => {
    let alertLevel: 'none' | 'yellow' | 'red' = 'none';
    let message = `${days} days in ${year}`;
    
    if (days > 180) {
      alertLevel = 'red';
      message = `Tax residency risk! ${days} days exceeds 183-day threshold in ${year}`;
    } else if (days > 150) {
      alertLevel = 'yellow';
      message = `Approaching tax residency threshold: ${days}/183 days in ${year}`;
    }
    
    return { country, days, alertLevel, message };
  }).sort((a, b) => b.days - a.days);
}

/**
 * Calculate Schengen 90/180 rolling window
 */
export function calculateSchengen90_180(trips: Trip[]): SchengenStatus {
  const today = new Date();
  const windowStart = subDays(today, 180);
  
  // Filter Schengen trips within the rolling 180-day window
  const schengenTrips = trips.filter(trip => 
    SCHENGEN_COUNTRIES.includes(trip.country) &&
    (trip.exitDate === null || trip.exitDate >= windowStart) &&
    trip.entryDate <= today
  );
  
  let totalDays = 0;
  
  schengenTrips.forEach(trip => {
    const exit = trip.exitDate || today;
    
    // Calculate overlap with the 180-day window
    const overlapStart = trip.entryDate > windowStart ? trip.entryDate : windowStart;
    const overlapEnd = exit < today ? exit : today;
    
    if (overlapEnd >= overlapStart) {
      const days = differenceInDays(overlapEnd, overlapStart) + 1;
      totalDays += days;
    }
  });
  
  const daysRemaining = Math.max(0, 90 - totalDays);
  
  let alertLevel: 'none' | 'yellow' | 'red' = 'none';
  let message = `${totalDays}/90 days used in last 180 days`;
  
  if (daysRemaining < 10) {
    alertLevel = 'red';
    message = `Critical: Only ${daysRemaining} Schengen days remaining!`;
  } else if (daysRemaining < 20) {
    alertLevel = 'yellow';
    message = `Warning: Only ${daysRemaining} Schengen days remaining`;
  }
  
  return {
    daysUsed: totalDays,
    daysRemaining,
    alertLevel,
    message
  };
}

/**
 * Calculate lifetime travel summary
 */
export function calculateTravelSummary(trips: Trip[]): TravelSummary {
  const countryMap = new Map<string, { totalDays: number; visits: number; longestStay: number }>();
  
  trips.forEach(trip => {
    const days = calculateTripDays(trip.entryDate, trip.exitDate);
    const current = countryMap.get(trip.country) || { totalDays: 0, visits: 0, longestStay: 0 };
    
    countryMap.set(trip.country, {
      totalDays: current.totalDays + days,
      visits: current.visits + 1,
      longestStay: Math.max(current.longestStay, days)
    });
  });
  
  const countrySummaries = Array.from(countryMap.entries())
    .map(([country, stats]) => ({ country, ...stats }))
    .sort((a, b) => b.totalDays - a.totalDays);
  
  return {
    totalCountries: countryMap.size,
    countrySummaries
  };
}

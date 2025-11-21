import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWithinInterval, addMonths, subMonths } from 'date-fns';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Trip {
  id: number;
  country: string;
  entryDate: Date;
  exitDate: Date | null;
}

interface TravelCalendarProps {
  trips: Trip[];
}

// Color palette for countries
const COUNTRY_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-amber-500',
];

export function TravelCalendar({ trips }: TravelCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create a mapping of countries to colors
  const countries = Array.from(new Set(trips.map(t => t.country)));
  const countryColors = new Map<string, string>();
  countries.forEach((country, index) => {
    countryColors.set(country, COUNTRY_COLORS[index % COUNTRY_COLORS.length]);
  });

  const getTripsForDay = (day: Date): Trip[] => {
    return trips.filter(trip => {
      const exitDate = trip.exitDate || new Date();
      return isWithinInterval(day, { start: trip.entryDate, end: exitDate });
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get first day of the month's day of week (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Travel Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday} data-testid="button-calendar-today">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth} data-testid="button-calendar-prev">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[140px] text-center font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <Button variant="ghost" size="icon" onClick={goToNextMonth} data-testid="button-calendar-next">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {days.map(day => {
            const dayTrips = getTripsForDay(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div
                key={day.toISOString()}
                className={`aspect-square border rounded-md p-1 relative ${
                  !isSameMonth(day, currentDate) ? 'opacity-30' : ''
                } ${isToday ? 'ring-2 ring-primary' : ''}`}
                data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
              >
                <div className="text-xs font-medium mb-1">{format(day, 'd')}</div>
                <div className="flex flex-wrap gap-0.5">
                  {dayTrips.slice(0, 2).map((trip, index) => (
                    <div
                      key={trip.id}
                      className={`h-1 w-full rounded-full ${countryColors.get(trip.country)}`}
                      title={trip.country}
                    />
                  ))}
                  {dayTrips.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{dayTrips.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {countries.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Countries</div>
            <div className="flex flex-wrap gap-2">
              {countries.map(country => (
                <div key={country} className="flex items-center gap-1.5">
                  <div className={`h-3 w-3 rounded-full ${countryColors.get(country)}`} />
                  <span className="text-xs">{country}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

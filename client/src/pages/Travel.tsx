import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { MapPin, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Progress } from '@/components/ui/progress';

export default function Travel() {
  const { trips, user } = useStore();
  
  // Mock calculation for Schengen
  const schengenUsed = 42;
  const schengenLimit = 90;
  const schengenPercent = (schengenUsed / schengenLimit) * 100;

  // Mock calculation for Tax Residency (183 day rule)
  const taxResidencyUsed = 120;
  const taxLimit = 183;
  const taxPercent = (taxResidencyUsed / taxLimit) * 100;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Travel Log</h2>
          <p className="text-muted-foreground">Monitor your residency status and visa limits.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base font-medium">
                <span>Schengen Area (90/180)</span>
                <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full">{schengenUsed} / {schengenLimit} Days</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={schengenPercent} className="h-2" indicatorClassName={schengenPercent > 80 ? 'bg-red-500' : 'bg-primary'} />
              <p className="text-xs text-muted-foreground mt-2">
                {90 - schengenUsed} days remaining before you must exit the Schengen zone.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base font-medium">
                <span>Tax Residency Risk (Japan)</span>
                <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full">{taxResidencyUsed} / {taxLimit} Days</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={taxPercent} className="h-2" indicatorClassName={taxPercent > 70 ? 'bg-orange-500' : 'bg-emerald-500'} />
              <p className="text-xs text-muted-foreground mt-2">
                Approaching tax residency threshold. {183 - taxResidencyUsed} days safe harbor remaining.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="relative pl-6 border-l border-border space-y-8">
          {trips.map((trip, i) => (
            <div key={trip.id} className="relative group">
              <div className="absolute -left-[29px] top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-background group-hover:border-primary group-hover:text-primary transition-colors">
                <MapPin className="h-3 w-3" />
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {trip.country}
                    {i === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(new Date(trip.entryDate), 'MMM d, yyyy')} 
                    {trip.exitDate ? ` — ${format(new Date(trip.exitDate), 'MMM d, yyyy')}` : ' — Present'}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{trip.notes}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded-md">
                    {trip.exitDate 
                      ? `${differenceInDays(new Date(trip.exitDate), new Date(trip.entryDate))} days` 
                      : `${differenceInDays(new Date(), new Date(trip.entryDate))} days so far`
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TravelCalendar } from '@/components/TravelCalendar';
import { useTrips } from '@/hooks/use-trips';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Calendar as CalendarIcon, Plus, AlertTriangle, Globe, TrendingUp } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { InsertTrip } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAppI18n } from '@/contexts/AppI18nContext';

interface CountryDays {
  country: string;
  days: number;
  alertLevel: 'none' | 'yellow' | 'red';
  message: string;
}

interface SchengenStatus {
  daysUsed: number;
  daysRemaining: number;
  alertLevel: 'none' | 'yellow' | 'red';
  message: string;
}

interface TravelSummary {
  totalCountries: number;
  countrySummaries: Array<{
    country: string;
    totalDays: number;
    visits: number;
    longestStay: number;
  }>;
}

export default function Travel() {
  const { t } = useAppI18n();
  const { trips, createTrip } = useTrips();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<InsertTrip>();
  const { toast } = useToast();

  // Fetch calculations from backend
  const { data: taxResidency } = useQuery<CountryDays[]>({
    queryKey: ['/api/trips/calculations/tax-residency'],
    enabled: trips.length > 0
  });

  const { data: schengen } = useQuery<SchengenStatus>({
    queryKey: ['/api/trips/calculations/schengen'],
    enabled: trips.length > 0
  });

  const { data: summary } = useQuery<TravelSummary>({
    queryKey: ['/api/trips/calculations/summary'],
    enabled: trips.length > 0
  });

  const onSubmit = async (data: any) => {
    try {
      await createTrip({
        ...data,
        entryDate: new Date(data.entryDate),
        exitDate: data.exitDate ? new Date(data.exitDate) : undefined
      });
      setOpen(false);
      reset();
      toast({
        title: "Trip added",
        description: "Your trip has been logged successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add trip. Check for overlapping dates.",
        variant: "destructive",
      });
    }
  };

  const schengenPercent = schengen ? (schengen.daysUsed / 90) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="app-page-header">
            <h1 className="app-page-title">{t('travel.title')}</h1>
            <p className="app-page-description">Monitor your residency status and visa limits</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-trip">
                <Plus className="mr-1.5 h-4 w-4" /> Add Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    placeholder="Japan" 
                    {...register('country', { required: true })} 
                    data-testid="input-trip-country"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entryDate">Entry Date</Label>
                  <Input 
                    id="entryDate" 
                    type="date" 
                    {...register('entryDate', { required: true })} 
                    data-testid="input-trip-entry"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exitDate">Exit Date (Optional)</Label>
                  <Input 
                    id="exitDate" 
                    type="date" 
                    {...register('exitDate')} 
                    data-testid="input-trip-exit"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if currently traveling</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Vacation..." 
                    {...register('notes')} 
                    data-testid="input-trip-notes"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" data-testid="button-save-trip">Save Trip</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alert Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Schengen Card */}
          <Card className={`shadow-sm border-border/50 ${schengen?.alertLevel === 'red' ? 'border-red-500' : schengen?.alertLevel === 'yellow' ? 'border-yellow-500' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base font-medium">
                <span className="flex items-center gap-2">
                  Schengen Area (90/180)
                  {schengen?.alertLevel !== 'none' && (
                    <AlertTriangle className={`h-4 w-4 ${schengen?.alertLevel === 'red' ? 'text-red-500' : 'text-yellow-500'}`} />
                  )}
                </span>
                <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full" data-testid="text-schengen-days">
                  {schengen?.daysUsed || 0} / 90 Days
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={schengenPercent} 
                className="h-2" 
                indicatorClassName={
                  schengen?.alertLevel === 'red' ? 'bg-red-500' : 
                  schengen?.alertLevel === 'yellow' ? 'bg-yellow-500' : 
                  'bg-primary'
                } 
              />
              <p className={`text-xs mt-2 ${schengen?.alertLevel === 'red' ? 'text-red-600 font-semibold' : schengen?.alertLevel === 'yellow' ? 'text-yellow-600 font-semibold' : 'text-muted-foreground'}`}>
                {schengen?.message || 'No Schengen trips logged yet'}
              </p>
            </CardContent>
          </Card>

          {/* Top Tax Residency Risk Card */}
          {taxResidency && taxResidency.length > 0 && (
            <Card className={`shadow-sm border-border/50 ${taxResidency[0].alertLevel === 'red' ? 'border-red-500' : taxResidency[0].alertLevel === 'yellow' ? 'border-yellow-500' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base font-medium">
                  <span className="flex items-center gap-2">
                    Tax Residency Risk ({taxResidency[0].country})
                    {taxResidency[0].alertLevel !== 'none' && (
                      <AlertTriangle className={`h-4 w-4 ${taxResidency[0].alertLevel === 'red' ? 'text-red-500' : 'text-yellow-500'}`} />
                    )}
                  </span>
                  <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full" data-testid="text-tax-residency-days">
                    {taxResidency[0].days} / 183 Days
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={(taxResidency[0].days / 183) * 100} 
                  className="h-2" 
                  indicatorClassName={
                    taxResidency[0].alertLevel === 'red' ? 'bg-red-500' : 
                    taxResidency[0].alertLevel === 'yellow' ? 'bg-orange-500' : 
                    'bg-emerald-500'
                  } 
                />
                <p className={`text-xs mt-2 ${taxResidency[0].alertLevel === 'red' ? 'text-red-600 font-semibold' : taxResidency[0].alertLevel === 'yellow' ? 'text-yellow-600 font-semibold' : 'text-muted-foreground'}`}>
                  {taxResidency[0].message}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        {summary && summary.totalCountries > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold" data-testid="text-total-countries">{summary.totalCountries}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold" data-testid="text-total-trips">{trips.length}</span>
                </div>
              </CardContent>
            </Card>

            {summary.countrySummaries[0] && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Most Visited</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold" data-testid="text-most-visited">{summary.countrySummaries[0].country}</div>
                    <div className="text-xs text-muted-foreground">{summary.countrySummaries[0].totalDays} days</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Longest Stay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold" data-testid="text-longest-stay">{summary.countrySummaries[0].longestStay}</span>
                      <span className="text-xs text-muted-foreground">days</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Calendar View */}
        {trips.length > 0 && (
          <TravelCalendar trips={trips} />
        )}

        {/* Tax Residency Alerts by Country */}
        {taxResidency && taxResidency.filter(c => c.alertLevel !== 'none').length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Tax Residency Alerts</h3>
            <div className="space-y-3">
              {taxResidency.filter(c => c.alertLevel !== 'none').map(country => (
                <Alert key={country.country} className={country.alertLevel === 'red' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}>
                  <AlertTriangle className={`h-4 w-4 ${country.alertLevel === 'red' ? 'text-red-600' : 'text-yellow-600'}`} />
                  <AlertDescription className={country.alertLevel === 'red' ? 'text-red-900' : 'text-yellow-900'}>
                    <strong>{country.country}:</strong> {country.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Trip Timeline */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Trip History</h3>
          <div className="relative pl-6 border-l border-border space-y-8">
            {trips.map((trip, i) => {
              const days = trip.exitDate 
                ? differenceInDays(new Date(trip.exitDate), new Date(trip.entryDate)) + 1
                : differenceInDays(new Date(), new Date(trip.entryDate)) + 1;

              return (
                <div key={trip.id} className="relative group">
                  <div className="absolute -left-[29px] top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-background group-hover:border-primary group-hover:text-primary transition-colors">
                    <MapPin className="h-3 w-3" />
                  </div>
                  <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {trip.country}
                        {i === 0 && !trip.exitDate && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>
                        )}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {format(new Date(trip.entryDate), 'MMM d, yyyy')} 
                        {trip.exitDate ? ` — ${format(new Date(trip.exitDate), 'MMM d, yyyy')}` : ' — Present'}
                      </div>
                    </div>
                    {trip.notes && <p className="text-sm text-muted-foreground mt-2">{trip.notes}</p>}
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span className="bg-muted px-2 py-1 rounded-md">
                        {trip.exitDate ? `${days} days` : `${days} days so far`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {trips.length === 0 && (
              <div className="text-muted-foreground text-sm">
                No trips logged yet. Start adding your travel history to see calculations and insights!
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

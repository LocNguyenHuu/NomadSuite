import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrips } from '@/hooks/use-trips';
import { MapPin, Calendar as CalendarIcon, Plus } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { InsertTrip } from '@shared/schema';

export default function Travel() {
  const { trips, createTrip } = useTrips();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<InsertTrip>();
  
  // Mock calculation for Schengen
  const schengenUsed = 42;
  const schengenLimit = 90;
  const schengenPercent = (schengenUsed / schengenLimit) * 100;

  // Mock calculation for Tax Residency (183 day rule)
  const taxResidencyUsed = 120;
  const taxLimit = 183;
  const taxPercent = (taxResidencyUsed / taxLimit) * 100;

  const onSubmit = (data: any) => {
    createTrip({
      ...data,
      entryDate: new Date(data.entryDate),
      exitDate: data.exitDate ? new Date(data.exitDate) : undefined
    });
    setOpen(false);
    reset();
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight">Travel Log</h2>
            <p className="text-muted-foreground">Monitor your residency status and visa limits.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Add Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="Japan" {...register('country', { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entryDate">Entry Date</Label>
                  <Input id="entryDate" type="date" {...register('entryDate', { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exitDate">Exit Date (Optional)</Label>
                  <Input id="exitDate" type="date" {...register('exitDate')} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Vacation..." {...register('notes')} />
                </div>
                <DialogFooter>
                  <Button type="submit">Save Trip</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                    {i === 0 && !trip.exitDate && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>}
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
          {trips.length === 0 && (
             <div className="text-muted-foreground text-sm">No trips logged yet. Start adding your travel history!</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

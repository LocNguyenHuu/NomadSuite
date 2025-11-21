import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Trip, InsertTrip } from '@shared/schema';

export function useTrips() {
  const queryClient = useQueryClient();

  const { data: trips, isLoading } = useQuery<Trip[]>({
    queryKey: ['/api/trips'],
    select: (data) => data.map(trip => ({
      ...trip,
      entryDate: new Date(trip.entryDate),
      exitDate: trip.exitDate ? new Date(trip.exitDate) : null
    }))
  });

  const createTripMutation = useMutation({
    mutationFn: async (trip: InsertTrip) => {
      const res = await apiRequest('POST', '/api/trips', trip);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trips/calculations/tax-residency'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trips/calculations/schengen'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trips/calculations/summary'] });
    },
  });

  return {
    trips: trips || [],
    isLoading,
    createTrip: createTripMutation.mutate,
  };
}

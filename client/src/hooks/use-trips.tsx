import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Trip, InsertTrip } from '@shared/schema';

export function useTrips() {
  const queryClient = useQueryClient();

  const { data: trips, isLoading } = useQuery<Trip[]>({
    queryKey: ['/api/trips'],
  });

  const createTripMutation = useMutation({
    mutationFn: async (trip: InsertTrip) => {
      const res = await apiRequest('POST', '/api/trips', trip);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
    },
  });

  return {
    trips: trips || [],
    isLoading,
    createTrip: createTripMutation.mutate,
  };
}

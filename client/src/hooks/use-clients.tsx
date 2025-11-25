import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Client, InsertClient } from '@shared/schema';

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const createClientMutation = useMutation({
    mutationFn: async (client: InsertClient) => {
      const res = await apiRequest('POST', '/api/clients', client);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertClient> }) => {
      const res = await apiRequest('PATCH', `/api/clients/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
    },
  });

  return {
    clients: clients || [],
    isLoading,
    createClient: createClientMutation.mutate,
    createClientAsync: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutate,
    updateClientAsync: updateClientMutation.mutateAsync,
  };
}

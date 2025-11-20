import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Invoice, InsertInvoice } from '@shared/schema';

export function useInvoices() {
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (invoice: InsertInvoice) => {
      const res = await apiRequest('POST', '/api/invoices', invoice);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
    },
  });

  return {
    invoices: invoices || [],
    isLoading,
    createInvoice: createInvoiceMutation.mutate,
  };
}

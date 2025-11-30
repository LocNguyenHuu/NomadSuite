import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Expense, InsertExpense, UpdateExpense } from '@shared/schema';
import { getCsrfToken } from '@/lib/api';

type CreateExpenseInput = Omit<InsertExpense, 'userId'>;

export interface ExpenseWithClient extends Expense {
  clientName?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  expensesByCategory: Array<{ category: string; total: number; count: number }>;
  expensesByMonth: Array<{ month: string; total: number }>;
  expensesByClient: Array<{ clientId: number | null; clientName: string; total: number }>;
}

export function useExpenses() {
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery<ExpenseWithClient[]>({
    queryKey: ['/api/expenses'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<ExpenseStats>({
    queryKey: ['/api/expenses/stats'],
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (expense: CreateExpenseInput) => {
      const res = await apiRequest('POST', '/api/expenses', expense);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/stats'] });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateExpense }) => {
      const res = await apiRequest('PATCH', `/api/expenses/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/stats'] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses/stats'] });
    },
  });

  const uploadReceiptMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('receipt', file);
      
      const headers: Record<string, string> = {};
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['csrf-token'] = csrfToken;
      }
      
      const res = await fetch(`/api/expenses/${id}/receipt`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
    },
  });

  return {
    expenses: expenses || [],
    stats,
    isLoading,
    statsLoading,
    createExpense: createExpenseMutation.mutate,
    createExpenseAsync: createExpenseMutation.mutateAsync,
    updateExpense: updateExpenseMutation.mutate,
    updateExpenseAsync: updateExpenseMutation.mutateAsync,
    deleteExpense: deleteExpenseMutation.mutate,
    deleteExpenseAsync: deleteExpenseMutation.mutateAsync,
    uploadReceipt: uploadReceiptMutation.mutate,
    uploadReceiptAsync: uploadReceiptMutation.mutateAsync,
    isCreating: createExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
    isUploading: uploadReceiptMutation.isPending,
  };
}

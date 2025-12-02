import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { InvoiceTemplate, InsertInvoiceTemplate, UpdateInvoiceTemplate } from '@shared/schema';

export function useTemplates() {
  const queryClient = useQueryClient();

  const templatesQuery = useQuery({
    queryKey: ['/api/templates'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/templates');
      return res.json() as Promise<InvoiceTemplate[]>;
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (data: Omit<InsertInvoiceTemplate, 'userId'>) => {
      const res = await apiRequest('POST', '/api/templates', data);
      return res.json() as Promise<InvoiceTemplate>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateInvoiceTemplate }) => {
      const res = await apiRequest('PATCH', `/api/templates/${id}`, data);
      return res.json() as Promise<InvoiceTemplate>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const cloneTemplate = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/templates/${id}/clone`);
      return res.json() as Promise<InvoiceTemplate>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const setDefaultTemplate = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('POST', `/api/templates/${id}/set-default`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  return {
    templates: templatesQuery.data ?? [],
    isLoading: templatesQuery.isLoading,
    isError: templatesQuery.isError,
    createTemplateAsync: createTemplate.mutateAsync,
    updateTemplateAsync: updateTemplate.mutateAsync,
    deleteTemplateAsync: deleteTemplate.mutateAsync,
    cloneTemplateAsync: cloneTemplate.mutateAsync,
    setDefaultTemplateAsync: setDefaultTemplate.mutateAsync,
    isCreating: createTemplate.isPending,
    isUpdating: updateTemplate.isPending,
    isDeleting: deleteTemplate.isPending,
    isCloning: cloneTemplate.isPending,
    isSettingDefault: setDefaultTemplate.isPending,
  };
}

export function useTemplate(id: number | null) {
  return useQuery({
    queryKey: ['/api/templates', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiRequest('GET', `/api/templates/${id}`);
      return res.json() as Promise<InvoiceTemplate>;
    },
    enabled: id !== null,
  });
}

export function useTemplatePreview(id: number | null) {
  return useQuery({
    queryKey: ['/api/templates', id, 'preview'],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiRequest('GET', `/api/templates/${id}/preview`);
      return res.json();
    },
    enabled: id !== null,
  });
}

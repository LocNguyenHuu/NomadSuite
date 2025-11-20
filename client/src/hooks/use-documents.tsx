import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Document, InsertDocument } from '@shared/schema';

export function useDocuments() {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (doc: InsertDocument) => {
      const res = await apiRequest('POST', '/api/documents', doc);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });

  return {
    documents: documents || [],
    isLoading,
    createDocument: createDocumentMutation.mutate,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project, InsertProject, UpdateProject, Task, InsertTask, UpdateTask, Invoice, Expense } from '@shared/schema';

type CreateProjectInput = Omit<InsertProject, 'userId'>;
type CreateTaskInput = Omit<InsertTask, 'userId' | 'projectId'>;

export interface ProjectWithDetails extends Project {
  clientName?: string;
  taskCount: number;
  completedTaskCount: number;
}

export interface TaskWithProject extends Task {
  projectName: string;
}

export interface ProjectFinancialSummary {
  budget: number;
  totalInvoiced: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalExpenses: number;
  netProfit: number;
}

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery<ProjectWithDetails[]>({
    queryKey: ['/api/projects'],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (project: CreateProjectInput) => {
      const res = await apiRequest('POST', '/api/projects', project);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProject }) => {
      const res = await apiRequest('PATCH', `/api/projects/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  return {
    projects: projects || [],
    isLoading,
    createProject: createProjectMutation.mutate,
    createProjectAsync: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutate,
    updateProjectAsync: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutate,
    deleteProjectAsync: deleteProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  };
}

export function useProject(id: number) {
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ['/api/projects', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/projects/${id}`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: financialSummary, isLoading: financialLoading } = useQuery<ProjectFinancialSummary>({
    queryKey: ['/api/projects', id, 'financial-summary'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/projects/${id}/financial-summary`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: projectInvoices, isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/projects', id, 'invoices'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/projects/${id}/invoices`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: projectExpenses, isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ['/api/projects', id, 'expenses'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/projects/${id}/expenses`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: projectTasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/projects', id, 'tasks'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/projects/${id}/tasks`);
      return res.json();
    },
    enabled: !!id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (data: UpdateProject) => {
      const res = await apiRequest('PATCH', `/api/projects/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', id] });
    },
  });

  return {
    project,
    financialSummary,
    projectInvoices: projectInvoices || [],
    projectExpenses: projectExpenses || [],
    projectTasks: projectTasks || [],
    isLoading: projectLoading || financialLoading || invoicesLoading || expensesLoading || tasksLoading,
    updateProject: updateProjectMutation.mutate,
    updateProjectAsync: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
  };
}

export function useTasks(projectId?: number) {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<TaskWithProject[]>({
    queryKey: projectId ? ['/api/projects', projectId, 'tasks'] : ['/api/tasks'],
    queryFn: async () => {
      const url = projectId ? `/api/projects/${projectId}/tasks` : '/api/tasks';
      const res = await apiRequest('GET', url);
      return res.json();
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async ({ projectId, task }: { projectId: number; task: CreateTaskInput }) => {
      const res = await apiRequest('POST', `/api/projects/${projectId}/tasks`, task);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.projectId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTask }) => {
      const res = await apiRequest('PATCH', `/api/tasks/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'tasks'] });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'tasks'] });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  return {
    tasks: tasks || [],
    isLoading,
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderKanban,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Eye
} from 'lucide-react';
import { useProjects, ProjectWithDetails } from '@/hooks/use-projects';
import { useClients } from '@/hooks/use-clients';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAppI18n } from '@/contexts/AppI18nContext';
import { useLocation } from 'wouter';

const PROJECT_STATUSES = [
  'Planning',
  'In Progress',
  'On Hold',
  'Completed',
  'Cancelled'
] as const;

const STATUS_COLORS: Record<string, string> = {
  'Planning': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-amber-100 text-amber-800',
  'On Hold': 'bg-gray-100 text-gray-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'VND', 'CHF', 'AUD', 'CAD'] as const;

interface ProjectFormData {
  name: string;
  description: string;
  clientId: string;
  status: string;
  budget: string;
  currency: string;
  startDate: string;
  endDate: string;
}

export default function Projects() {
  const { t } = useAppI18n();
  const [, setLocation] = useLocation();
  const { 
    projects, 
    isLoading,
    createProjectAsync, 
    updateProjectAsync, 
    deleteProjectAsync,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProjects();
  const { clients } = useClients();
  const { toast } = useToast();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithDetails | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectWithDetails | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const createForm = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
      clientId: '',
      status: 'Planning',
      budget: '',
      currency: 'USD',
      startDate: '',
      endDate: '',
    }
  });

  const editForm = useForm<ProjectFormData>();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = search === '' || 
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description?.toLowerCase().includes(search.toLowerCase())) ||
      (project.clientName?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (data: ProjectFormData) => {
    try {
      await createProjectAsync({
        name: data.name,
        description: data.description || undefined,
        clientId: data.clientId ? parseInt(data.clientId) : undefined,
        status: data.status as any,
        budget: data.budget ? Math.round(parseFloat(data.budget) * 100) : undefined,
        currency: data.currency,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      });
      toast({ title: t('projects.createSuccess') || 'Project created successfully' });
      setCreateDialogOpen(false);
      createForm.reset();
    } catch (error: any) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = async (data: ProjectFormData) => {
    if (!editingProject) return;
    try {
      await updateProjectAsync({
        id: editingProject.id,
        data: {
          name: data.name,
          description: data.description || undefined,
          clientId: data.clientId ? parseInt(data.clientId) : null,
          status: data.status as any,
          budget: data.budget ? Math.round(parseFloat(data.budget) * 100) : undefined,
          currency: data.currency,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
        }
      });
      toast({ title: t('projects.updateSuccess') || 'Project updated successfully' });
      setEditDialogOpen(false);
      setEditingProject(null);
    } catch (error: any) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProjectAsync(projectToDelete.id);
      toast({ title: t('projects.deleteSuccess') || 'Project deleted successfully' });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error: any) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const openEditDialog = (project: ProjectWithDetails) => {
    setEditingProject(project);
    editForm.reset({
      name: project.name,
      description: project.description || '',
      clientId: project.clientId?.toString() || '',
      status: project.status,
      budget: project.budget ? (project.budget / 100).toString() : '',
      currency: project.currency || 'USD',
      startDate: project.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '',
      endDate: project.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '',
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (project: ProjectWithDetails) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const viewProject = (project: ProjectWithDetails) => {
    setLocation(`/app/projects/${project.id}`);
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6" data-testid="projects-page">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="app-page-header">
            <h1 className="app-page-title" data-testid="text-page-title">
              {t('nav.projects') || 'Projects'}
            </h1>
            <p className="app-page-description">
              {t('projects.subtitle') || 'Manage your projects and track progress'}
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-project">
            <Plus className="mr-1.5 h-4 w-4" />
            {t('projects.createProject') || 'New Project'}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card data-testid="card-total-projects">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.totalProjects') || 'Total Projects'}
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>
          <Card data-testid="card-active-projects">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.activeProjects') || 'Active Projects'}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
            </CardContent>
          </Card>
          <Card data-testid="card-completed-projects">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.completedProjects') || 'Completed'}
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProjects}</div>
            </CardContent>
          </Card>
          <Card data-testid="card-total-budget">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.totalBudget') || 'Total Budget'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(totalBudget / 100).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search') || 'Search projects...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('common.all') || 'All'}</SelectItem>
                  {PROJECT_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-no-projects">
                {search || statusFilter !== 'All' 
                  ? t('projects.noMatchingProjects') || 'No projects match your filters'
                  : t('projects.noProjects') || 'No projects yet. Create your first project!'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('projects.name') || 'Name'}</TableHead>
                    <TableHead>{t('projects.client') || 'Client'}</TableHead>
                    <TableHead>{t('projects.status') || 'Status'}</TableHead>
                    <TableHead>{t('projects.budget') || 'Budget'}</TableHead>
                    <TableHead>{t('projects.progress') || 'Progress'}</TableHead>
                    <TableHead>{t('projects.dates') || 'Dates'}</TableHead>
                    <TableHead className="text-right">{t('common.actions') || 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map(project => {
                    const progress = project.taskCount > 0 
                      ? Math.round((project.completedTaskCount / project.taskCount) * 100) 
                      : 0;
                    return (
                      <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                        <TableCell>
                          <div className="font-medium">{project.name}</div>
                          {project.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {project.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {project.clientName ? (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {project.clientName}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_COLORS[project.status]}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {project.budget ? (
                            <span>{project.currency} {(project.budget / 100).toLocaleString()}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Progress value={progress} className="h-2" />
                            <span className="text-sm text-muted-foreground">
                              {project.completedTaskCount}/{project.taskCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.startDate && (
                            <div className="text-sm">
                              {format(new Date(project.startDate), 'MMM d, yyyy')}
                              {project.endDate && (
                                <> - {format(new Date(project.endDate), 'MMM d, yyyy')}</>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => viewProject(project)}
                              data-testid={`button-view-project-${project.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEditDialog(project)}
                              data-testid={`button-edit-project-${project.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openDeleteDialog(project)}
                              data-testid={`button-delete-project-${project.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('projects.createProject') || 'Create Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('projects.name') || 'Project Name'} *</Label>
                <Input
                  id="name"
                  {...createForm.register('name', { required: true })}
                  placeholder="Enter project name"
                  data-testid="input-project-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('projects.description') || 'Description'}</Label>
                <Textarea
                  id="description"
                  {...createForm.register('description')}
                  placeholder="Enter project description"
                  rows={3}
                  data-testid="input-project-description"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('projects.client') || 'Client'}</Label>
                <Controller
                  name="clientId"
                  control={createForm.control}
                  render={({ field }) => (
                    <Select value={field.value || "none"} onValueChange={(val) => field.onChange(val === "none" ? "" : val)}>
                      <SelectTrigger data-testid="select-client">
                        <SelectValue placeholder="Select client (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No client</SelectItem>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('projects.status') || 'Status'}</Label>
                <Controller
                  name="status"
                  control={createForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">{t('projects.budget') || 'Budget'}</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    {...createForm.register('budget')}
                    placeholder="0.00"
                    data-testid="input-budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('projects.currency') || 'Currency'}</Label>
                  <Controller
                    name="currency"
                    control={createForm.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map(currency => (
                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('projects.startDate') || 'Start Date'}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...createForm.register('startDate')}
                    data-testid="input-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('projects.endDate') || 'End Date'}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...createForm.register('endDate')}
                    data-testid="input-end-date"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  {t('common.cancel') || 'Cancel'}
                </Button>
                <Button type="submit" disabled={isCreating} data-testid="button-submit-create">
                  {isCreating ? t('common.creating') || 'Creating...' : t('common.create') || 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('projects.editProject') || 'Edit Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('projects.name') || 'Project Name'} *</Label>
                <Input
                  id="edit-name"
                  {...editForm.register('name', { required: true })}
                  data-testid="input-edit-project-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t('projects.description') || 'Description'}</Label>
                <Textarea
                  id="edit-description"
                  {...editForm.register('description')}
                  rows={3}
                  data-testid="input-edit-project-description"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('projects.client') || 'Client'}</Label>
                <Controller
                  name="clientId"
                  control={editForm.control}
                  render={({ field }) => (
                    <Select value={field.value || "none"} onValueChange={(val) => field.onChange(val === "none" ? "" : val)}>
                      <SelectTrigger data-testid="select-edit-client">
                        <SelectValue placeholder="Select client (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No client</SelectItem>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('projects.status') || 'Status'}</Label>
                <Controller
                  name="status"
                  control={editForm.control}
                  render={({ field }) => (
                    <Select value={field.value || "Planning"} onValueChange={field.onChange}>
                      <SelectTrigger data-testid="select-edit-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">{t('projects.budget') || 'Budget'}</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    step="0.01"
                    {...editForm.register('budget')}
                    data-testid="input-edit-budget"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('projects.currency') || 'Currency'}</Label>
                  <Controller
                    name="currency"
                    control={editForm.control}
                    render={({ field }) => (
                      <Select value={field.value || "USD"} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-edit-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map(currency => (
                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">{t('projects.startDate') || 'Start Date'}</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    {...editForm.register('startDate')}
                    data-testid="input-edit-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">{t('projects.endDate') || 'End Date'}</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    {...editForm.register('endDate')}
                    data-testid="input-edit-end-date"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  {t('common.cancel') || 'Cancel'}
                </Button>
                <Button type="submit" disabled={isUpdating} data-testid="button-submit-edit">
                  {isUpdating ? t('common.saving') || 'Saving...' : t('common.save') || 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('projects.deleteProject') || 'Delete Project'}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('projects.deleteConfirm') || 'Are you sure you want to delete this project? This will also delete all tasks associated with it. This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel') || 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive hover:bg-destructive/90"
                disabled={isDeleting}
                data-testid="button-confirm-delete"
              >
                {isDeleting ? t('common.deleting') || 'Deleting...' : t('common.delete') || 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}

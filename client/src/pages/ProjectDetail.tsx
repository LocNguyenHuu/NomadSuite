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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  ArrowLeft,
  Edit, 
  Trash2, 
  DollarSign,
  FileText,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo
} from 'lucide-react';
import { useProject, useTasks, ProjectFinancialSummary } from '@/hooks/use-projects';
import { Task } from '@shared/schema';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAppI18n } from '@/contexts/AppI18nContext';
import { useLocation, useRoute } from 'wouter';

const TASK_STATUSES = ['To Do', 'In Progress', 'Done', 'Cancelled'] as const;
const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;

const STATUS_COLORS: Record<string, string> = {
  'To Do': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-amber-100 text-amber-800',
  'Done': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-blue-100 text-blue-800',
  'High': 'bg-orange-100 text-orange-800',
  'Urgent': 'bg-red-100 text-red-800',
};

interface TaskFormData {
  name: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

export default function ProjectDetail() {
  const { t } = useAppI18n();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/app/projects/:id');
  const projectId = params?.id ? parseInt(params.id) : 0;

  const { 
    project,
    financialSummary,
    projectInvoices,
    projectExpenses,
    projectTasks,
    isLoading,
  } = useProject(projectId);

  const {
    createTaskAsync,
    updateTaskAsync,
    deleteTaskAsync,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks(projectId);

  const { toast } = useToast();
  
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const createTaskForm = useForm<TaskFormData>({
    defaultValues: {
      name: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '',
    }
  });

  const editTaskForm = useForm<TaskFormData>();

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await createTaskAsync({
        projectId,
        task: {
          name: data.name,
          description: data.description || undefined,
          status: data.status as any,
          priority: data.priority as any,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        }
      });
      toast({ title: t('projects.taskCreated') || 'Task created successfully' });
      setCreateTaskDialogOpen(false);
      createTaskForm.reset();
    } catch (error: any) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleEditTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    try {
      await updateTaskAsync({
        id: editingTask.id,
        data: {
          name: data.name,
          description: data.description || undefined,
          status: data.status as any,
          priority: data.priority as any,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        }
      });
      toast({ title: t('projects.taskUpdated') || 'Task updated successfully' });
      setEditTaskDialogOpen(false);
      setEditingTask(null);
    } catch (error: any) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTaskAsync(taskToDelete.id);
      toast({ title: t('projects.taskDeleted') || 'Task deleted successfully' });
      setDeleteTaskDialogOpen(false);
      setTaskToDelete(null);
    } catch (error: any) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleToggleTaskComplete = async (task: Task) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
    try {
      await updateTaskAsync({
        id: task.id,
        data: { status: newStatus as any }
      });
    } catch (error: any) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    editTaskForm.reset({
      name: task.name,
      description: task.description || '',
      status: task.status,
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    });
    setEditTaskDialogOpen(true);
  };

  const openDeleteTaskDialog = (task: Task) => {
    setTaskToDelete(task);
    setDeleteTaskDialogOpen(true);
  };

  if (isLoading || !project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
  const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

  return (
    <AppLayout>
      <div className="space-y-6" data-testid="project-detail-page">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation('/app/projects')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" data-testid="text-project-name">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          <Badge className={STATUS_COLORS[project.status] || ''}>
            {project.status}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card data-testid="card-budget">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.budget') || 'Budget'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project.currency || 'USD'} {financialSummary ? (financialSummary.budget / 100).toLocaleString() : '0'}
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-invoiced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.totalInvoiced') || 'Total Invoiced'}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${financialSummary ? (financialSummary.totalInvoiced / 100).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('projects.paid') || 'Paid'}: ${financialSummary ? (financialSummary.paidInvoices / 100).toLocaleString() : '0'}
              </p>
            </CardContent>
          </Card>
          <Card data-testid="card-expenses">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.totalExpenses') || 'Total Expenses'}
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${financialSummary ? (financialSummary.totalExpenses / 100).toLocaleString() : '0'}
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-profit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('projects.netProfit') || 'Net Profit'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${financialSummary && financialSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${financialSummary ? (financialSummary.netProfit / 100).toLocaleString() : '0'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                {t('projects.tasks') || 'Tasks'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Progress value={progress} className="w-32 h-2" />
                <span className="text-sm text-muted-foreground">{completedTasks}/{projectTasks.length}</span>
              </div>
            </div>
            <Button onClick={() => setCreateTaskDialogOpen(true)} data-testid="button-create-task">
              <Plus className="mr-2 h-4 w-4" />
              {t('projects.addTask') || 'Add Task'}
            </Button>
          </CardHeader>
          <CardContent>
            {projectTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('projects.noTasks') || 'No tasks yet. Add your first task!'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>{t('projects.taskName') || 'Task'}</TableHead>
                    <TableHead>{t('projects.status') || 'Status'}</TableHead>
                    <TableHead>{t('projects.priority') || 'Priority'}</TableHead>
                    <TableHead>{t('projects.dueDate') || 'Due Date'}</TableHead>
                    <TableHead className="text-right">{t('common.actions') || 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTasks.map(task => (
                    <TableRow key={task.id} data-testid={`row-task-${task.id}`}>
                      <TableCell>
                        <Checkbox
                          checked={task.status === 'Done'}
                          onCheckedChange={() => handleToggleTaskComplete(task)}
                          data-testid={`checkbox-task-${task.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={task.status === 'Done' ? 'line-through text-muted-foreground' : ''}>
                          <div className="font-medium">{task.name}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[task.status]}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.priority && (
                          <Badge className={PRIORITY_COLORS[task.priority]}>
                            {task.priority}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.dueDate && format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditTaskDialog(task)}
                            data-testid={`button-edit-task-${task.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDeleteTaskDialog(task)}
                            data-testid={`button-delete-task-${task.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices" data-testid="tab-invoices">
              <FileText className="mr-2 h-4 w-4" />
              {t('nav.invoices') || 'Invoices'} ({projectInvoices.length})
            </TabsTrigger>
            <TabsTrigger value="expenses" data-testid="tab-expenses">
              <Receipt className="mr-2 h-4 w-4" />
              {t('nav.expenses') || 'Expenses'} ({projectExpenses.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="invoices">
            <Card>
              <CardContent className="pt-6">
                {projectInvoices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('projects.noInvoices') || 'No invoices linked to this project yet.'}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('invoices.number') || 'Invoice #'}</TableHead>
                        <TableHead>{t('invoices.amount') || 'Amount'}</TableHead>
                        <TableHead>{t('invoices.status') || 'Status'}</TableHead>
                        <TableHead>{t('invoices.dueDate') || 'Due Date'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectInvoices.map(invoice => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.currency} {(invoice.amount / 100).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge>{invoice.status}</Badge>
                          </TableCell>
                          <TableCell>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expenses">
            <Card>
              <CardContent className="pt-6">
                {projectExpenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('projects.noExpenses') || 'No expenses linked to this project yet.'}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('expenses.date') || 'Date'}</TableHead>
                        <TableHead>{t('expenses.category') || 'Category'}</TableHead>
                        <TableHead>{t('expenses.amount') || 'Amount'}</TableHead>
                        <TableHead>{t('expenses.description') || 'Description'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectExpenses.map(expense => (
                        <TableRow key={expense.id}>
                          <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{expense.currency} {(expense.amount / 100).toLocaleString()}</TableCell>
                          <TableCell className="truncate max-w-[200px]">{expense.description || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={createTaskDialogOpen} onOpenChange={setCreateTaskDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('projects.addTask') || 'Add Task'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={createTaskForm.handleSubmit(handleCreateTask)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">{t('projects.taskName') || 'Task Name'} *</Label>
                <Input
                  id="task-name"
                  {...createTaskForm.register('name', { required: true })}
                  placeholder="Enter task name"
                  data-testid="input-task-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">{t('projects.description') || 'Description'}</Label>
                <Textarea
                  id="task-description"
                  {...createTaskForm.register('description')}
                  placeholder="Enter task description"
                  rows={3}
                  data-testid="input-task-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('projects.status') || 'Status'}</Label>
                  <Controller
                    name="status"
                    control={createTaskForm.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-task-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TASK_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('projects.priority') || 'Priority'}</Label>
                  <Controller
                    name="priority"
                    control={createTaskForm.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-task-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TASK_PRIORITIES.map(priority => (
                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-dueDate">{t('projects.dueDate') || 'Due Date'}</Label>
                <Input
                  id="task-dueDate"
                  type="date"
                  {...createTaskForm.register('dueDate')}
                  data-testid="input-task-due-date"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateTaskDialogOpen(false)}>
                  {t('common.cancel') || 'Cancel'}
                </Button>
                <Button type="submit" disabled={isCreating} data-testid="button-submit-task">
                  {isCreating ? t('common.creating') || 'Creating...' : t('common.create') || 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editTaskDialogOpen} onOpenChange={setEditTaskDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('projects.editTask') || 'Edit Task'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={editTaskForm.handleSubmit(handleEditTask)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-name">{t('projects.taskName') || 'Task Name'} *</Label>
                <Input
                  id="edit-task-name"
                  {...editTaskForm.register('name', { required: true })}
                  data-testid="input-edit-task-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-description">{t('projects.description') || 'Description'}</Label>
                <Textarea
                  id="edit-task-description"
                  {...editTaskForm.register('description')}
                  rows={3}
                  data-testid="input-edit-task-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('projects.status') || 'Status'}</Label>
                  <Controller
                    name="status"
                    control={editTaskForm.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-edit-task-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TASK_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('projects.priority') || 'Priority'}</Label>
                  <Controller
                    name="priority"
                    control={editTaskForm.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-testid="select-edit-task-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TASK_PRIORITIES.map(priority => (
                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-dueDate">{t('projects.dueDate') || 'Due Date'}</Label>
                <Input
                  id="edit-task-dueDate"
                  type="date"
                  {...editTaskForm.register('dueDate')}
                  data-testid="input-edit-task-due-date"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditTaskDialogOpen(false)}>
                  {t('common.cancel') || 'Cancel'}
                </Button>
                <Button type="submit" disabled={isUpdating} data-testid="button-submit-edit-task">
                  {isUpdating ? t('common.saving') || 'Saving...' : t('common.save') || 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('projects.deleteTask') || 'Delete Task'}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('projects.deleteTaskConfirm') || 'Are you sure you want to delete this task? This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel') || 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteTask} 
                className="bg-destructive hover:bg-destructive/90"
                disabled={isDeleting}
                data-testid="button-confirm-delete-task"
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

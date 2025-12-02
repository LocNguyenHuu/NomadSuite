import React, { useState, useRef, useEffect } from 'react';
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
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Download, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Receipt, 
  Upload,
  DollarSign,
  TrendingUp,
  Calendar,
  Tag,
  X,
  Wallet
} from 'lucide-react';
import { useExpenses, ExpenseWithClient } from '@/hooks/use-expenses';
import { useClients } from '@/hooks/use-clients';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAppI18n } from '@/contexts/AppI18nContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { EmptyState } from '@/components/ui/empty-state';
import { staggerContainer, staggerItem, fadeInUp, reducedMotionVariants } from '@/lib/motion';
import { TablePagination, usePagination } from '@/components/ui/table-pagination';

const EXPENSE_CATEGORIES = [
  'Travel',
  'Accommodation',
  'Food & Dining',
  'Transportation',
  'Equipment',
  'Software',
  'Communication',
  'Office Supplies',
  'Professional Services',
  'Insurance',
  'Banking & Fees',
  'Marketing',
  'Education',
  'Entertainment',
  'Other'
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  'Travel': '#3b82f6',
  'Accommodation': '#ef4444',
  'Food & Dining': '#f97316',
  'Transportation': '#eab308',
  'Equipment': '#22c55e',
  'Software': '#06b6d4',
  'Communication': '#8b5cf6',
  'Office Supplies': '#ec4899',
  'Professional Services': '#6366f1',
  'Insurance': '#14b8a6',
  'Banking & Fees': '#f43f5e',
  'Marketing': '#84cc16',
  'Education': '#a855f7',
  'Entertainment': '#f59e0b',
  'Other': '#64748b',
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'VND', 'CHF', 'AUD', 'CAD'] as const;

interface ExpenseFormData {
  date: string;
  amount: string;
  currency: string;
  category: string;
  description: string;
  clientId: string;
  geoLatitude: string;
  geoLongitude: string;
  geoPlace: string;
}

export default function Expenses() {
  const { t } = useAppI18n();
  const { 
    expenses, 
    stats, 
    isLoading,
    createExpenseAsync, 
    updateExpenseAsync, 
    deleteExpenseAsync,
    uploadReceiptAsync,
    isCreating,
    isUpdating,
    isDeleting,
    isUploading
  } = useExpenses();
  const { clients } = useClients();
  const { toast } = useToast();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseWithClient | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseWithClient | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('list');
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, control, reset, setValue, watch } = useForm<ExpenseFormData>({
    defaultValues: {
      currency: 'USD',
      category: 'Other',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  });
  
  const { register: registerEdit, handleSubmit: handleEditSubmit, control: controlEdit, reset: resetEdit, setValue: setEditValue } = useForm<ExpenseFormData>();
  const shouldReduceMotion = useReducedMotion();

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      (expense.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (expense.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      expense.category.toLowerCase().includes(search.toLowerCase()) ||
      (expense.geoPlace || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedExpenses,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredExpenses, 10);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const getCurrentLocation = async (setValueFn: typeof setValue) => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    
    setIsGeoLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setValueFn('geoLatitude', latitude.toString());
        setValueFn('geoLongitude', longitude.toString());
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const place = data.display_name?.split(',').slice(0, 3).join(', ') || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setValueFn('geoPlace', place);
        } catch (error) {
          setValueFn('geoPlace', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        
        setIsGeoLoading(false);
        toast({ title: "Location captured" });
      },
      (error) => {
        setIsGeoLoading(false);
        toast({ title: "Failed to get location", description: error.message, variant: "destructive" });
      },
      { enableHighAccuracy: true }
    );
  };

  const onCreateSubmit = async (data: ExpenseFormData) => {
    try {
      const expense = await createExpenseAsync({
        date: new Date(data.date),
        amount: Math.round(parseFloat(data.amount) * 100),
        currency: data.currency,
        category: data.category as typeof EXPENSE_CATEGORIES[number],
        description: data.description || undefined,
        clientId: data.clientId && data.clientId !== 'none' ? parseInt(data.clientId) : undefined,
        geoLatitude: data.geoLatitude || undefined,
        geoLongitude: data.geoLongitude || undefined,
        geoPlace: data.geoPlace || undefined,
      });
      
      if (selectedFile && expense.id) {
        await uploadReceiptAsync({ id: expense.id, file: selectedFile });
      }
      
      toast({ title: "Expense created successfully" });
      setCreateDialogOpen(false);
      setSelectedFile(null);
      reset();
    } catch (error: any) {
      toast({ title: "Failed to create expense", description: error.message, variant: "destructive" });
    }
  };

  const onEditSubmit = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    
    try {
      await updateExpenseAsync({
        id: editingExpense.id,
        data: {
          date: new Date(data.date),
          amount: Math.round(parseFloat(data.amount) * 100),
          currency: data.currency,
          category: data.category as typeof EXPENSE_CATEGORIES[number],
          description: data.description || undefined,
          clientId: data.clientId && data.clientId !== 'none' ? parseInt(data.clientId) : null,
          geoLatitude: data.geoLatitude || undefined,
          geoLongitude: data.geoLongitude || undefined,
          geoPlace: data.geoPlace || undefined,
        },
      });
      
      if (selectedFile) {
        await uploadReceiptAsync({ id: editingExpense.id, file: selectedFile });
      }
      
      toast({ title: "Expense updated successfully" });
      setEditDialogOpen(false);
      setEditingExpense(null);
      setSelectedFile(null);
      resetEdit();
    } catch (error: any) {
      toast({ title: "Failed to update expense", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    
    try {
      await deleteExpenseAsync(expenseToDelete.id);
      toast({ title: "Expense deleted successfully" });
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error: any) {
      toast({ title: "Failed to delete expense", description: error.message, variant: "destructive" });
    }
  };

  const openEditDialog = (expense: ExpenseWithClient) => {
    setEditingExpense(expense);
    resetEdit({
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
      amount: (expense.amount / 100).toString(),
      currency: expense.currency,
      category: expense.category,
      description: expense.description || '',
      clientId: expense.clientId?.toString() || 'none',
      geoLatitude: expense.geoLatitude || '',
      geoLongitude: expense.geoLongitude || '',
      geoPlace: expense.geoPlace || '',
    });
    setEditDialogOpen(true);
  };

  const handleExportCSV = () => {
    window.open('/api/expenses/export/csv', '_blank');
  };

  const categoryChartData = stats?.expensesByCategory?.map(cat => ({
    name: cat.category,
    value: cat.total / 100,
    count: cat.count,
    color: CATEGORY_COLORS[cat.category] || '#64748b',
  })) || [];

  const monthlyChartData = stats?.expensesByMonth?.map(month => ({
    name: month.month,
    amount: month.total / 100,
  })) || [];

  const ExpenseForm = ({ 
    onSubmit, 
    registerFn, 
    controlRef, 
    isEdit = false,
    setValueFn
  }: { 
    onSubmit: (data: ExpenseFormData) => Promise<void>;
    registerFn: typeof register;
    controlRef: typeof control;
    isEdit?: boolean;
    setValueFn: typeof setValue;
  }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            data-testid="input-expense-date"
            {...registerFn('date', { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            data-testid="input-expense-amount"
            {...registerFn('amount', { required: true })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Controller
            name="currency"
            control={controlRef}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger data-testid="select-expense-currency">
                  <SelectValue placeholder="Select currency" />
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
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={controlRef}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger data-testid="select-expense-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Expense description..."
          data-testid="input-expense-description"
          {...registerFn('description')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientId">Link to Client (Optional)</Label>
        <Controller
          name="clientId"
          control={controlRef}
          render={({ field }) => (
            <Select value={field.value || 'none'} onValueChange={field.onChange}>
              <SelectTrigger data-testid="select-expense-client">
                <SelectValue placeholder="Select client" />
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
        <div className="flex items-center justify-between">
          <Label>Location</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => getCurrentLocation(setValueFn)}
            disabled={isGeoLoading}
            data-testid="button-get-location"
          >
            <MapPin className="h-4 w-4 mr-1" />
            {isGeoLoading ? 'Getting location...' : 'Get Current Location'}
          </Button>
        </div>
        <Input
          placeholder="Location (auto-filled or manual entry)"
          data-testid="input-expense-location"
          {...registerFn('geoPlace')}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Latitude"
            type="hidden"
            {...registerFn('geoLatitude')}
          />
          <Input
            placeholder="Longitude"
            type="hidden"
            {...registerFn('geoLongitude')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Receipt</Label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            accept="image/*,.pdf"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-upload-receipt"
          >
            <Upload className="h-4 w-4 mr-1" />
            {selectedFile ? 'Change Receipt' : 'Upload Receipt'}
          </Button>
          {selectedFile && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Receipt className="h-4 w-4" />
              {selectedFile.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="submit" 
          disabled={isCreating || isUpdating || isUploading}
          data-testid="button-submit-expense"
        >
          {isEdit ? 'Update Expense' : 'Create Expense'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="app-page-header">
            <h1 className="app-page-title" data-testid="text-expenses-title">Expenses</h1>
            <p className="app-page-description">Track and manage your business expenses</p>
          </div>
          <div className="action-button-group">
            <Button variant="outline" onClick={handleExportCSV} data-testid="button-export-expenses">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-expense">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <ExpenseForm 
                  onSubmit={onCreateSubmit} 
                  registerFn={register} 
                  controlRef={control}
                  setValueFn={setValue}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="stat-card-icon bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="stat-card-value" data-testid="text-total-expenses">
              {formatAmount(stats?.totalAmount || 0, 'USD')}
            </div>
            <div className="stat-card-label">Total Expenses</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon bg-blue-100 dark:bg-blue-900/30">
              <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="stat-card-value" data-testid="text-expense-count">
              {stats?.totalExpenses || 0}
            </div>
            <div className="stat-card-label">Total Records</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="stat-card-value">
              {stats?.expensesByCategory?.length || 0}
            </div>
            <div className="stat-card-label">Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon bg-orange-100 dark:bg-orange-900/30">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="stat-card-value">
              {formatAmount(
                stats?.expensesByMonth?.find(m => m.month === format(new Date(), 'yyyy-MM'))?.total || 0,
                'USD'
              )}
            </div>
            <div className="stat-card-label">This Month</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="list" data-testid="tab-expense-list">
              <Receipt className="h-4 w-4 mr-2" />
              Expense List
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-expense-analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-expenses"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48" data-testid="select-category-filter">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading expenses...
                      </TableCell>
                    </TableRow>
                  ) : expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-0 border-0">
                        <EmptyState
                          icon={Wallet}
                          title="No Expenses Yet"
                          description="Track your business expenses with geo-tagging, receipt uploads, and category breakdowns."
                          actionLabel="Add Your First Expense"
                          onAction={() => setCreateDialogOpen(true)}
                          variant="minimal"
                        />
                      </TableCell>
                    </TableRow>
                  ) : filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No expenses match your search. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedExpenses.map((expense) => (
                      <TableRow key={expense.id} data-testid={`row-expense-${expense.id}`}>
                        <TableCell>
                          {format(new Date(expense.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: `${CATEGORY_COLORS[expense.category]}20`,
                              color: CATEGORY_COLORS[expense.category],
                              borderColor: CATEGORY_COLORS[expense.category]
                            }}
                          >
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {expense.description || '-'}
                        </TableCell>
                        <TableCell>
                          {expense.clientName || '-'}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {expense.geoPlace ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate">{expense.geoPlace}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatAmount(expense.amount, expense.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {expense.receiptUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(expense.receiptUrl!, '_blank')}
                                data-testid={`button-view-receipt-${expense.id}`}
                              >
                                <Receipt className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(expense)}
                              data-testid={`button-edit-expense-${expense.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setExpenseToDelete(expense);
                                setDeleteDialogOpen(true);
                              }}
                              data-testid={`button-delete-expense-${expense.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {filteredExpenses.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {categoryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No expense data to display
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No expense data to display
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryChartData.slice(0, 5).map((cat, index) => (
                    <div key={cat.name} className="flex items-center gap-4">
                      <div className="w-6 text-center text-muted-foreground font-medium">
                        #{index + 1}
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-muted-foreground">
                            {cat.count} expense{cat.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(cat.value / (stats?.totalAmount || 1) * 100) * 100}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                      <div className="font-bold">${cat.value.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm 
              onSubmit={onEditSubmit}
              registerFn={registerEdit}
              controlRef={controlEdit}
              isEdit={true}
              setValueFn={setEditValue}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this expense? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
                data-testid="button-confirm-delete"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}

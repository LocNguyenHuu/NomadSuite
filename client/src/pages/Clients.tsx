import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TablePagination, usePagination } from '@/components/ui/table-pagination';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreHorizontal, Mail, FileText, LayoutGrid, List as ListIcon, MapPin, Calendar, Trash2, Edit, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '@/components/ui/empty-state';
import { staggerContainer, staggerItem, tableRowVariants } from '@/lib/motion';
import { useClients } from '@/hooks/use-clients';
import { InsertClient, Client, Invoice } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useLocation } from 'wouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAppI18n } from '@/contexts/AppI18nContext';

export default function Clients() {
  const { t } = useAppI18n();
  const { clients, createClientAsync, updateClient, deleteClientAsync } = useClients();
  const { data: invoices } = useQuery<Invoice[]>({ queryKey: ['/api/invoices'] });
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<InsertClient>();
  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit, control: controlEdit } = useForm();

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const leadClients = clients.filter(c => c.status === 'Lead').length;
  const conversionRate = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;
  
  const overdueInvoicesCount = invoices?.filter(i => i.status === 'Overdue').length || 0;
  const clientsWithOverdue = invoices 
    ? new Set(invoices.filter(i => i.status === 'Overdue').map(i => i.clientId)).size 
    : 0;
  const overdueRate = totalClients > 0 ? Math.round((clientsWithOverdue / totalClients) * 100) : 0;

  const actionOverdueCount = clients.filter(c => c.nextActionDate && new Date(c.nextActionDate) < new Date()).length;

  // Get unique countries for filter (filter out empty/undefined values)
  const uniqueCountries = Array.from(new Set(clients.map(c => c.country).filter(Boolean))).sort();

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          (c.country || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || c.country === countryFilter;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedClients,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredClients, 10);

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest('PATCH', `/api/clients/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({ title: "Client updated successfully" });
      setEditDialogOpen(false);
      setEditingClient(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update client",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createClientAsync({ ...data, status: 'Lead' });
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const onEditSubmit = (data: any) => {
    if (!editingClient) return;
    
    const updateData: any = {};

    // Only include changed fields
    if (data.name && data.name.trim() !== editingClient.name) {
      updateData.name = data.name.trim();
    }

    if (data.email && data.email.trim() !== editingClient.email) {
      updateData.email = data.email.trim();
    }

    if (data.country && data.country.trim() !== editingClient.country) {
      updateData.country = data.country.trim();
    }

    if (data.status && data.status !== editingClient.status) {
      updateData.status = data.status;
    }

    // Handle notes: only update if actually changed (comparing normalized empty values)
    const normalizedNewNotes = data.notes?.trim() || null;
    const normalizedExistingNotes = editingClient.notes?.trim() || null;
    if (normalizedNewNotes !== normalizedExistingNotes) {
      updateData.notes = normalizedNewNotes;
    }

    // Only send update if there are actual changes
    if (Object.keys(updateData).length === 0) {
      toast({ title: "No changes detected" });
      setEditDialogOpen(false);
      return;
    }

    updateClientMutation.mutate({ id: editingClient.id, data: updateData });
  };

  const openEditDialog = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(client);
    resetEdit({
      name: client.name,
      email: client.email,
      country: client.country,
      status: client.status,
      notes: client.notes || '',
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      try {
        await deleteClientAsync(clientToDelete.id);
        setDeleteDialogOpen(false);
        setClientToDelete(null);
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="app-page-header">
            <h1 className="app-page-title">{t('clients.title')}</h1>
            <p className="app-page-description">Manage your relationships and pipeline</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" placeholder="Acme Corp" {...register('name', { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@acme.com" {...register('email', { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="USA" {...register('country', { required: true })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Initial Notes</Label>
                  <Input id="notes" placeholder="Lead from LinkedIn..." {...register('notes')} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="nextActionDate">Next Action Date</Label>
                    <Input id="nextActionDate" type="date" {...register('nextActionDate')} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="nextActionDescription">Next Action</Label>
                    <Input id="nextActionDescription" placeholder="Follow up call..." {...register('nextActionDescription')} />
                </div>
                <DialogFooter>
                  <Button type="submit">Save Client</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="stat-card-icon bg-primary/10">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <div className="stat-card-value">{conversionRate}%</div>
            <div className="stat-card-label">Conversion Rate</div>
            <p className="text-xs text-muted-foreground mt-2">Leads to Active</p>
          </div>
          <div className={`stat-card ${actionOverdueCount > 0 ? 'border-amber-200 dark:border-amber-800/50' : ''}`}>
            <div className={`stat-card-icon ${actionOverdueCount > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-muted'}`}>
              <Calendar className={`h-5 w-5 ${actionOverdueCount > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
            </div>
            <div className={`stat-card-value ${actionOverdueCount > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}>{actionOverdueCount}</div>
            <div className="stat-card-label">Action Overdue</div>
            <p className="text-xs text-muted-foreground mt-2">Need attention</p>
          </div>
          <div className={`stat-card ${clientsWithOverdue > 0 ? 'border-red-200 dark:border-red-800/50' : ''}`}>
            <div className={`stat-card-icon ${clientsWithOverdue > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'}`}>
              <FileText className={`h-5 w-5 ${clientsWithOverdue > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
            </div>
            <div className={`stat-card-value ${clientsWithOverdue > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{clientsWithOverdue}</div>
            <div className="stat-card-label">Overdue Invoices</div>
            <p className="text-xs text-muted-foreground mt-2">{overdueRate}% of clients</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon bg-muted">
              <ListIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="stat-card-value">{totalClients}</div>
            <div className="stat-card-label">Total Clients</div>
            <p className="text-xs text-muted-foreground mt-2">{activeClients} Active, {leadClients} Leads</p>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="list"><ListIcon className="mr-2 h-4 w-4" /> List View</TabsTrigger>
              <TabsTrigger value="board"><LayoutGrid className="mr-2 h-4 w-4" /> Pipeline Board</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                    placeholder="Search clients..." 
                    className="pl-8 bg-card w-[200px] sm:w-[250px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {uniqueCountries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="hidden md:table-cell">Last Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Next Action</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.map((client) => (
                    <TableRow key={client.id} className="group cursor-pointer hover:bg-muted/50" onClick={() => setLocation(`/app/clients/${client.id}`)}>
                      <TableCell className="font-medium">
                        <div>{client.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{client.email}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={client.status} />
                      </TableCell>
                      <TableCell>{client.country}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {client.lastInteractionDate ? format(new Date(client.lastInteractionDate), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {client.nextActionDate ? (
                            <div className="flex flex-col">
                                <span className={new Date(client.nextActionDate) < new Date() ? "text-destructive font-medium" : ""}>
                                    {format(new Date(client.nextActionDate), 'MMM d')}
                                </span>
                                <span className="text-xs">{client.nextActionDescription}</span>
                            </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setLocation(`/app/clients/${client.id}`); }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => openEditDialog(client, e)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* TODO: Invoice */ }}>
                              <FileText className="mr-2 h-4 w-4" /> Create Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => handleDeleteClick(client, e)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredClients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No clients found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {filteredClients.length > 0 && (
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

          <TabsContent value="board" className="h-full overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[800px]">
               {['Lead', 'Proposal', 'Active', 'Completed'].map((status) => (
                   <div key={status} className="flex-1 min-w-[250px] bg-muted/30 rounded-xl p-4 flex flex-col gap-3">
                       <div className="flex items-center justify-between mb-2">
                           <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{status}</h3>
                           <Badge variant="secondary" className="rounded-full px-2">
                               {filteredClients.filter(c => c.status === status).length}
                           </Badge>
                       </div>
                       
                       {filteredClients.filter(c => c.status === status).map(client => (
                           <Card key={client.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setLocation(`/app/clients/${client.id}`)}>
                               <CardContent className="p-4 space-y-3">
                                   <div className="flex justify-between items-start">
                                       <h4 className="font-bold truncate">{client.name}</h4>
                                       {client.country && (
                                           <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                               {client.country}
                                           </span>
                                       )}
                                   </div>
                                   
                                   {client.nextActionDate && (
                                       <div className="flex items-center gap-2 text-xs text-amber-600 font-medium bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded">
                                           <Calendar className="h-3 w-3" />
                                           <span>{format(new Date(client.nextActionDate), 'MMM d')}</span>
                                       </div>
                                   )}
                                   
                                   <div className="flex items-center justify-between pt-2 border-t">
                                       <div className="text-xs text-muted-foreground">
                                           {client.email}
                                       </div>
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={(e) => openEditDialog(client, e)}>
                                                    <Edit className="mr-2 h-3 w-3" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuLabel>Move to...</DropdownMenuLabel>
                                                {['Lead', 'Proposal', 'Active', 'Completed'].filter(s => s !== status).map(s => (
                                                    <DropdownMenuItem key={s} onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateClient({ id: client.id, data: { status: s } });
                                                    }}>
                                                        {s}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                   </div>
                               </CardContent>
                           </Card>
                       ))}
                       
                       {filteredClients.filter(c => c.status === status).length === 0 && (
                           <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-lg border-muted-foreground/20 text-muted-foreground/50 text-sm">
                               Empty
                           </div>
                       )}
                   </div>
               ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Client Dialog */}
      {editingClient && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Update client information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input 
                    id="edit-name" 
                    {...registerEdit('name', { required: true })} 
                    data-testid="input-edit-client-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input 
                    id="edit-email" 
                    type="email"
                    {...registerEdit('email', { required: true })} 
                    data-testid="input-edit-client-email"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country *</Label>
                  <Input 
                    id="edit-country" 
                    {...registerEdit('country', { required: true })} 
                    data-testid="input-edit-client-country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Controller
                    name="status"
                    control={controlEdit}
                    defaultValue={editingClient.status}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger data-testid="select-edit-client-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lead">Lead</SelectItem>
                          <SelectItem value="Proposal">Proposal</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input 
                  id="edit-notes" 
                  {...registerEdit('notes')} 
                  placeholder="Optional notes about this client"
                  data-testid="input-edit-client-notes"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateClientMutation.isPending} data-testid="button-save-client-edit">
                  {updateClientMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{clientToDelete?.name}</strong> and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Active': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Lead': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Proposal': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Completed': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
